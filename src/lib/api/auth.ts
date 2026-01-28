import { NextRequest } from "next/server";
import { verifyAccessToken } from "../auth/jwt";
import { ApiError } from "./http";
import { getEntityManager } from "../db/client";
import { User } from "../db/entities";
import type { SessionUser, UserRole } from "@/types/auth";
import { headers } from 'next/headers';

const TODO_ALLOWED_ROLES: UserRole[] = ["admin", "user"];

export type AuthenticatedContext = {
  user: User;
};

type NextRequestWithOptionalIp = NextRequest & {
  ip?: string | null;
};

const extractBearerToken = async () => {
  const headersList = await headers()
  const header = headersList.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

export const requireUser = async (): Promise<AuthenticatedContext> => {
  const token = await extractBearerToken();
  if (!token) {
    throw new ApiError(401, "Missing or invalid authorization header");
  }

  try {
    const payload = verifyAccessToken(token);
    const em = await getEntityManager();
    const user = await em.findOne(User, payload.sub);
    if (!user) {
      throw new ApiError(401, "Invalid token subject");
    }
    return { user };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid or expired access token");
  }
};

export const toClientUser = (user: User): SessionUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role
});

export const requireUserWithRoles = async (
  allowedRoles: ReadonlyArray<UserRole> = TODO_ALLOWED_ROLES
): Promise<AuthenticatedContext> => {
  const context = await requireUser();
  if (!allowedRoles.includes(context.user.role)) {
    throw new ApiError(403, "Insufficient permissions");
  }

  return context;
};

export const getClientIp = (request: NextRequest) => {
  const ipFromRequest = (request as NextRequestWithOptionalIp).ip;
  if (ipFromRequest) {
    return ipFromRequest;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    return firstIp?.trim() || "unknown";
  }

  return "unknown";
};
