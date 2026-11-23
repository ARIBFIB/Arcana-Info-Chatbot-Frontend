"use client";

import { Flex } from "antd";

import { Button, Modal } from "@/components/ui";

export type DeleteConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onCancel={isLoading ? undefined : onCancel}
      closable={!isLoading}
      mask={{ closable: !isLoading }}
      width={440}
      title={null}
    >
      <Flex vertical className="px-6 py-7">
        <p className="font-body mb-3 block text-lg leading-none font-extrabold text-smoke">
          {title}
        </p>
        <p className="font-body mb-8 block text-base leading-[1.4] font-normal text-ash">
          {description}
        </p>

        <Flex justify="flex-end" wrap gap={12}>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
            className="h-[40px]! min-w-[120px] text-sm! font-normal! transition-colors! duration-150! hover:bg-white/5!"
          >
            {cancelLabel}
          </Button>
          {/*
            NOTE: "save" variant (ui.buttonSave) apni khud ki badi
            default height/font-size le ke aati hai - AuthCard.tsx mein
            bhi isi liye h-[40px]!/text-sm! override kiya gaya hai. Yahan
            bhi wahi override na hota to Confirm button "Cancel" se kaafi
            bada dikhta (jaisa logout dialog mein dikha tha). Danger
            background bhi yahan lighter red aur hover effect ke saath
            override kiya hai (default danger red bahut vivid tha).
          */}
          <Button
            variant="save"
            danger
            disabled={isLoading}
            onClick={onConfirm}
            className={`h-[40px]! min-w-[120px] bg-red-400! text-sm! font-normal! transition-colors! duration-150! hover:bg-red-500!${isLoading ? " opacity-80" : ""}`}
          >
            {isLoading ? "Deleting…" : confirmLabel}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
