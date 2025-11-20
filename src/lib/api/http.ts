import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const json = <T>(data: T, init?: ResponseInit) => NextResponse.json(data, init);

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    const message = error.errors[0]?.message ?? "Invalid request payload";
    return NextResponse.json({ error: message, issues: error.format() }, { status: 400 });
  }

  console.error(error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};

export const assert = (condition: unknown, status: number, message: string) => {
  if (!condition) {
    throw new ApiError(status, message);
  }
};
