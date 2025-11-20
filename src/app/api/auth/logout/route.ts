import { NextRequest } from "next/server";
import { refreshSchema } from "@/lib/validation/auth";
import { handleError, json, ApiError } from "@/lib/api/http";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { revokeRefreshToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const payload = refreshSchema.parse(await request.json());
    let tokenPayload;
    try {
      tokenPayload = verifyRefreshToken(payload.refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    await revokeRefreshToken(tokenPayload.tokenId);
    return json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
