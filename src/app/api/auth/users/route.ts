import { NextRequest } from "next/server";
import { handleError, json } from "@/lib/api/http";
import { requireUserWithRoles } from "@/lib/api/auth";
import { getEntityManager } from "@/lib/db/client";
import { User } from "@/lib/db/entities";
import { toClientUser } from "@/lib/api/auth";
import type { UserRole } from "@/types/auth";

const USERS_ALLOWED_ROLES: UserRole[] = ["admin"];

export async function handlerGET(request: NextRequest) {
    await requireUserWithRoles(request, USERS_ALLOWED_ROLES);
    const em = await getEntityManager();

    const users = await em.find(User, {}, { orderBy: { createdAt: "desc" } });

    return json({
      users: users.map(toClientUser)
    });
}

export const GET = handleError(handlerGET);