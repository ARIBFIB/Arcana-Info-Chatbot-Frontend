export function ChatShimmerMessage() {
  return (
    <div className="box-border flex w-full flex-col gap-2 px-10">
      <div className="h-4 w-3/4 rounded-md bg-[var(--color-message-bubble)] animate-pulse" />
      <div className="h-4 w-1/2 rounded-md bg-[var(--color-message-bubble)] animate-pulse" />
      <div className="h-4 w-2/3 rounded-md bg-[var(--color-message-bubble)] animate-pulse" />
    </div>
  );
}
