import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { handlerGET, handlerPOST } from "./route";
import { requireUserWithRoles, AuthenticatedContext } from "@/lib/api/auth";
import { getEntityManager } from "@/lib/db/client";
import { Todo } from "@/lib/db/entities";
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

describe("Todos API - root", () => {
  const mockEm = {
    find: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    persistAndFlush: vi.fn(),
    getReference: vi.fn(),
  } as unknown as MongoEntityManager;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getEntityManager).mockResolvedValue(mockEm);
  });

  describe("GET /api/auth/todos", () => {
    it("returns todos for a user", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      vi.mocked(mockEm.getReference).mockReturnValue(mockUser as never);
      vi.mocked(mockEm.find).mockResolvedValue([{ id: "todo1", title: "Test Todo", status: "PENDING" }] as never);
      vi.mocked(mockEm.count).mockResolvedValue(1);

      const req = new NextRequest("http://localhost/api/auth/todos");
      const res = await handlerGET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.todos).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(mockEm.find).toHaveBeenCalledWith(Todo, expect.objectContaining({ owner: mockUser }), expect.any(Object));
    });

    it("filters by status", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      vi.mocked(mockEm.getReference).mockReturnValue(mockUser as never);
      vi.mocked(mockEm.find).mockResolvedValue([] as never);
      vi.mocked(mockEm.count).mockResolvedValue(0);

      const req = new NextRequest("http://localhost/api/auth/todos?status=COMPLETED");
      await handlerGET(req);

      expect(mockEm.find).toHaveBeenCalledWith(
        Todo,
        expect.objectContaining({ status: "COMPLETED", owner: mockUser }),
        expect.any(Object)
      );
    });

    it("allows admin to filter by userId", async () => {
        const mockAdmin = { id: "admin1", role: "admin" };
        vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockAdmin } as unknown as AuthenticatedContext);
        vi.mocked(mockEm.find).mockResolvedValue([] as never);
        vi.mocked(mockEm.count).mockResolvedValue(0);
  
        const req = new NextRequest("http://localhost/api/auth/todos?userId=other-user");
        await handlerGET(req);
  
        expect(mockEm.find).toHaveBeenCalledWith(
          Todo,
          expect.objectContaining({ owner: "other-user" }),
          expect.any(Object)
        );
      });
  });

  describe("POST /api/auth/todos", () => {
    it("creates a new todo", async () => {
      const mockUser = { id: "user1", role: "user" };
      vi.mocked(requireUserWithRoles).mockResolvedValue({ user: mockUser } as unknown as AuthenticatedContext);
      vi.mocked(mockEm.getReference).mockReturnValue(mockUser as never);
      const mockTodo = { title: "New Todo", status: "todo" };
      vi.mocked(mockEm.create).mockReturnValue(mockTodo as never);

      const req = new NextRequest("http://localhost/api/auth/todos", {
        method: "POST",
        body: JSON.stringify({ title: "New Todo" }),
      });
      const res = await handlerPOST(req);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.todo.title).toBe("New Todo");
      expect(mockEm.persistAndFlush).toHaveBeenCalledWith(mockTodo);
    });
  });
});

