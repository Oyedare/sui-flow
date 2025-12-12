---
description: How to deploy Sui Flow to Walrus Sites
---

# Deploying to Walrus Sites

Since your application is now built as a static export in the `out/` directory, you can deploy it to Walrus Sites.

## Option 1: Walrus Sites Portal (Recommended)

1.  Visit the **Walrus Sites** portal (e.g., [https://publish.walrus.site/](https://publish.walrus.site/) or the current testnet portal).
2.  Connect your Sui Wallet.
3.  Select **"New Site"** or **"Upload"**.
4.  Drag and drop the entire contents of the `c:\Users\pc\Desktop\sui-flow\out` folder into the upload area.
5.  Sign the transaction to confirm the upload.
6.  Once complete, you will receive a `walrus.site` URL (e.g., `https://<sui-ns-name>.walrus.site` or a default subdomain).

## Option 2: Using Walrus Sites CLI (Advanced)

If you have the `site-builder` or `walrus` CLI installed:

1.  Open your terminal.
2.  Navigate to the project root:
    ```bash
    cd c:\Users\pc\Desktop\sui-flow
    ```
3.  Run the deploy command (example):
    ```bash
    walrus-sites deploy ./out --epochs 100
    ```
4.  Follow the prompts to sign the transaction.

## Verification

After deployment:
1.  Open the provided Walrus Site URL.
2.  Verify that images load correctly (thanks to our static export fix).
3.  Test the "Connect Wallet" feature.
4.  Run the **Onboarding Tour** to ensure it works in the production environment.
