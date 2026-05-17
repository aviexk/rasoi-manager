import { NextRequest, NextResponse } from "next/server";
import { fetchConsumptionReport } from "@/lib/petpooja";
import { mockConsumption } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("start") ?? new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const endDate = searchParams.get("end") ?? new Date().toISOString().split("T")[0];

  // Use real PetPooja API if credentials are set, otherwise return mock data
  if (process.env.PETPOOJA_APP_KEY) {
    try {
      const data = await fetchConsumptionReport(startDate, endDate);
      return NextResponse.json({ source: "petpooja", data });
    } catch (err) {
      console.error("PetPooja API failed, falling back to mock:", err);
    }
  }

  return NextResponse.json({ source: "mock", data: mockConsumption });
}
