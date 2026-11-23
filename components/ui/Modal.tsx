"use client";

import { Modal as AntModal, type ModalProps } from "antd";

export function Modal(props: ModalProps) {
  return (
    <AntModal
      centered
      footer={null}
      destroyOnHidden
      styles={{
        body: { padding: 0 },
      }}
      {...props}
    />
  );
}
