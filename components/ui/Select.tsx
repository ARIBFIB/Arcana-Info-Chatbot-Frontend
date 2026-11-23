"use client";

import { Select as AntSelect, type SelectProps } from "antd";

export function Select(props: SelectProps) {
  return (
    <AntSelect size="large" styles={{ popup: { root: { zIndex: 2100 } } }} {...props} />
  );
}
