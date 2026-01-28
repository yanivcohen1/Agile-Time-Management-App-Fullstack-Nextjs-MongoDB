import { NextRequest } from "next/server";
import { ApiError, handleApiError, json } from "@/lib/api/http";
import { requireUser, toClientUser } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireUser();
    if (user.role !== "admin") {
      throw new ApiError(403, "Admin privileges required");
    }

    return json({ info: toClientUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
