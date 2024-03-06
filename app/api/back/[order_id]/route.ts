import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const key =
  "sk_CAWFozjx49HzfPb05oju56ciYeaVc28IG8-fAgNO3oE_KyvdPGaSW3ysNZIDiCVB";

export async function GET(
  req: NextRequest,
  { params }: { params: { order_id: string } }
) {
  const id = params.order_id;

  try {
    const response = await axios.get(
      `https://sandbox-merchant.revolut.com/api/orders/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Revolut-Api-Version": "2023-09-01",
          Authorization: `Bearer ${key}`,
        },
        maxBodyLength: Infinity,
      }
    );

    console.log(response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Ошибка при получении данных о заказе:", error);
    return NextResponse.json({
      error: `Ошибка при получении данных о заказе по id", ${error}`,
    });
  }
}
