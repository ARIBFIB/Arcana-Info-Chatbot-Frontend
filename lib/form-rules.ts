import type { Rule } from "antd/es/form";

export const required = (message: string): Rule => ({ required: true, message });

export const email: Rule = {
  type: "email",
  message: "Enter a valid email address",
};

export const corporateEmail = {
  pattern: /^[a-zA-Z0-9._%+-]+@arcanainfo\.com$/,
  message: "Only @arcanainfo.com email addresses are allowed",
};

export const minLength = (min: number, message?: string): Rule => ({
  min,
  message: message ?? `Must be at least ${min} characters`,
});

export const fileRequired: Rule = {
  validator: (_, value: File | undefined) =>
    value instanceof File
      ? Promise.resolve()
      : Promise.reject(new Error("Please upload a file")),
};

const formLabelClass = "font-body text-base leading-none font-normal text-off-white";

/** Applies label typography to nested antd Form labels */
export const FORM_CLASS =
  "[&_.ant-form-item-label>label]:font-body [&_.ant-form-item-label>label]:text-base [&_.ant-form-item-label>label]:leading-none [&_.ant-form-item-label>label]:font-normal [&_.ant-form-item-label>label]:text-off-white";

export const FORM_LABEL = formLabelClass;
export const FORM_LABEL_MUTED =
  "font-body text-base leading-none font-normal text-off-white/40";
export const FORM_LABEL_WHITE = formLabelClass;
