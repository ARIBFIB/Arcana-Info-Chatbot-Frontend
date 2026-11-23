type ChatCharCounterProps = {
  current: number;
  max: number;
};

export function ChatCharCounter({ current, max }: ChatCharCounterProps) {
  const isOverLimit = current > max;

  return (
    <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-white/30"}`}>
      {current}/{max}
    </span>
  );
}
