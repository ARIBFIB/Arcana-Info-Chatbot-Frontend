"use client";

import { App, Form } from "antd";

import { useCreateAnnouncementMutation } from "@/api";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiAudience } from "@/lib/announcement-audience";
import { getApiErrorMessage } from "@/lib/api-error";
import { FORM_CLASS, FORM_LABEL_MUTED, minLength, required } from "@/lib/form-rules";

const AUDIENCES = [
  "All Employees",
  "Management, Leads",
  "C-Level",
  "HR & Admin",
  "Engineering",
];

type NewAnnouncementValues = {
  audience: string;
  title: string;
  description: string;
};

type NewAnnouncementFormProps = {
  onCancel: () => void;
  onSuccess?: () => void;
};

export function NewAnnouncementForm({ onCancel, onSuccess }: NewAnnouncementFormProps) {
  const { message } = App.useApp();
  const createAnnouncement = useCreateAnnouncementMutation();

  const onFinish = async (values: NewAnnouncementValues) => {
    try {
      await createAnnouncement.mutateAsync({
        title: values.title,
        description: values.description,
        audience: toApiAudience(values.audience),
      });
      message.success("Announcement created");
      onSuccess?.();
    } catch (error) {
      message.error(getApiErrorMessage(error, "Failed to create announcement"));
    }
  };

  return (
    <div className="pt-1">
      <h1 className="Red Hat Display m-0 mb-8 text-[28px] font-bold text-off-white">
        New Announcement
      </h1>

      <Form<NewAnnouncementValues>
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        className={FORM_CLASS}
        initialValues={{
          audience: "All Employees",
          title: "",
          description: "",
        }}
      >
        <Form.Item
          name="audience"
          label={<span className={FORM_LABEL_MUTED}>Audience</span>}
          rules={[required("Select an audience")]}
          className="mb-6 max-w-[590px]"
        >
          <Select
            className="max-w-[359px] [&_.ant-select-selector]:!h-[48px] [&_.ant-select-selector]:!rounded-[12px] [&_.ant-select-selector]:!border-[var(--color-smoke)] [&_.ant-select-selector]:!bg-[var(--color-charcoal)] [&_.ant-select-selection-item]:!leading-[48px]"
            options={AUDIENCES.map((audience) => ({
              label: audience,
              value: audience,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label={<span className={FORM_LABEL_MUTED}>Title</span>}
          rules={[
            required("Title is required"),
            minLength(3, "Title must be at least 3 characters"),
          ]}
          className="mb-6 max-w-[590px]"
        >
          <Input
            placeholder="Announcement title"
            fieldClassName="h-[48px] w-[590px] rounded-[12px] border border-[var(--color-smoke)] bg-[#FFFFFF08] px-6 justify-between"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className={FORM_LABEL_MUTED}>Description</span>}
          rules={[
            required("Description is required"),
            minLength(20, "Description must be at least 20 characters"),
          ]}
          className="mb-6 max-w-[590px]"
        >
          <Textarea
            rows={5}
            className="!h-[140px] w-[590px] rounded-[12px] border border-[var(--color-smoke)] bg-[#FFFFFF08] !p-6 text-base font-normal !leading-none tracking-normal"
            placeholder="Write announcement description..."
          />
        </Form.Item>

        {/* Buttons — full width so justify-end reaches the true right edge, matching Documents */}
        <div className="mt-8 flex w-full items-center justify-end gap-3 pb-6 pr-1">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={createAnnouncement.isPending}
            className="!h-[48px] !w-[199px] !rounded-[12px] !text-sm !font-medium !text-[var(--color-off-white)]"
          >
            Cancel
          </Button>
          <Button
            variant="save"
            type="submit"
            disabled={createAnnouncement.isPending}
            className="!h-[48px] !w-[199px] !rounded-[12px] !text-sm !font-medium !text-[#ffffff]"
          >
            {createAnnouncement.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
