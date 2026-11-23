import type { ReactNode } from "react";

import { AdminGuard } from "@/components/auth/AdminGuard";

import { AdminShell } from "./_components/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
