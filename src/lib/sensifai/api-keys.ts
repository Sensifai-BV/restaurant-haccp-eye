import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "revoked";
}

let inMemoryKeys: ApiKeyRecord[] = [];
const KEYS_FILE_PATH = path.resolve(process.cwd(), ".dev-api-keys.json");

function loadStoredKeys(): ApiKeyRecord[] {
  try {
    if (fs.existsSync(KEYS_FILE_PATH)) {
      const data = fs.readFileSync(KEYS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryKeys = parsed;
      }
    }
  } catch (err) {
    console.warn("[API_KEYS] Could not load stored keys:", err);
  }
  return inMemoryKeys;
}

function persistKeys(keys: ApiKeyRecord[]) {
  inMemoryKeys = keys;
  try {
    fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keys, null, 2), "utf-8");
  } catch (err) {
    console.warn("[API_KEYS] Could not persist keys:", err);
  }
}

/**
 * Generates a brand-new, cryptographically secure application API key.
 * Format: rh_live_<32 hex chars>
 * Zero personal Logto IDs, personal tokens, or hardcoded credentials.
 */
export function createNewApiKey(name = "Kitchen Station HACCP Audit Key"): ApiKeyRecord {
  const keys = loadStoredKeys();
  const randomBytes = crypto.randomBytes(24).toString("hex");
  const rawKey = `rh_live_${randomBytes}`;
  const maskedKey = `${rawKey.slice(0, 11)}...${rawKey.slice(-4)}`;

  const newKey: ApiKeyRecord = {
    id: `key_${crypto.randomUUID().slice(0, 8)}`,
    name,
    key: rawKey,
    maskedKey,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    status: "active",
  };

  keys.unshift(newKey);
  persistKeys(keys);
  return newKey;
}

export function listApiKeys(): ApiKeyRecord[] {
  return loadStoredKeys();
}

export function validateApiKey(rawKey: string): ApiKeyRecord | null {
  if (!rawKey || !rawKey.startsWith("rh_live_")) return null;
  const keys = loadStoredKeys();
  const found = keys.find((k) => k.key === rawKey && k.status === "active");
  if (found) {
    found.lastUsedAt = new Date().toISOString();
    persistKeys(keys);
    return found;
  }
  return null;
}

export function revokeApiKey(id: string): boolean {
  const keys = loadStoredKeys();
  const target = keys.find((k) => k.id === id);
  if (target) {
    target.status = "revoked";
    persistKeys(keys);
    return true;
  }
  return false;
}
