import { NextRequest } from "next/server";
import { handleError, json, ApiError } from "@/lib/api/http";
import { requireUserWithRoles } from "@/lib/api/auth";
import { todoFilterSchema, createTodoSchema } from "@/lib/validation/todo";
import { getEntityManager } from "@/lib/db/client";
import { Todo, User } from "@/lib/db/entities";
import type { FilterQuery } from "@mikro-orm/core";
import { toTodoDTO } from "@/lib/db/serializers/todo";
import type { UserRole } from "@/types/auth";

const TODO_ALLOWED_ROLES: UserRole[] = ["admin", "user"];

const buildFilter = (params: URLSearchParams, viewer: User): FilterQuery<Todo> => {
  const parsed = todoFilterSchema.parse({
    status: params.get("status") || undefined,
    search: params.get("search") || undefined,
    dueStart: params.get("dueStart") || undefined,
    dueEnd: params.get("dueEnd") || undefined
  });

  const filter: FilterQuery<Todo> = {};

  const userId = params.get("userId");
  if (userId && viewer.role !== "admin") {
    throw new ApiError(404, "Admin required to filter by userId");
  }
  if (userId && viewer.role === "admin") {
    filter.owner = userId;
  } else if (viewer.role !== "admin") {
    filter.owner = viewer;
  }

  if (parsed.status) {
    filter.status = parsed.status;
  }

  if (parsed.search) {
    const regex = new RegExp(parsed.search, "i");
    filter.$or = [
      { title: regex },
      { description: regex }
    ];
  }

  if (parsed.dueStart || parsed.dueEnd) {
    filter.dueDate = {};
    if (parsed.dueStart) {
      filter.dueDate.$gte = parsed.dueStart;
    }
    if (parsed.dueEnd) {
      filter.dueDate.$lte = parsed.dueEnd;
    }
  }

  return filter;
};

export async function handlerGET(request: NextRequest) {
    const { user } = await requireUserWithRoles(TODO_ALLOWED_ROLES);
    const em = await getEntityManager();
    const viewerForQuery = user.role === "admin" ? user : em.getReference(User, user.id);
    const where = buildFilter(request.nextUrl.searchParams, viewerForQuery);

    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(request.nextUrl.searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const [todos, total] = await Promise.all([
      em.find(Todo, where, { orderBy: { createdAt: "desc" }, limit, offset }),
      em.count(Todo, where)
    ]);

    return json({
      todos: todos.map(toTodoDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
}

export async function handlerPOST(request: NextRequest) {
    const { user } = await requireUserWithRoles(TODO_ALLOWED_ROLES);
    const payload = createTodoSchema.parse(await request.json());
    const em = await getEntityManager();
    const ownerRef = em.getReference(User, user.id);

    const todo = em.create(Todo, {
      ...payload,
      owner: ownerRef
    });

    await em.persistAndFlush(todo);
    return json({ todo: toTodoDTO(todo) }, { status: 201 });
}

export const GET = handleError(handlerGET);
export const POST = handleError(handlerPOST);
