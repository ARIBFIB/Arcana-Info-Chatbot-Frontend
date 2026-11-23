"use client";

import { Form } from "antd";

import { useUploadDocumentMutation } from "@/api";
import { FileUploadField, Select, Textarea } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  FORM_CLASS,
  FORM_LABEL_MUTED,
  fileRequired,
  minLength,
  required,
} from "@/lib/form-rules";
import { showToast } from "@/lib/toast";

const CATEGORIES = [
  "Policies & Compliance",
  "Employee Lifecycle",
  "HR & Onboarding",
  "Finance & Payroll",
  "Legal & Contracts",
];

type AddDocumentValues = {
  category: string;
  file?: File;
  description: string;
};

type AddDocumentFormProps = {
  onCancel: () => void;
  onSuccess?: () => void;
};

export function AddDocumentForm({ onCancel, onSuccess }: AddDocumentFormProps) {
  const uploadDocument = useUploadDocumentMutation();

  const onFinish = async (values: AddDocumentValues) => {
    if (!values.file) return;

    try {
      await uploadDocument.mutateAsync({
        file: values.file,
        category: values.category,
        description: values.description,
      });
      showToast.success("Document uploaded successfully");
      onSuccess?.();
    } catch (error) {
      showToast.error(getApiErrorMessage(error, "Failed to upload document"));
    }
  };

  return (
    <div className="pt-1">
      <h1 className="m-0 mb-8 text-[28px] font-bold text-[var(--color-off-white)]">
        Add Documents
      </h1>

      <Form<AddDocumentValues>
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        className={FORM_CLASS}
        initialValues={{ category: "Policies & Compliance", description: "" }}
      >
        {/* Row: Category + Upload — total 958px */}
        <div className="mb-5 flex w-[958px] max-w-full items-start gap-4">
          <Form.Item
            name="category"
            label={<span className={FORM_LABEL_MUTED}>Category</span>}
            rules={[required("Select a category")]}
            className="mb-0 w-[359px] shrink-0"
          >
            <Select
              options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              className="!h-[48px] w-full [&_.ant-select-selector]:!h-[50px] [&_.ant-select-selector]:!rounded-[12px] [&_.ant-select-selector]:!border-[var(--color-smoke)] [&_.ant-select-selector]:!bg-[var(--color-charcoal)] [&_.ant-select-selection-item]:!leading-[57px]"
            />
          </Form.Item>

          <Form.Item
            name="file"
            label={<span className={FORM_LABEL_MUTED}>Upload</span>}
            rules={[fileRequired]}
            className="mb-0 min-w-0 flex-1 "
          >
            <FileUploadField />
          </Form.Item>
        </div>

        {/*
          NOTE: Textarea component apni koi padding define nahi karta,
          aur Tailwind ke Preflight reset ki wajah se AntD ki apni default
          padding bhi override ho jaati hai - isliye px/py yahan explicitly
          dena zaroori hai (same pattern jo AuthCard.tsx ke authInputClass
          mein px-3 use karke follow kiya gaya hai), warna text/cursor
          box ke top-left corner se chipak jaata hai.
        */}
        {/* Description — 958px wide, 144px tall */}
        <Form.Item
          name="description"
          label={<span className={FORM_LABEL_MUTED}>Description</span>}
          rules={[
            required("Description is required"),
            minLength(10, "Description must be at least 10 characters"),
          ]}
          className="mb-0"
        >
          <Textarea
            rows={5}
            className="!h-[140px] !w-[958px] !max-w-full !resize-none !rounded-[12px] !border-[var(--color-smoke)] !bg-[var(--color-charcoal)] !px-4 !py-3 !text-[var(--color-off-white)]"
          />
        </Form.Item>

        {/* Buttons — bottom-right of the form content, normal flow */}
        <div className="mt-8 flex w-[958px] max-w-full items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={uploadDocument.isPending}
            className="h-[48px] w-[199px] cursor-pointer rounded-[12px] border border-[var(--color-smoke)] bg-[var(--color-graphite)] text-sm font-medium text-[var(--color-off-white)] transition-colors hover:bg-[var(--color-slate)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadDocument.isPending}
            className="h-[48px] w-[199px] cursor-pointer rounded-[12px] border-none bg-[#3b5bff] text-sm font-medium text-[#ffffff] transition-colors hover:bg-[#2f4fe0] disabled:opacity-50"
          >
            {uploadDocument.isPending ? "Uploading…" : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
}
