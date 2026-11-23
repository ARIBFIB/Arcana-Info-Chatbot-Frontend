"use client";

import { App, ConfigProvider } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

import { getAntdTheme } from "@/design-system";

type AntdProviderProps = {
  children: ReactNode;
};

export function AntdProvider({ children }: AntdProviderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard to avoid hydration mismatch before theme is resolved
    setMounted(true);
  }, []);

  // Before hydration we don't know the resolved theme yet — default to
  // dark so the initial paint matches the app's default (avoids flash).
  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <ConfigProvider theme={getAntdTheme(isDark)}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
