export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { HACCP_PRESETS } from "@/lib/presets";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, X-API-Key, Content-Type",
    },
  });
}

/**
 * Public REST API: Kitchen Station Presets & CCP Threshold Catalog
 * GET /api/v1/stations
 * Provides commercial kitchen station templates, target temperature ranges,
 * and critical control point (CCP) criteria per FDA Food Code and HACCP standards.
 * Zero personal credentials or user IDs.
 */
export async function GET() {
  try {
    const stations = HACCP_PRESETS.map((p) => ({
      id: p.id,
      stationName: p.title,
      category: p.category,
      location: p.location,
      baselineScore: p.overallScore,
      ccpStatus: p.ccpStatus,
      temperatureReadings: p.temperatureReadings.map((t) => ({
        station: t.station,
        measuredTemp: t.measuredTemp,
        unit: t.unit,
        targetRange: t.targetRange,
        status: t.status,
        probeType: t.probeType,
      })),
      hygieneChecklistCount: p.hygieneItems.length,
      prepLabelsCount: p.prepLabels.length,
      correctiveTasksCount: p.correctiveTasks.length,
    }));

    const ccpStandards = {
      coldFoodHolding: {
        maxTempF: 41.0,
        maxTempC: 5.0,
        standard: "FDA Food Code § 3-501.16",
        description: "Refrigerated foods must be held at 41°F (5°C) or below.",
      },
      hotFoodHolding: {
        minTempF: 135.0,
        minTempC: 57.2,
        standard: "FDA Food Code § 3-501.16",
        description: "Hot holding units must maintain food at 135°F (57°C) or above.",
      },
      highTempSanitizingRinse: {
        minTempF: 180.0,
        minTempC: 82.2,
        standard: "FDA Food Code § 4-501.112",
        description: "Commercial mechanical dish machine final sanitizing rinse.",
      },
      dangerZone: {
        rangeF: "41°F to 135°F",
        rangeC: "5°C to 57°C",
        standard: "HACCP Temperature Danger Zone",
        description: "Rapid bacterial growth occurs within this window. 4-hour max exposure rule.",
      },
    };

    return NextResponse.json(
      {
        success: true,
        stations,
        ccpStandards,
        totalStations: stations.length,
        version: "v1.0",
        documentationUrl: "https://restaurant-haccp-eye.sensifai.com#api",
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve station catalog",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
