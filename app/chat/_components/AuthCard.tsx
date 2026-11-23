"use client";

import { Form } from "antd";
import { useRouter } from "next/navigation";

import { useLoginMutation } from "@/api";
import { Button, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { getPostLoginRoute, isAdminUser } from "@/lib/auth-routing";
import { getAuthUser } from "@/lib/auth-session";
import { FORM_CLASS, email, minLength, required } from "@/lib/form-rules";
import { redirectToOutlookLogin } from "@/lib/outlook-auth";
import { showToast } from "@/lib/toast";

type AuthFormValues = {
  email: string;
  password: string;
};

type AuthCardProps = {
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToRegister: () => void;
};

const authInputClass =
  "h-[40px] w-full rounded-lg border border-[var(--color-smoke)] bg-[var(--color-charcoal)] px-3 text-sm text-[var(--color-white)] placeholder:text-[var(--color-placeholder)] hover:border-[var(--color-mist)] focus:border-[rgba(87,109,255,0.6)] focus:shadow-[0_0_0_2px_rgba(87,109,255,0.1)]";

export function AuthCard({ onClose, onSuccess, onSwitchToRegister }: AuthCardProps) {
  const [form] = Form.useForm<AuthFormValues>();
  const login = useLoginMutation();
  const router = useRouter();

  const onFinish = async (values: AuthFormValues) => {
    try {
      await login.mutateAsync(values);
      const user = getAuthUser();
      showToast.success(
        "Signed in successfully",
        isAdminUser(user)
          ? "Redirecting to admin dashboard..."
          : "Welcome back! You are now signed in.",
      );
      onSuccess?.();
      onClose();
      router.push(getPostLoginRoute(user));
    } catch (error) {
      showToast.error(
        "Sign in failed",
        getApiErrorMessage(error, "Please check your credentials and try again."),
      );
    }
  };

  const handleOutlook = async () => {
    try {
      await redirectToOutlookLogin();
    } catch {
      showToast.error("Outlook sign-in failed", "Please try again.");
    }
  };

  return (
    <div className="relative box-border w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[var(--color-auth-card-bg)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="pointer-events-none absolute -top-10 left-1/2 z-[1] h-[120px] w-[280px] -translate-x-1/2 rounded-[50%] bg-[#5A53FF] opacity-10 blur-[50px]" />

      <div className="relative z-[3] w-full">
        <h3
          id="auth-modal-title"
          className="font-body m-0 mb-1 text-[22px] font-semibold leading-tight text-white"
        >
          Authenticate
        </h3>
        <p className="font-body mb-5 text-[13px] font-normal text-white/45">
          Use your corporate ID to continue.
        </p>

        <Form<AuthFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          initialValues={{ email: "@arcanainfo.com" }}
          className={`${FORM_CLASS} [&_.ant-form-item]:mb-3 [&_.ant-form-item-explain-error]:mt-1 [&_.ant-form-item-explain-error]:font-body [&_.ant-form-item-explain-error]:text-[12px]`}
        >
          <Form.Item
            name="email"
            label={
              <span className="font-body text-[13px] font-medium text-white/70">
                Email
              </span>
            }
            rules={[required("Email is required"), email]}
          >
            <Input
              type="email"
              fieldClassName={authInputClass}
              placeholder="you@arcanainfo.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="font-body text-[13px] font-medium text-white/70">
                Password
              </span>
            }
            rules={[
              required("Password is required"),
              minLength(8, "Password must be at least 8 characters"),
            ]}
          >
            <Input type="password" fieldClassName={authInputClass} placeholder="" />
          </Form.Item>

          <Button
            variant="save"
            type="submit"
            disabled={login.isPending}
            className="mt-1 mb-4 h-[40px]! w-full text-sm!"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="font-body text-[12px] font-normal text-white/35">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleOutlook}
            className="font-body flex h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-[#3b5bff] text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80"
            style={{ color: "#ffffff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6L12 13L22 6"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Signup with Outlook
          </button>

          <p className="font-body mt-4 text-center text-[13px] font-normal text-white/35">
            Do not have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="cursor-pointer border-none bg-transparent text-[13px] font-medium text-[rgba(87,109,255,0.9)] transition-colors hover:text-[rgba(87,109,255,1)]"
            >
              Register
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
}
