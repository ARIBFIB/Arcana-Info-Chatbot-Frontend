import { ChatHolidayTable } from "./ChatHolidayTable";
import { ChatMessageActions } from "./ChatMessageActions";
import { ChatThinkingBlock } from "./ChatThinkingBlock";

export type AssistantMessageContent =
  { kind: "text"; bold?: boolean; text: string } | { kind: "holiday_table" };

type ChatAssistantMessageProps = {
  content: AssistantMessageContent[];
  thinkingDurationSeconds?: number;
  onRetry?: () => void;
};

export function ChatAssistantMessage({
  content,
  thinkingDurationSeconds,
  onRetry,
}: ChatAssistantMessageProps) {
  const copyText = content
    .filter(
      (block): block is Extract<AssistantMessageContent, { kind: "text" }> =>
        block.kind === "text",
    )
    .map((block) => block.text)
    .join("\n\n");

  return (
    <div className="group flex w-full flex-col gap-2">
      {thinkingDurationSeconds !== undefined && (
        <ChatThinkingBlock isLive={false} finalDuration={thinkingDurationSeconds} />
      )}

      <div className="box-border flex w-full flex-col gap-0 rounded-[14px] border border-white/8 bg-[var(--color-charcoal)] px-5 py-2.5">
        {content.map((block, idx) => {
          if (block.kind === "holiday_table") {
            return <ChatHolidayTable key={idx} />;
          }

          return (
            <p
              key={idx}
              className={`font-body text-base leading-normal break-words whitespace-pre-wrap text-off-white ${block.bold ? "mb-1.5 font-bold leading-[150%]" : "font-normal leading-[150%]"}`}
            >
              {block.text}
            </p>
          );
        })}
      </div>

      <ChatMessageActions
        copyText={copyText}
        onRetry={onRetry}
        showFeedback
        align="left"
      />
    </div>
  );
}
