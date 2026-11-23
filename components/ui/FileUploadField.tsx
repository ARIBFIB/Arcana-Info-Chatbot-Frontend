"use client";

import { Flex, Input, Upload, type UploadProps } from "antd";

type FileUploadFieldProps = {
  value?: File;
  onChange?: (file?: File) => void;
  accept?: string;
  className?: string;
};

export function FileUploadField({
  value,
  onChange,
  accept = ".pdf,.doc,.docx",
  className,
}: FileUploadFieldProps) {
  const uploadProps: UploadProps = {
    accept,
    showUploadList: false,
    beforeUpload: (file) => {
      onChange?.(file);
      return false;
    },
  };

  return (
    <Flex gap={8} align="center" className={className}>
      <Input
        size="large"
        readOnly
        value={value?.name ?? ""}
        placeholder="No file selected"
        className="min-w-0 flex-1 !h-[48px] !rounded-[12px] !border-[var(--color-smoke)] !bg-[var(--color-charcoal)] !text-[var(--color-off-white)] placeholder:!text-[var(--color-placeholder)]"
      />
      <Upload {...uploadProps}>
        <button
          type="button"
          className="h-[48px] w-[199px] cursor-pointer rounded-[12px] border border-[var(--color-smoke)] bg-[var(--color-graphite)] text-sm font-medium text-[var(--color-off-white)] transition-colors hover:bg-[var(--color-slate)] shrink-0"
        >
          Browse
        </button>
      </Upload>
    </Flex>
  );
}
