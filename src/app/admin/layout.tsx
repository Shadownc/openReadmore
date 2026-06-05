import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAppTheme } from "@/lib/server-theme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/admin/LogoutButton";

type IconName = "home" | "blog" | "records" | "users";

function MenuIcon({ name }: { name: IconName }) {
  const common = "h-[18px] w-[18px] stroke-current stroke-[1.8]";
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path d="M3.5 10.8 12 4l8.5 6.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 10.5V20h11v-9.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "blog") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path d="M7 4.5h7l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 19V6A1.5 1.5 0 0 1 7.5 4.5Z" strokeLinejoin="round" />
        <path d="M14 4.5V8h3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12h6M9 15h6M9 18h3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "records") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path d="M5 5.5h14M5 12h14M5 18.5h14" strokeLinecap="round" />
        <path d="M8 3.5v4M16 10v4M11 16.5v4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
    </svg>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, theme] = await Promise.all([requireUser(), getAppTheme()]);
  const menus: Array<{ href: string; label: string; icon: IconName }> = [
    { href: "/admin/blogs", label: "博客注册", icon: "blog" },
    { href: "/admin/records", label: "浏览记录", icon: "records" },
    ...(user.role === "SUPER_ADMIN" ? [{ href: "/admin/users", label: "用户管理", icon: "users" as const }] : []),
  ];

  return (
    <div className={`admin-shell admin-${theme} h-screen overflow-hidden text-slate-800`} data-admin-theme={theme}>
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-30 w-60 border-r border-slate-200 bg-white shadow-[6px_0_24px_rgba(15,23,42,0.035)]">
        <div className="flex h-14 items-center gap-3 border-b border-slate-100 px-5">
          <div className="admin-brand-mark flex h-8 w-8 items-center justify-center rounded-lg bg-[#3f8df5] text-sm font-bold text-white">阅</div>
          <div>
            <div className="admin-brand-title text-sm font-semibold text-slate-900">博客引流公众号</div>
            <div className="admin-brand-subtitle text-[11px] text-slate-400">Readmore Admin</div>
          </div>
        </div>
        <nav className="p-3">
          <Link href="/" className="admin-nav-link group mb-1 flex h-10 items-center gap-3 rounded-md px-3 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-[#3f8df5]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 transition group-hover:text-[#3f8df5]"><MenuIcon name="home" /></span>
            <span>首页</span>
          </Link>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="admin-nav-section mb-2 px-3 text-xs text-slate-400">博客引流公众号</div>
            {menus.map((menu) => (
              <Link key={menu.href} href={menu.href} className="admin-nav-link group mb-1 flex h-10 items-center gap-3 rounded-md border-l-2 border-transparent px-3 text-sm text-slate-600 transition hover:border-[#3f8df5] hover:bg-blue-50 hover:text-[#3f8df5]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 transition group-hover:text-[#3f8df5]"><MenuIcon name={menu.icon} /></span>
                <span>{menu.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
      <main className="admin-scroll ml-60 h-screen overflow-y-auto overflow-x-hidden">
        <header className="admin-topbar sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="text-sm text-slate-500">
            当前用户：<span className="font-medium text-slate-900">{user.name}</span>
            <span className="ml-2 text-slate-400">{user.role === "SUPER_ADMIN" ? "超级管理员" : "普通用户"}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400">{user.email}</div>
            <ThemeToggle theme={theme} variant={theme} className="admin-theme-toggle" />
            <LogoutButton />
          </div>
        </header>
        <div className="admin-content p-4">{children}</div>
      </main>
    </div>
  );
}
