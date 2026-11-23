import type { ReactNode } from "react";

import { ChatLayout } from "./_components/ChatLayout";
import { ChatProvider } from "./_context/chat-context";

type ChatRouteLayoutProps = {
  children: ReactNode;
};

export default function ChatRouteLayout({ children }: ChatRouteLayoutProps) {
  return (
    <ChatProvider>
      <ChatLayout>{children}</ChatLayout>
    </ChatProvider>
  );
}
