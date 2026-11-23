import { ChatMessageActions } from "./ChatMessageActions";

type ChatMessageBubbleProps = {
  message: string;
  onRetry?: () => void;
};

export function ChatMessageBubble({ message, onRetry }: ChatMessageBubbleProps) {
  return (
    <div className="group box-border flex w-full flex-col items-end px-6">
      <div className="box-border w-auto max-w-[600px] min-w-[120px] rounded-[10px] bg-[var(--color-message-bubble)] p-5">
        <p className="font-body text-base leading-normal font-normal break-words whitespace-pre-wrap text-off-white leading-[260%]">
          {message}
        </p>
      </div>
      <ChatMessageActions copyText={message} onRetry={onRetry} align="right" />
    </div>
  );
}
