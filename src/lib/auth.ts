import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { randomToken, sha256 } from "./crypto";
import type { CurrentUser } from "./types";

const SESSION_COOKIE = "wxgzh_session";
const SESSION_DAYS = 7;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = randomToken(32);
  const headerStore = await headers();
  const expireAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId,
      sessionTokenHash: sha256(token),
      expireAt,
      ip: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "",
      userAgent: headerStore.get("user-agent") || "",
    },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expireAt,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { sessionTokenHash: sha256(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { sessionTokenHash: sha256(token) },
    include: { user: true },
  });
  if (!session || session.expireAt <= new Date() || session.user.status !== "ACTIVE") {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    status: session.user.status,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") redirect("/admin/blogs");
  return user;
}

export function isSuperAdmin(user: CurrentUser) {
  return user.role === "SUPER_ADMIN";
}
