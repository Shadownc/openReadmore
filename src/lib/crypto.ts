import crypto from "crypto";

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hmacSha256(secret: string, value: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function numericCodeFromHex(hex: string, length: number) {
  const value = BigInt(`0x${hex.slice(0, 15)}`);
  const modulo = BigInt(10 ** length);
  return String(value % modulo).padStart(length, "0");
}
