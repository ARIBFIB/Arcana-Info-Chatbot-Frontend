"use client";

import { Typography } from "antd";

import { APP_NAME } from "@/constants";

type AppLogoProps = {
  collapsed?: boolean;
};

export function AppLogo({ collapsed }: AppLogoProps) {
  return (
    <Typography.Text
      strong
      style={{
        fontSize: collapsed ? 14 : 16,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {collapsed ? "AI" : APP_NAME}
    </Typography.Text>
  );
}
