// default app configuration
const port = process.env.PORT || 4000;
let db = process.env.MONGODB_URI || "mongodb://localhost:27017/nodegoat";

// Load sensitive secrets from environment / secret store. Do NOT hardcode secrets in source.
// Exit early if required secrets are missing to avoid running with insecure defaults.
const cookieSecret = process.env.COOKIE_SECRET; // PRECOGS_FIX: read secret from environment, removed hardcoded value
const cryptoKey = process.env.CRYPTO_KEY;     // PRECOGS_FIX: read crypto key from environment, removed hardcoded value
const cryptoAlgo = process.env.CRYPTO_ALGO || "aes-256-gcm"; // PRECOGS_FIX: explicitly prefer a secure AEAD algorithm

if (!cookieSecret || !cryptoKey) {
    console.error('FATAL: Missing required secrets. Set COOKIE_SECRET and CRYPTO_KEY as environment variables.');
    // Fail-fast to avoid running with insecure embedded defaults
    process.exit(1);
}

module.exports = {
    port,
    db,
    cookieSecret,
    cryptoKey,
    cryptoAlgo,
    hostName: "localhost",
    environmentalScripts: []
};