"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/http/client";
import { tokenStorage } from "@/lib/http/token-storage";
import type { TodoFilterInput, UpsertTodoInput } from "@/lib/validation/todo";
import type { TodoDTO } from "@/types/todo";

type TodosResponse = {
  todos: TodoDTO[];
  total: number;
};

export const useTodos = (filters: Partial<TodoFilterInput>) =>
  useQuery<TodosResponse>({
    queryKey: ["todos", filters],
    queryFn: async () => {
      const { data } = await api.get("/api/todos", { params: filters });
      return data;
    },
    enabled: typeof window !== "undefined" && !!tokenStorage.getAccessToken()
  });

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpsertTodoInput) => {
      const { data } = await api.post("/api/todos", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpsertTodoInput) => {
      const { id, ...rest } = payload;
      const { data } = await api.patch(`/api/todos/${id}`, rest);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
};
