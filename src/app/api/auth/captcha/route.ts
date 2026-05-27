import { NextResponse } from "next/server";
import { captchaSvg, generateLoginCaptcha, setLoginCaptchaCookie } from "@/lib/login-captcha";

export async function GET() {
  const code = generateLoginCaptcha();
  await setLoginCaptchaCookie(code);
  return new NextResponse(captchaSvg(code), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
