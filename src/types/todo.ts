export const TODO_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];

export type TodoDTO = {
  id: string;
  title: string;
  description?: string | null;
  status: TodoStatus;
  dueDate?: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};
