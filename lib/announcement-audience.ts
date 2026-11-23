const AUDIENCE_TO_API: Record<string, string> = {
  "All Employees": "ALL",
};

const API_TO_AUDIENCE: Record<string, string> = {
  ALL: "All Employees",
};

export function toApiAudience(audience: string): string {
  return AUDIENCE_TO_API[audience] ?? audience;
}

export function fromApiAudience(audience: string): string {
  return API_TO_AUDIENCE[audience] ?? audience;
}
