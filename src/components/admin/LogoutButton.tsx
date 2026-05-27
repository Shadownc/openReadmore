"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
      退出登录
    </button>
  );
}
