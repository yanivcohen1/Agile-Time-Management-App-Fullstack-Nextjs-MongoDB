import { NextRequest } from "next/server";
import { handleError, json } from "@/lib/api/http";
import { requireUser } from "@/lib/api/auth";
import { todoFilterSchema, createTodoSchema } from "@/lib/validation/todo";
import { getEntityManager } from "@/lib/db/client";
import { Todo, User } from "@/lib/db/entities";
import type { FilterQuery } from "@mikro-orm/core";
import { toTodoDTO } from "@/lib/db/serializers/todo";

const buildFilter = (params: URLSearchParams, owner: User): FilterQuery<Todo> => {
  const parsed = todoFilterSchema.parse({
    status: params.get("status") || undefined,
    search: params.get("search") || undefined,
    dueStart: params.get("dueStart") || undefined,
    dueEnd: params.get("dueEnd") || undefined
  });

  const filter: FilterQuery<Todo> = { owner };

  if (parsed.status) {
    filter.status = parsed.status;
  }

  if (parsed.search) {
    filter.$or = [
      { title: { $regex: parsed.search, $options: "i" } },
      { description: { $regex: parsed.search, $options: "i" } }
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

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireUser(request);
    const em = await getEntityManager();
    const where = buildFilter(request.nextUrl.searchParams, user);

    const [todos, total] = await Promise.all([
      em.find(Todo, where, { orderBy: { createdAt: "desc" } }),
      em.count(Todo, where)
    ]);

    return json({
      todos: todos.map(toTodoDTO),
      total
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireUser(request);
    const payload = createTodoSchema.parse(await request.json());
    const em = await getEntityManager();

    const todo = em.create(Todo, {
      ...payload,
      owner: user
    });

    await em.persistAndFlush(todo);
    return json({ todo: toTodoDTO(todo) }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
