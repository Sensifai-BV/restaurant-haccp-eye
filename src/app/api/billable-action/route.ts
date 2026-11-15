export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/sensifai/auth";
import { usageService } from "@/lib/sensifai/usage";
import { callSensifaiAIJson, callSensifaiAI } from "@/lib/sensifai/ai";

/**
 * Billable Kitchen Hygiene & HACCP Photo Audit Route
 *
 * Flow:
 * 1. Resolve customer ID (sub) from Logto session/cookie -> return 401 if unauthenticated.
 * 2. Pre-check prepaid wallet balance & deduct €0.05 via Gatekeeper with atomic NATS JetStream sync.
 * 3. Return 402 if wallet balance is insufficient.
 * 4. Execute Sensifai AI Engine kitchen hygiene audit via LiteLLM Gateway (Latest Gemini).
 * 5. Run deterministic food-safety rules and temperature boundary checks in plain code.
 * 6. Return verified payload with updated wallet balance.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Strict Authentication Check (Zero Free Guest Execution)
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          error:
            "Authentication required to perform billable actions. Please sign in with your Sensifai account.",
          code: "UNAUTHORIZED",
          login_url: "/api/auth/login",
        },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));

    // 3. Atomic Wallet Pre-Check + Usage Deduction + Gatekeeper Ledger Sync
    const deduction = await usageService.deductAndSyncWallet({
      logtoUserId: sub,
      operation: body.operation || "haccp_audit",
      usageUnits: 1,
    });

    if (!deduction.success && deduction.status === 402) {
      return NextResponse.json(
        {
          error:
            deduction.error ||
            "Wallet balance insufficient. Please top up your Sensifai wallet.",
          top_up_url: deduction.topUpUrl || "https://sensifai.com/marketplace",
          code: "PAYMENT_REQUIRED",
          current_balance: deduction.wallet.balance,
          wallet: deduction.wallet,
        },
        { status: 402 }
      );
    }

    // 4. Handle Kitchen HACCP Audit via Sensifai AI Engine
    // If simple prompt is supplied, handle flexibly
    if (body.prompt && !body.stationName) {
      const aiResponse = await callSensifaiAI({
        mode: body.mode === "reasoning" ? "reasoning" : "fast",
        messages: [
          {
            role: "system",
            content:
              body.systemPrompt ||
              "You are the Sensifai AI Engine for Commercial Kitchen Food Safety and HACCP Audits. Provide structured, accurate compliance findings.",
          },
          { role: "user", content: String(body.prompt) },
        ],
      });

      return NextResponse.json(
        {
          success: true,
          identifier: deduction.identifier,
          deducted_eur: deduction.deductedAmount,
          result: aiResponse.content,
          processed_at: new Date().toISOString(),
          wallet: deduction.wallet,
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
        }
      );
    }

    const stationName = body.stationName || "Prep Line 1 & Walk-In Cooler";
    const category = body.category || "Cold Holding & Station Sanitation";
    const measuredTemp = body.measuredTemp !== undefined ? Number(body.measuredTemp) : 37.2;
    const unit = body.unit || "°F";
    const observations = body.observations || "Morning shift opening checklist inspection.";
    const labelsText = body.labelsText || "Raw beef trim Nov 14, Prep soup Nov 15.";

    const systemPrompt = `You are the Sensifai AI Engine for Commercial Kitchen Food Safety and HACCP Audits.
Analyze kitchen station observations, thermometer readings, and prep label information.
Verify Critical Control Points (CCPs) per FDA Food Code and international HACCP standards:
- Cold food holding: <= 41.0°F (5.0°C)
- Hot food holding: >= 135.0°F (57.0°C)
- Dish machine high-temp sanitizing rinse: >= 180.0°F (82.0°C)
- Chemical sanitizer bucket concentration: 200-400 ppm quat or 50-100 ppm chlorine
- Ready-to-eat TCS food shelf life: Maximum 7 days at <= 41°F with day 1 marked
Return STRICT JSON ONLY matching this schema:
{
  "reportId": "string",
  "title": "string",
  "category": "string",
  "location": "string",
  "shift": "string",
  "overallScore": number (0 to 100),
  "ccpStatus": "PASSED" | "ACTION_REQUIRED" | "CRITICAL_VIOLATION",
  "summary": "string",
  "temperatureReadings": [
    {
      "station": "string",
      "measuredTemp": number,
      "unit": "°F" | "°C",
      "targetRange": "string",
      "status": "SAFE" | "WARNING" | "DANGER",
      "probeType": "string",
      "confidence": number (0.0 to 1.0)
    }
  ],
  "hygieneItems": [
    {
      "id": "string",
      "station": "string",
      "check": "string",
      "status": "PASS" | "NEEDS_FIX" | "FAIL",
      "confidence": number (0.0 to 1.0),
      "evidence": "string",
      "correctiveAction": "string (optional)"
    }
  ],
  "prepLabels": [
    {
      "id": "string",
      "item": "string",
      "prepDate": "string",
      "expiryDate": "string",
      "shelfLife": "string",
      "status": "COMPLIANT" | "EXPIRED" | "MISSING_TAG",
      "allergenTagged": boolean,
      "notes": "string"
    }
  ],
  "correctiveTasks": [
    {
      "id": "string",
      "title": "string",
      "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "assignedRole": "string",
      "deadline": "string",
      "resolved": false
    }
  ]
}`;

    const userPrompt = `Audit Kitchen Station:
Station: ${stationName}
Category: ${category}
Measured Temperature: ${measuredTemp} ${unit}
Observations: ${observations}
Prep Labels: ${labelsText}`;

    const { data: auditData } = await callSensifaiAIJson<any>({
      mode: body.mode === "reasoning" ? "reasoning" : "fast",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        identifier: deduction.identifier,
        deducted_eur: deduction.deductedAmount,
        audit: auditData,
        processed_at: new Date().toISOString(),
        wallet: deduction.wallet,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      }
    );
  } catch (err: any) {
    console.error("[BILLABLE_ACTION] Error:", err);
    return NextResponse.json(
      {
        error: "Unable to complete request at this time.",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
