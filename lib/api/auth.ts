import { lucia } from "@/prisma";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { Cookie, Session } from "lucia";
import Cookies from "js-cookie";
import api from "../axios";

export function InvalidateAllUserSessions(userId: string): void {
  lucia.invalidateUserSessions(userId);
}

export function DeleteExpiredSessions(): void {
  lucia.deleteExpiredSessions();
}

export function CreateSession(user: User): Promise<Session> {
  InvalidateAllUserSessions(user.id);
  DeleteExpiredSessions();
  const session = lucia.createSession(user.id, {
    id: randomUUID(),
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  return session;
}

export async function ValidateSession(sessionId: string) {
  return await lucia.validateSession(sessionId);
}

export function CreateSessionCookie(
  sessionId: string,
  user: User
): {
  sessionCookie: Cookie;
  user: User;
} {
  const sessionCookie = lucia.createSessionCookie(sessionId);
  Cookies.set(
    "user",
    JSON.stringify({
      ...user,
      sessionId,
    }),
    sessionCookie.attributes
  );
  api.defaults.headers.common.Authorization = `Bearer ${sessionId}`;
  return { sessionCookie, user } as const;
}

export function DeleteSessionCookie(): void {
  const sessionCookie = lucia.createBlankSessionCookie();
  Cookies.set("user", sessionCookie.value, sessionCookie.attributes);
}

export async function GetAllUserSessions(userId: string): Promise<Session[]> {
  return await lucia.getUserSessions(userId);
}

export async function GetBearerToken(
  authorizationHeader: string | null
): Promise<string | null> {
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
  return sessionId;
}