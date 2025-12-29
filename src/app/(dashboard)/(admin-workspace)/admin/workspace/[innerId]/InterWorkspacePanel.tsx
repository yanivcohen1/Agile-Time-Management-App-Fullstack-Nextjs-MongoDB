"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Paper,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box
} from "@mui/material";
import { api } from "@/lib/http/client";
import { useSession } from "@/hooks/useAuth";
import type { SessionUser } from "@/types/auth";
import type { TodoDTO } from "@/types/todo";

type InterWorkspacePanelProps = {
  title?: string;
  description?: string;
};

type UsersResponse = {
  users: SessionUser[];
};

type TodosResponse = {
  todos: TodoDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function InterWorkspacePanel({
  title = "Inter workspace",
  description = "Centralize your teammate onboarding tasks and monitor their progress. This section is a placeholder for upcoming collaboration tooling."
}: InterWorkspacePanelProps) {
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: usersData } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get<UsersResponse>("/api/auth/users");
      return data;
    },
    enabled: session?.user.role === "admin"
  });

  const { data: todosData } = useQuery<TodosResponse>({
    queryKey: ["todos", selectedUserId],
    queryFn: async () => {
      const { data } = await api.get<TodosResponse>(`/api/auth/todos?userId=${selectedUserId}&limit=100`);
      return data;
    },
    enabled: !!selectedUserId && session?.user.role === "admin"
  });

  if (session?.user.role !== "admin") {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUserId}
            label="Select User"
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {usersData?.users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUserId && todosData && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Todos for {usersData?.users.find(u => u.id === selectedUserId)?.name}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Tags</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todosData.todos.map((todo) => (
                    <TableRow key={todo.id}>
                      <TableCell>{todo.title}</TableCell>
                      <TableCell>{todo.description || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={todo.status}
                          color={
                            todo.status === "COMPLETED" ? "success" :
                            todo.status === "IN_PROGRESS" ? "warning" : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        {todo.tags?.length ? todo.tags.join(", ") : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
