import { NextResponse } from "next/server";
import { fetchInventoryReport, fetchMenu } from "@/lib/petpooja";

export async function POST() {
  if (!process.env.PETPOOJA_APP_KEY) {
    return NextResponse.json({
      success: false,
      message: "PetPooja credentials not configured. Add PETPOOJA_APP_KEY, PETPOOJA_APP_SECRET, PETPOOJA_ACCESS_TOKEN, and PETPOOJA_RESTAURANT_ID to .env.local",
    }, { status: 422 });
  }

  try {
    const [menu, inventory] = await Promise.all([
      fetchMenu(),
      fetchInventoryReport(),
    ]);

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      itemCount: menu.restaurants?.[0]?.items?.length ?? 0,
      inventoryCount: inventory.inventoryreport?.length ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
