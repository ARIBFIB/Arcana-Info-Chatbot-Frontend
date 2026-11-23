export const chatKeys = {
  all: ["chat"] as const,
  sessions: () => [...chatKeys.all, "sessions"] as const,
  session: (uuid: string) => [...chatKeys.all, "session", uuid] as const,
};
