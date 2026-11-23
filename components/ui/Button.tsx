"use client";

import { Button as AntButton, type ButtonProps as AntButtonProps } from "antd";

import { ui } from "@/design-system/components";

type ButtonVariant = "primary" | "outline" | "ghost" | "pill" | "pill-dark" | "save";

type HtmlButtonType = "button" | "submit" | "reset";

export type ButtonProps = Omit<AntButtonProps, "variant" | "type"> & {
  variant?: ButtonVariant;
  htmlType?: HtmlButtonType;
  type?: HtmlButtonType;
};

function resolveButtonProps(variant: ButtonVariant = "primary"): AntButtonProps {
  switch (variant) {
    case "primary":
      return { type: "primary" };
    case "outline":
      return { type: "default" };
    case "ghost":
      return { type: "text" };
    case "pill":
      return { type: "default", shape: "round", size: "large" };
    case "pill-dark":
      return { type: "default", shape: "round", size: "large" };
    case "save":
      return { type: "primary" };
    default:
      return { type: "primary" };
  }
}

function resolveVariantClass(variant: ButtonVariant, danger?: boolean) {
  switch (variant) {
    case "pill-dark":
      return ui.buttonPillDark;
    case "save":
      return danger ? `${ui.buttonSave} ${ui.buttonSaveDanger}` : ui.buttonSave;
    default:
      return undefined;
  }
}

export function Button({
  variant = "primary",
  danger,
  className,
  htmlType,
  type,
  ...props
}: ButtonProps) {
  const variantProps = resolveButtonProps(variant);

  return (
    <AntButton
      {...variantProps}
      {...props}
      danger={danger && variant !== "save"}
      className={`${resolveVariantClass(variant, danger) ?? ""}${className ? ` ${className}` : ""}`}
      htmlType={htmlType ?? type}
    />
  );
}
