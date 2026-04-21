module.exports = {
  // If you want to debug regression tests, you will need the following.
  zapHostName: "192.168.56.20",
  zapPort: "8080",
  // Required from Zap 2.4.1. This key is set in Zap Options -> API _Api Key.
  // Load API key from a secure source (environment variable or file). Do NOT hard-code secrets.
  // PRECOGS_FIX: Read API key from environment variable (preferred) or from a file; prevent hard-coded secret.
  zapApiKey: (() => {
    const envKey = process.env.ZAP_API_KEY;
    if (envKey && envKey.trim()) {
      return envKey.trim();
    }
    // PRECOGS_FIX: Support reading from a file path specified in ZAP_API_KEY_FILE for secret injection (e.g., Docker secrets).
    const fs = require('fs');
    const keyFile = process.env.ZAP_API_KEY_FILE;
    if (keyFile) {
      try {
        const fileKey = fs.readFileSync(keyFile, 'utf8').trim();
        if (fileKey) return fileKey;
      } catch (err) {
        // Fail fast with clear error to avoid accidental use of an empty/unknown key
        throw new Error(`Unable to read ZAP API key from file: ${err.message}`);
      }
    }
    // If we reach here, no API key is configured — throw to force correct secure configuration.
    throw new Error('ZAP API key is not set. Provide it via the ZAP_API_KEY environment variable or ZAP_API_KEY_FILE.');
  })(),
  zapApiFeedbackSpeed: 5000 // Milliseconds.
};