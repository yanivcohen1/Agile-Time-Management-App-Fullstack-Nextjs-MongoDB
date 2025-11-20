import { NextRequest } from "next/server";
import { handleError, json, ApiError, assert } from "@/lib/api/http";
import { requireUser } from "@/lib/api/auth";
import { updateTodoSchema } from "@/lib/validation/todo";
import { getEntityManager } from "@/lib/db/client";
import { Todo, User } from "@/lib/db/entities";
import { toTodoDTO } from "@/lib/db/serializers/todo";

const loadTodo = async (id: string, owner: User) => {
  const em = await getEntityManager();
  const todo = await em.findOne(Todo, { id, owner });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }
  return { todo, em } as const;
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await requireUser(request);
    const { todo } = await loadTodo(params.id, user);
    return json({ todo: toTodoDTO(todo) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await requireUser(request);
    const payload = updateTodoSchema.parse(await request.json());
    assert(!payload.id || payload.id === params.id, 400, "Todo id mismatch");
    const { todo, em } = await loadTodo(params.id, user);

    todo.title = payload.title;
    todo.description = payload.description;
    todo.status = payload.status;
    todo.dueDate = payload.dueDate;
    todo.tags = payload.tags ?? todo.tags;

    await em.flush();
    return json({ todo: toTodoDTO(todo) });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await requireUser(request);
    const { todo, em } = await loadTodo(params.id, user);
    await em.removeAndFlush(todo);
    return json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
