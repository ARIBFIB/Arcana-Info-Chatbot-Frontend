"use client";

import { Form } from "antd";
import { useRouter } from "next/navigation";

import { useRegisterMutation } from "@/api";
import { Button, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { getPostLoginRoute, isAdminUser } from "@/lib/auth-routing";
import { getAuthUser } from "@/lib/auth-session";
import { FORM_CLASS, corporateEmail, minLength, required } from "@/lib/form-rules";
import { showToast } from "@/lib/toast";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
};

type RegisterCardProps = {
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
};

const inputClass =
  "h-[40px] w-full rounded-lg border border-[var(--color-smoke)] bg-[var(--color-charcoal)] px-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-placeholder)] hover:border-[var(--color-mist)] focus:border-[rgba(87,109,255,0.6)] focus:shadow-[0_0_0_2px_rgba(87,109,255,0.1)]";

const labelClass = "font-body text-[13px] font-medium text-white/70";

const DEPARTMENTS = ["AI", "IBM", "WSO2", "DevOPS", "Marketing", "HR", "Other"];

export function RegisterCard({
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterCardProps) {
  const [form] = Form.useForm<RegisterFormValues>();
  const register = useRegisterMutation();
  const router = useRouter();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      await register.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        department: values.department,
        designation: values.designation,
        is_admin: false,
      });
      const user = getAuthUser();
      showToast.success(
        "Account created",
        isAdminUser(user)
          ? "Redirecting to admin dashboard…"
          : "Welcome! Your account is ready.",
      );
      onSuccess?.();
      onClose();
      router.push(getPostLoginRoute(user));
    } catch (error) {
      showToast.error(
        "Registration failed",
        getApiErrorMessage(error, "Please check your details and try again."),
      );
    }
  };

  return (
    <div className="relative box-border w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[var(--color-auth-card-bg)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="pointer-events-none absolute -top-10 left-1/2 z-[1] h-[120px] w-[280px] -translate-x-1/2 rounded-[50%] bg-[#5A53FF] opacity-10 blur-[50px]" />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none bg-white/[0.06] text-white/40 transition-[background,color] hover:bg-white/10 hover:text-white"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M1 1L13 13M1 13L13 1" />
        </svg>
      </button>

      <div className="relative z-[3] w-full">
        <h3
          id="auth-modal-title"
          className="font-body m-0 mb-1 text-[22px] font-semibold leading-tight text-white"
        >
          Create Account
        </h3>
        <p className="font-body mb-5 text-[13px] font-normal text-white/45">
          Register with your corporate details.
        </p>

        <Form<RegisterFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          onFinishFailed={() => {
            showToast.error(
              "Missing information",
              "Please fill in all required fields.",
            );
          }}
          initialValues={{ department: "IBM", email: "@arcanainfo.com" }}
          className={FORM_CLASS}
        >
          {/* Only the input fields scroll - Create Account button and the
              "Already have an account?" line below stay fixed. */}
          <div
            className={`max-h-[50vh] overflow-y-auto pr-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent] [&_.ant-form-item]:mb-3 [&_.ant-form-item-explain-error]:mt-1 [&_.ant-form-item-explain-error]:font-body [&_.ant-form-item-explain-error]:text-[12px]`}
          >
            <Form.Item
              name="name"
              label={<span className={labelClass}>Full Name</span>}
              rules={[
                required("Name is required"),
                minLength(2, "At least 2 characters"),
              ]}
            >
              <Input type="text" fieldClassName={inputClass} placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className={labelClass}>Email</span>}
              rules={[required("Email is required"), corporateEmail]}
            >
              <Input
                type="email"
                fieldClassName={inputClass}
                placeholder="you@arcanainfo.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className={labelClass}>Password</span>}
              rules={[
                required("Password is required"),
                minLength(8, "Min. 8 characters"),
              ]}
            >
              <Input
                type="password"
                fieldClassName={inputClass}
                placeholder="Min. 8 characters"
              />
            </Form.Item>

            {/* Department + Designation — equal width, equal height */}
            <div className="flex gap-2.5">
              <Form.Item
                name="department"
                label={<span className={labelClass}>Department</span>}
                rules={[required("Select a department")]}
                className="mb-3 w-0 flex-1"
              >
                <Select
                  options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
                  style={{ height: 40 }}
                />
              </Form.Item>

              <Form.Item
                name="designation"
                label={<span className={labelClass}>Designation</span>}
                rules={[required("Designation is required")]}
                className="mb-3 w-0 flex-1"
              >
                <Input
                  type="text"
                  fieldClassName={inputClass}
                  placeholder="e.g. Engineer"
                />
              </Form.Item>
            </div>
          </div>

          <Button
            variant="save"
            type="submit"
            disabled={register.isPending}
            className="mt-3 mb-4 h-[40px]! w-full text-sm!"
          >
            {register.isPending ? "Creating account…" : "Create Account"}
          </Button>

          <p className="font-body text-center text-[13px] font-normal text-white/35">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="cursor-pointer border-none bg-transparent text-[13px] font-medium text-[rgba(87,109,255,0.9)] transition-colors hover:text-[rgba(87,109,255,1)]"
            >
              Sign in
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
}
