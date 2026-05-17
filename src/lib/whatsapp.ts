/**
 * Meta WhatsApp Business Cloud API client
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * Required env vars:
 *   WHATSAPP_PHONE_NUMBER_ID   — your WhatsApp Business phone number ID
 *   WHATSAPP_ACCESS_TOKEN      — permanent system user token
 */

import type { WhatsAppOrderPayload } from "./types";
import { formatINR } from "./utils";

const BASE = "https://graph.facebook.com/v20.0";

export function buildOrderMessage(payload: WhatsAppOrderPayload): string {
  const lines = [
    `🛒 *Purchase Order — ${payload.restaurantName}*`,
    `Order ID: ${payload.orderId}`,
    `Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    payload.expectedDelivery
      ? `Delivery by: ${payload.expectedDelivery}`
      : null,
    ``,
    `*Items:*`,
    ...payload.items.map(
      (item, i) =>
        `${i + 1}. ${item.itemName} — ${item.quantity} ${item.unit} @ ${formatINR(item.unitCost)}/${item.unit} = *${formatINR(item.totalCost)}*`
    ),
    ``,
    `*Total Amount: ${formatINR(payload.totalAmount)}*`,
    payload.notes ? `\nNotes: ${payload.notes}` : null,
    ``,
    `_Please confirm receipt of this order._`,
    `_Powered by Rasoi Manager_`,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<{ messageId: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    throw new Error("WhatsApp credentials not configured");
  }

  const res = await fetch(`${BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${err}`);
  }

  const data = await res.json() as { messages: Array<{ id: string }> };
  return { messageId: data.messages[0]?.id ?? "" };
}

export async function sendOrderToSupplier(
  payload: WhatsAppOrderPayload
): Promise<{ messageId: string; waLink: string }> {
  const message = buildOrderMessage(payload);

  // In production this calls sendWhatsAppMessage(); for demo we expose waLink
  const waLink = `https://wa.me/${payload.supplierPhone}?text=${encodeURIComponent(message)}`;

  if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
    const result = await sendWhatsAppMessage(payload.supplierPhone, message);
    return { messageId: result.messageId, waLink };
  }

  // Demo mode — return the wa.me deep-link so it still works without credentials
  return { messageId: "demo_" + Date.now(), waLink };
}
