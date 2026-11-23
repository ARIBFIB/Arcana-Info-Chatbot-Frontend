"use client";

import { Select as AntSelect, Form } from "antd";

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  mutedLabel?: boolean;
  className?: string;
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  mutedLabel,
  className,
}: SelectFieldProps) {
  return (
    <Form.Item
      className={className}
      label={
        <span
          className={`font-body text-base leading-none font-normal ${mutedLabel ? "text-off-white/40" : "text-off-white"}`}
        >
          {label}
        </span>
      }
      colon={false}
      style={{ marginBottom: 0 }}
    >
      <AntSelect
        size="large"
        value={value}
        onChange={onChange}
        options={options.map((option) => ({ label: option, value: option }))}
      />
    </Form.Item>
  );
}
