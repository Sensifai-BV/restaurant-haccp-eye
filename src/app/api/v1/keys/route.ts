export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/sensifai/auth";
import {
  listApiKeys,
  createNewApiKey,
  revokeApiKey,
} from "@/lib/sensifai/api-keys";

/**
 * REST API for Restaurant HACCP Eye Developer Keys
 * GET    /api/v1/keys - List active/revoked API keys for authenticated user (masked secrets)
 * POST   /api/v1/keys - Generate a new dedicated application key (rh_live_...) tied to user's wallet
 * DELETE /api/v1/keys - Revoke an existing API key owned by authenticated user
 *
 * Strictly rejects unauthenticated callers with 401 Unauthorized.
 * Zero Logto IDs, emails, or personal tokens are ever leaked in client responses.
 */

export async function GET(req: NextRequest) {
  try {
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to view API keys. Please sign in with your Sensifai wallet.",
          code: "UNAUTHORIZED",
          login_url: "/api/auth/login",
        },
        { status: 401 }
      );
    }

    const keys = listApiKeys(sub);
    const sanitized = keys.map((k) => ({
      id: k.id,
      name: k.name,
      maskedKey: k.maskedKey,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      status: k.status,
    }));

    return NextResponse.json({
      success: true,
      keys: sanitized,
      total: sanitized.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to list API keys", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to generate API keys. Please sign in with your Sensifai wallet.",
          code: "UNAUTHORIZED",
          login_url: "/api/auth/login",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "Kitchen Station HACCP Audit Key").trim();

    const newKeyRecord = createNewApiKey(name, sub);

    return NextResponse.json(
      {
        success: true,
        message: "API Key created successfully. Store it safely, as full secret is only shown once.",
        apiKey: newKeyRecord.key,
        id: newKeyRecord.id,
        name: newKeyRecord.name,
        createdAt: newKeyRecord.createdAt,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to create API key", message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to revoke API keys.",
          code: "UNAUTHORIZED",
          login_url: "/api/auth/login",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Key ID is required" },
        { status: 400 }
      );
    }

    const ok = revokeApiKey(id, sub);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Key not found or not owned by caller" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Key ${id} revoked successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to revoke API key", message: err.message },
      { status: 500 }
    );
  }
}
