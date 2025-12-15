import { NextResponse } from "next/server";

export async function GET() {
  await new Promise((r) => setTimeout(r, 800));

  const attestation = {
    module_id: "5a8f9c2d1b7e3f4a0c8d9e2b1a6c5d4e3f2b1a0c9d8e7f6a5b4c3d2e1f0a9b8", 
    timestamp: Date.now(),
    digest: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    signature: "0x9d2e1f8a7b6c5d4e3f2b1a0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0", 
  };

  return NextResponse.json(attestation);
}
