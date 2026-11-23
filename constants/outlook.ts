export const OUTLOOK_CLIENT_ID = process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID ?? "";
export const OUTLOOK_TENANT_ID = process.env.NEXT_PUBLIC_OUTLOOK_TENANT_ID ?? "";
export const OUTLOOK_REDIRECT_URI =
  process.env.NEXT_PUBLIC_OUTLOOK_REDIRECT_URI ??
  "http://localhost:3000/auth/outlook/callback";

export const OUTLOOK_AUTHORITY = `https://login.microsoftonline.com/${OUTLOOK_TENANT_ID}`;
export const OUTLOOK_AUTHORIZE_ENDPOINT = `${OUTLOOK_AUTHORITY}/oauth2/v2.0/authorize`;
export const OUTLOOK_TOKEN_ENDPOINT = `${OUTLOOK_AUTHORITY}/oauth2/v2.0/token`;
export const OUTLOOK_SCOPES = "openid profile email User.Read";

export const OUTLOOK_PKCE_VERIFIER_KEY = "outlook_pkce_verifier";
export const OUTLOOK_USER_KEY = "outlook_user";
