import { NextRequest } from "next/server";

export function getRequestIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    ""
  );
}

export function getUserAgent(request: NextRequest) {
  return request.headers.get("user-agent") || "";
}

export function getAppUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}
