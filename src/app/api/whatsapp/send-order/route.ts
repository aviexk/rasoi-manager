import { NextRequest, NextResponse } from "next/server";
import { sendOrderToSupplier } from "@/lib/whatsapp";
import type { WhatsAppOrderPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json() as WhatsAppOrderPayload;

  if (!body.supplierPhone || !body.items?.length) {
    return NextResponse.json({ error: "supplierPhone and items are required" }, { status: 400 });
  }

  try {
    const result = await sendOrderToSupplier(body);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
