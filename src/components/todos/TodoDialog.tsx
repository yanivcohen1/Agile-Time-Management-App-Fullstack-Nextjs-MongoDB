"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";
import { upsertTodoSchema, type UpsertTodoInput } from "@/lib/validation/todo";
import type { TodoStatus } from "@/types/todo";

const statusOptions: { label: string; value: TodoStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" }
];

type Props = {
  open: boolean;
  initialValues?: UpsertTodoInput;
  isSaving: boolean;
  onClose: () => void;
  onSave: (values: UpsertTodoInput) => void;
};

export function TodoDialog({ open, initialValues, isSaving, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpsertTodoInput>({
    resolver: zodResolver(upsertTodoSchema),
    defaultValues: initialValues ?? {
      title: "",
      description: "",
      status: "PENDING" as TodoStatus
    }
  });

  useEffect(() => {
    if (open) {
      reset(initialValues ?? { title: "", description: "", status: "PENDING" as TodoStatus });
    }
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues?.id ? "Edit todo" : "Create todo"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField select label="Status" {...register("status")}>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="Due date"
            InputLabelProps={{ shrink: true }}
            {...register("dueDate", {
              setValueAs: (value: string | null) => (value ? new Date(value) : undefined)
            })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSave)} disabled={isSaving}>
          {initialValues?.id ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
