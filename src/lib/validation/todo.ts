import { z } from "zod";
import { TODO_STATUSES } from "@/types/todo";

const title = z.string().min(3);
const description = z.string().max(2000).optional();
const status = z.enum(TODO_STATUSES).optional();
const dueDate = z.coerce.date().optional();
const tags = z.array(z.string()).optional();

export const upsertTodoSchema = z.object({
  id: z.string().optional(),
  title,
  description,
  status: z.enum(TODO_STATUSES).default("PENDING"),
  dueDate,
  tags
});

export const createTodoSchema = upsertTodoSchema.omit({ id: true });
export const updateTodoSchema = upsertTodoSchema.extend({ id: z.string() });

export const todoFilterSchema = z.object({
  status,
  search: z.string().optional(),
  dueStart: z.coerce.date().optional(),
  dueEnd: z.coerce.date().optional()
});

export type UpsertTodoInput = z.infer<typeof upsertTodoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoFilterInput = z.infer<typeof todoFilterSchema>;
