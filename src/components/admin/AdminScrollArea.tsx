"use client";

import type { ReactNode } from "react";
import SimpleBar from "simplebar-react";

type AdminScrollbarProps = {
  children: ReactNode;
  className?: string;
  scrollableNodeClassName?: string;
};

export function AdminScrollbar({ children, className, scrollableNodeClassName }: AdminScrollbarProps) {
  return (
    <SimpleBar
      className={className}
      scrollableNodeProps={{ className: scrollableNodeClassName }}
      autoHide={false}
    >
      {children}
    </SimpleBar>
  );
}

type AdminScrollAreaProps = {
  topbar: ReactNode;
  children: ReactNode;
};

export function AdminScrollArea({ topbar, children }: AdminScrollAreaProps) {
  return (
    <AdminScrollbar className="admin-scroll ml-60 h-screen" scrollableNodeClassName="admin-scroll-viewport overflow-x-hidden">
      <header className="admin-topbar sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
        {topbar}
      </header>
      <div className="admin-content p-4">{children}</div>
    </AdminScrollbar>
  );
}
