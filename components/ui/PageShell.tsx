"use client";

import { Flex, Layout } from "antd";
import type { ReactNode } from "react";

import { ui } from "@/design-system/components";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

const { Content } = Layout;

export function PageShell({ children, className }: PageShellProps) {
  return (
    <Layout className={className}>
      <Content className={ui.pageShell}>{children}</Content>
    </Layout>
  );
}

export { Flex };
