import { hmacSha256 } from "./crypto";

function getSecret() {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

export function signUnlockToken(payload: {
  blogId: string;
  visitorId: string;
  expireAt: Date;
}) {
  const body = `${payload.blogId}.${payload.visitorId}.${payload.expireAt.getTime()}`;
  const signature = hmacSha256(getSecret(), body);
  return `${body}.${signature}`;
}

export function verifyUnlockToken(token: string, blogId: string) {
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [tokenBlogId, visitorId, expireAtMs, signature] = parts;
  if (tokenBlogId !== blogId || !visitorId || !expireAtMs) return false;
  const body = `${tokenBlogId}.${visitorId}.${expireAtMs}`;
  if (hmacSha256(getSecret(), body) !== signature) return false;
  return Number(expireAtMs) > Date.now();
}

export function signPasswordResetToken(userId: string, expireAt: Date) {
  const body = `${userId}.${expireAt.getTime()}`;
  return `${body}.${hmacSha256(getSecret(), body)}`;
}

export function verifyPasswordResetToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expireAtMs, signature] = parts;
  if (!userId || !expireAtMs) return null;
  const body = `${userId}.${expireAtMs}`;
  if (hmacSha256(getSecret(), body) !== signature) return null;
  if (Number(expireAtMs) <= Date.now()) return null;
  return { userId };
}
