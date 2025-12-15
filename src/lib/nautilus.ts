export interface AttestationDoc {
  module_id: string; 
  timestamp: number;
  digest: string;
  signature: string;
}

export interface EnclaveResponse<T> {
  success: boolean;
  data?: T;
  signature?: string;
  error?: string;
}

export class NautilusClient {
  private enclaveUrl: string;

  constructor(enclaveUrl: string = "/api/nautilus") {
    this.enclaveUrl = enclaveUrl;
  }

  
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.enclaveUrl}/health`);
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  /**
   * Fetches the Remote Attestation Document (PCR values signed by AWS Nitro).
   */
  async getAttestation(): Promise<AttestationDoc> {
    const res = await fetch(`${this.enclaveUrl}/attest`);
    if (!res.ok) {
      throw new Error(`Enclave Attestation Failed: ${res.statusText}`);
    }
    return res.json();
  }

  
  async verifyAttestation(doc: AttestationDoc): Promise<boolean> {
    const now = Date.now();
    if (doc.timestamp > now + 60000 || doc.timestamp < now - 600000) {
      console.warn("Enclave clock skew detected");
    }
    return true; 
  }

  
  async execute<T>(payload: any): Promise<EnclaveResponse<T>> {
    const res = await fetch(`${this.enclaveUrl}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Enclave Execution Failed: ${res.statusText}`);
    }

    return res.json();
  }
}

export const nautilus = new NautilusClient();
