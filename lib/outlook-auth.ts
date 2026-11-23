"use client";

import {
  OUTLOOK_AUTHORIZE_ENDPOINT,
  OUTLOOK_CLIENT_ID,
  OUTLOOK_PKCE_VERIFIER_KEY,
  OUTLOOK_REDIRECT_URI,
  OUTLOOK_SCOPES,
  OUTLOOK_TOKEN_ENDPOINT,
  OUTLOOK_USER_KEY,
} from "@/constants/outlook";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";

export type OutlookUser = {
  name: string;
  email: string;
};

/**
 * Kicks off the Outlook (Microsoft Entra ID) login by redirecting the
 * browser to Microsofts authorize endpoint using PKCE. No client secret
 * or backend involved - this app is registered in Azure as a
 * Single-page application (SPA).
 */
export async function redirectToOutlookLogin(): Promise<void> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem(OUTLOOK_PKCE_VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: OUTLOOK_CLIENT_ID,
    response_type: "code",
    redirect_uri: OUTLOOK_REDIRECT_URI,
    response_mode: "query",
    scope: OUTLOOK_SCOPES,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${OUTLOOK_AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

type MicrosoftTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

type MicrosoftGraphMe = {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
};

/**
 * Exchanges the authorization code (from the callback URL) for a
 * Microsoft access token directly with Microsofts token endpoint -
 * allowed for SPA app registrations without a client secret - then
 * fetches basic profile info (name/email) from Microsoft Graph.
 */
export async function completeOutlookLogin(code: string): Promise<OutlookUser> {
  const verifier = sessionStorage.getItem(OUTLOOK_PKCE_VERIFIER_KEY);
  if (!verifier) {
    throw new Error("Missing PKCE verifier. Please try signing in again.");
  }

  const body = new URLSearchParams({
    client_id: OUTLOOK_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: OUTLOOK_REDIRECT_URI,
    code_verifier: verifier,
  });

  const tokenRes = await fetch(OUTLOOK_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const tokenData = (await tokenRes.json()) as MicrosoftTokenResponse;

  const meRes = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!meRes.ok) {
    throw new Error("Failed to fetch profile from Microsoft Graph.");
  }

  const me = (await meRes.json()) as MicrosoftGraphMe;

  const user: OutlookUser = {
    name: me.displayName ?? "Outlook User",
    email: me.mail ?? me.userPrincipalName ?? "",
  };

  sessionStorage.removeItem(OUTLOOK_PKCE_VERIFIER_KEY);
  localStorage.setItem(OUTLOOK_USER_KEY, JSON.stringify(user));

  return user;
}

export function getOutlookUser(): OutlookUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(OUTLOOK_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OutlookUser;
  } catch {
    return null;
  }
}

export function clearOutlookUser(): void {
  localStorage.removeItem(OUTLOOK_USER_KEY);
}
