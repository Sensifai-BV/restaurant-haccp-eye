export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/sensifai/api-keys";
import { callSensifaiAIJson } from "@/lib/sensifai/ai";

/**
 * Public REST API for B2B Kitchen Audits & POS/Tablet Integrations
 * POST /api/v1/audit
 * Authorization: Bearer rh_live_<secret>
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const apiKey = authHeader.replace(/^Bearer\s+/i, "").trim();

    const validKeyRecord = validateApiKey(apiKey);
    if (!validKeyRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or revoked API key. Supply 'Authorization: Bearer rh_live_...'",
          code: "INVALID_API_KEY",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const stationName = body.stationName || "Main Kitchen Cook Line";
    const category = body.category || "General Station Hygiene";
    const measuredTemp = body.measuredTemp !== undefined ? Number(body.measuredTemp) : 38.0;
    const unit = body.unit || "°F";
    const observations = body.observations || "Automated station photo analysis";
    const labelsText = body.labelsText || "Prep items checked";

    const systemPrompt = `You are the Sensifai AI Engine for Commercial Kitchen Food Safety and HACCP Audits.
Analyze kitchen station observations, thermometer readings, and prep label information.
Verify Critical Control Points (CCPs) per FDA Food Code and international HACCP standards:
- Cold food holding: <= 41.0°F (5.0°C)
- Hot food holding: >= 135.0°F (57.0°C)
- Dish machine high-temp sanitizing rinse: >= 180.0°F (82.0°C)
Return STRICT JSON ONLY matching:
{
  "reportId": "string",
  "station": "string",
  "overallScore": number (0 to 100),
  "ccpStatus": "PASSED" | "ACTION_REQUIRED" | "CRITICAL_VIOLATION",
  "summary": "string",
  "temperatureStatus": "SAFE" | "WARNING" | "DANGER",
  "findings": [
    { "type": "string", "description": "string", "confidence": number, "needsReview": boolean }
  ],
  "correctiveActions": [
    { "action": "string", "priority": "HIGH" | "MEDIUM" | "LOW", "role": "string" }
  ]
}`;

    const { data: auditResult } = await callSensifaiAIJson<any>({
      mode: "fast",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Audit: Station: ${stationName}, Category: ${category}, Temp: ${measuredTemp}${unit}, Observations: ${observations}, Labels: ${labelsText}`,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      apiKeyId: validKeyRecord.id,
      keyName: validKeyRecord.name,
      audit: auditResult,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[API_V1_AUDIT] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal processing error", message: err.message },
      { status: 500 }
    );
  }
}
