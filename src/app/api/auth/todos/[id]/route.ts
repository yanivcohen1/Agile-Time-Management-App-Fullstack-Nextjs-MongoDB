import { NextRequest } from "next/server";
import { handleError, json, ApiError, assert } from "@/lib/api/http";
import { requireUserWithRoles } from "@/lib/api/auth";
import { updateTodoSchema } from "@/lib/validation/todo";
import { getEntityManager } from "@/lib/db/client";
import { Todo, User } from "@/lib/db/entities";
import { toTodoDTO } from "@/lib/db/serializers/todo";
import type { UserRole } from "@/types/auth";

const TODO_ALLOWED_ROLES: UserRole[] = ["admin", "user"];

const loadTodo = async (id: string, viewer: User) => {
  const em = await getEntityManager();
  const criteria = viewer.role === "admin" ? { id } : { id, owner: em.getReference(User, viewer.id) };
  const todo = await em.findOne(Todo, criteria);
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }
  return { todo, em } as const;
};

type RouteContext = { params: Promise<{ id: string }> };

export async function handlerGET(request: NextRequest, context: RouteContext) {
    const { user } = await requireUserWithRoles(TODO_ALLOWED_ROLES);
    const { id } = await context.params;
    const { todo } = await loadTodo(id, user);
    return json({ todo: toTodoDTO(todo) });
}

export async function handlerPUT(request: NextRequest, context: RouteContext) {
    const { user } = await requireUserWithRoles(TODO_ALLOWED_ROLES);
    const payload = updateTodoSchema.parse(await request.json());
    const { id } = await context.params;
    assert(!payload.id || payload.id === id, 400, "Todo id mismatch");
    const { todo, em } = await loadTodo(id, user);

    todo.title = payload.title;
    todo.description = payload.description;
    todo.status = payload.status;
    todo.dueDate = payload.dueDate;
    todo.duration = payload.duration;
    todo.tags = payload.tags ?? todo.tags;

    await em.flush();
    return json({ todo: toTodoDTO(todo) });
}

export async function handlerDELETE(request: NextRequest, context: RouteContext) {
    const { user } = await requireUserWithRoles(TODO_ALLOWED_ROLES);
    const { id } = await context.params;
    const { todo, em } = await loadTodo(id, user);
    await em.removeAndFlush(todo);
    return json({ success: true });
}

export const GET = handleError(handlerGET);
export const PUT = handleError(handlerPUT);
export const DELETE = handleError(handlerDELETE);