const _ = require("underscore");
const path = require("path");
const util = require("util");

const finalEnv = process.env.NODE_ENV || "development";

// Load the canonical 'all' config first
const allConf = require(path.resolve(__dirname + "/../config/env/all.js"));

// Normalize and restrict NODE_ENV to an explicit whitelist to prevent path traversal or arbitrary file loading
const allowedEnvs = new Set(["development", "production", "test", "staging"]);
const normalizedEnv = (finalEnv || "").toLowerCase();
const chosenEnv = allowedEnvs.has(normalizedEnv) ? normalizedEnv : "development"; // PRECOGS_FIX: restrict and normalize NODE_ENV to a whitelist

let envConf = {};
try {
  // Build path only from a validated environment name; prevents attacker-controlled traversal
  envConf = require(path.resolve(__dirname, "../config/env", chosenEnv + ".js")) || {};
} catch (err) {
  // If the environment-specific file is missing or fails to load, fall back to empty config and log safely
  envConf = {};
  console.error(`Failed to load environment config for '${chosenEnv}':`, err && err.message ? err.message : err);
}

const config = { ...allConf, ...envConf };

// Redact obviously sensitive fields before logging; avoid dumping secrets to logs in production
function redact(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return '[Circular]';
  seen.add(obj);
  if (Array.isArray(obj)) return obj.map(v => redact(v, seen));
  const out = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (/(password|passwd|pwd|secret|token|key|credential|api[_-]?key)/i.test(k)) {
      out[k] = '[REDACTED]';
    } else if (typeof v === 'object' && v !== null) {
      out[k] = redact(v, seen);
    } else {
      out[k] = v;
    }
  }
  return out;
}

if (chosenEnv === 'production') {
  console.log(`Config loaded for environment: ${chosenEnv} (sensitive values redacted)`); // PRECOGS_FIX: do not print full config in production
} else {
  console.log(`Current Config (redacted):`);
  console.log(util.inspect(redact(config), { depth: null })); // PRECOGS_FIX: redact sensitive fields before logging
}

module.exports = config;
