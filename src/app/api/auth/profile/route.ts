import { NextRequest } from "next/server";
import { handleError, json } from "@/lib/api/http";
import { requireUser, toClientUser } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireUser(request);
    return json({ user: toClientUser(user) });
  } catch (error) {
    return handleError(error);
  }
}
