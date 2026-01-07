import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { handlerGET, handlerPUT, handlerDELETE } from "./route";
import { requireUserWithRoles, AuthenticatedContext } from "@/lib/api/auth";
import { getEntityManager } from "@/lib/db/client";
import type { MongoEntityManager } from "@mikro-orm/mongodb";

vi.mock("@/lib/api/auth", () => ({
  requireUserWithRoles: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getEntityManager: vi.fn(),
}));

vi.mock("@/lib/db/serializers/todo", () => ({
  toTodoDTO: vi.fn((todo) => ({ ...todo, id: (todo as { id: string }).id || "mock-id" })),
}));

describe("Todos API - [id]", () => {
  const mockEm = {
    findOne: vi.fn(),
    flush: vi.fn(),
    removeAndFlush: vi.fn(),
    getReference: vi.fn(),
  } as unknown as MongoEntityManager;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getEntityManager).mockResolvedValue(mockEm);
  });

  const mockContext = { params: Promise.resolve({ id: "todo1" }) };

  describe("GET /api/auth/todos/[id]", () => {
    it("returns a specific todo", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      vi.mocked(mockEm.getReference).mockReturnValue({ id: "user-ref" } as never);
      const mockTodo = { id: "todo1", title: "Test Todo", status: "PENDING" };
      vi.mocked(mockEm.findOne).mockResolvedValue(mockTodo as never);

      const req = new NextRequest("http://localhost/api/auth/todos/todo1");
      const res = await handlerGET(req, mockContext);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.todo.id).toBe("todo1");
    });

    it("throws 404 if todo not found", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      vi.mocked(mockEm.findOne).mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/auth/todos/nonexistent");
      await expect(handlerGET(req, mockContext)).rejects.toThrow("Todo not found");
    });
  });

  describe("PUT /api/auth/todos/[id]", () => {
    it("updates a todo", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      const mockTodo = { id: "todo1", title: "Old Title", status: "PENDING" };
      vi.mocked(mockEm.findOne).mockResolvedValue(mockTodo as never);

      const req = new NextRequest("http://localhost/api/auth/todos/todo1", {
        method: "PUT",
        body: JSON.stringify({ id: "todo1", title: "New Title", status: "COMPLETED" }),
      });
      const res = await handlerPUT(req, mockContext);

      expect(res.status).toBe(200);
      expect(mockTodo.title).toBe("New Title");
      expect(mockTodo.status).toBe("COMPLETED");
      expect(mockEm.flush).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/auth/todos/[id]", () => {
    it("deletes a todo", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      const mockTodo = { id: "todo1", title: "Test Todo" };
      vi.mocked(mockEm.findOne).mockResolvedValue(mockTodo as never);

      const req = new NextRequest("http://localhost/api/auth/todos/todo1", {
        method: "DELETE",
      });
      const res = await handlerDELETE(req, mockContext);

      expect(res.status).toBe(200);
      expect(mockEm.removeAndFlush).toHaveBeenCalledWith(mockTodo);
    });
  });
});

