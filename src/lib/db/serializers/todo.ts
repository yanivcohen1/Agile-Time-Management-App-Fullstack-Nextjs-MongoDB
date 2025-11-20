import { Todo } from "../entities/Todo";
import type { TodoDTO } from "@/types/todo";

export const toTodoDTO = (todo: Todo): TodoDTO => ({
  id: todo.id,
  title: todo.title,
  description: todo.description ?? null,
  status: todo.status,
  dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
  tags: todo.tags,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString()
});
