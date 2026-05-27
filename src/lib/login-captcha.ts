import { cookies } from "next/headers";
import { hmacSha256, sha256 } from "./crypto";

const COOKIE_NAME = "wxgzh_login_captcha";
const EXPIRES_SECONDS = 180;
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function getSecret() {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

export function generateLoginCaptcha() {
  let code = "";
  for (let index = 0; index < 5; index += 1) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function createCaptchaCookieValue(code: string) {
  const expireAt = Date.now() + EXPIRES_SECONDS * 1000;
  const hash = sha256(code.toLowerCase());
  const body = `${hash}.${expireAt}`;
  return `${body}.${hmacSha256(getSecret(), body)}`;
}

export async function setLoginCaptchaCookie(code: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createCaptchaCookieValue(code), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: EXPIRES_SECONDS,
    path: "/",
  });
}

export async function verifyLoginCaptcha(input: string) {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  cookieStore.delete(COOKIE_NAME);
  if (!value || !input) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [hash, expireAt, signature] = parts;
  const body = `${hash}.${expireAt}`;
  if (hmacSha256(getSecret(), body) !== signature) return false;
  if (Number(expireAt) < Date.now()) return false;
  return sha256(input.trim().toLowerCase()) === hash;
}

export function captchaSvg(code: string) {
  const chars = code.split("");
  const text = chars
    .map((char, index) => {
      const x = 20 + index * 21;
      const y = 31 + (index % 2 === 0 ? 0 : 2);
      const rotate = index % 2 === 0 ? -8 : 7;
      return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="42" viewBox="0 0 130 42">
    <rect width="130" height="42" fill="#f1f5f9"/>
    <path d="M4 10 C30 2, 45 32, 72 14 S105 3, 126 25" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.65"/>
    <path d="M2 28 C26 18, 46 4, 78 20 S108 33, 129 12" stroke="#64748b" stroke-width="1.2" fill="none" opacity="0.45"/>
    <g font-family="Consolas, monospace" font-size="26" font-weight="800" font-style="italic" fill="#0f172a">${text}</g>
  </svg>`;
}
