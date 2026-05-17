/**
 * PetPooja REST API client
 * Docs: https://developers.petpooja.com
 *
 * Required env vars:
 *   PETPOOJA_APP_KEY
 *   PETPOOJA_APP_SECRET
 *   PETPOOJA_ACCESS_TOKEN
 *   PETPOOJA_RESTAURANT_ID
 */

const BASE_URL = "https://api.petpooja.com/v2";

interface PetpoojaAuth {
  app_key: string;
  app_secret: string;
  access_token: string;
  restaurant_id: string;
}

function getAuth(): PetpoojaAuth {
  return {
    app_key: process.env.PETPOOJA_APP_KEY ?? "",
    app_secret: process.env.PETPOOJA_APP_SECRET ?? "",
    access_token: process.env.PETPOOJA_ACCESS_TOKEN ?? "",
    restaurant_id: process.env.PETPOOJA_RESTAURANT_ID ?? "",
  };
}

async function petpoojaPost<T>(endpoint: string, body: Record<string, string>): Promise<T> {
  const auth = getAuth();
  const payload = {
    ...auth,
    ...body,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`PetPooja API error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export interface PetpoojaMenuResponse {
  status: number;
  restaurants: Array<{
    restaurantid: string;
    restaurantname: string;
    items: Array<{
      itemid: string;
      itemname: string;
      itemdescription: string;
      price: string;
      itemveg: string;
    }>;
    categories: Array<{
      categoryid: string;
      categoryname: string;
    }>;
  }>;
}

export interface PetpoojaConsumptionResponse {
  status: number;
  message: string;
  data: Array<{
    itemid: string;
    itemname: string;
    quantity: number;
    unit: string;
    amount: number;
    date: string;
  }>;
}

export interface PetpoojaInventoryResponse {
  status: number;
  message: string;
  inventoryreport: Array<{
    itemid: string;
    itemname: string;
    quantity: number;
    unit: string;
    minimumquantity: number;
    purchaseprice: number;
  }>;
}

export async function fetchMenu(): Promise<PetpoojaMenuResponse> {
  return petpoojaPost<PetpoojaMenuResponse>("/restaurant/menu", {});
}

export async function fetchConsumptionReport(
  startDate: string,
  endDate: string
): Promise<PetpoojaConsumptionResponse> {
  return petpoojaPost<PetpoojaConsumptionResponse>("/restaurant/consumptionreport", {
    start_date: startDate,
    end_date: endDate,
  });
}

export async function fetchInventoryReport(): Promise<PetpoojaInventoryResponse> {
  return petpoojaPost<PetpoojaInventoryResponse>("/restaurant/inventoryreport", {});
}
