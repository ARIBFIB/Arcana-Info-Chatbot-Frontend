"use client";

import { Input as AntInput, type InputProps as AntInputProps } from "antd";
import { Eye, EyeOff } from "lucide-react";

export type InputProps = AntInputProps & {
  fieldClassName?: string;
};

export function Input({ fieldClassName, className, type, ...props }: InputProps) {
  const mergedClassName = `${className ?? ""}${fieldClassName ? ` ${fieldClassName}` : ""}`;

  // NOTE: type="password" ke liye AntD ka Input.Password use kar rahe hain -
  // isme built-in show/hide toggle hota hai, sirf icon ko app ke apne
  // (lucide-react) Eye/EyeOff icons se render kar rahe hain taake baaki
  // app ke icons se visually consistent lage. AuthCard.tsx aur
  // RegisterCard.tsx dono <Input type="password" .../> use karte hain,
  // isliye ye ek jagah ka fix dono forms (login + register) mein
  // automatically apply ho jayega - unme koi change nahi karna pada.
  if (type === "password") {
    return (
      <AntInput.Password
        size="large"
        className={mergedClassName}
        iconRender={(visible) =>
          visible ? (
            <EyeOff size={16} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <Eye size={16} style={{ color: "var(--text-secondary)" }} />
          )
        }
        {...props}
      />
    );
  }

  return <AntInput size="large" type={type} className={mergedClassName} {...props} />;
}
