"use server";
import {
  DeleteExpiredSessions,
  GetAllUserSessions,
  InvalidateAllUserSessions,
  ValidateSession,
} from "@/lib/api/auth";
import { User } from "@prisma/client";

export const ValidateCookie = async (
  user: User & {
    sessionId: string;
  },
) => {
  const session = await ValidateSession(user.sessionId);
  if (session.session !== null && session.user !== null) return session;
  return null;
};

export const InvalidateUserSection = async (userId: string) => {
  InvalidateAllUserSessions(userId);
  return null;
};

export async function RemoveUnusedSessions() {
  DeleteExpiredSessions();
}

export async function GetUserSessions(userId: string) {
  return await GetAllUserSessions(userId);
}
