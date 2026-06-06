"use client";

import type { ReactNode } from "react";
import SimpleBar from "simplebar-react";

type FrontendScrollAreaProps = {
  children: ReactNode;
  variant: "premium" | "cyber" | "light";
};

export function FrontendScrollArea({ children, variant }: FrontendScrollAreaProps) {
  return (
    <SimpleBar
      className={`frontend-scroll frontend-scroll-${variant} h-screen`}
      scrollableNodeProps={{ className: "frontend-scroll-viewport" }}
      autoHide={false}
    >
      {children}
    </SimpleBar>
  );
}
