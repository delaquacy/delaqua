import axios from "axios";
import { NextResponse } from "next/server";
const key =
  "sk_CAWFozjx49HzfPb05oju56ciYeaVc28IG8-fAgNO3oE_KyvdPGaSW3ysNZIDiCVB";

export async function POST(req: any, res: any) {
  const body = await req.json();
  const { currency, amount, description } = body;
  try {
    const response = await axios.post(
      "https://sandbox-merchant.revolut.com/api/orders",
      {
        amount: amount * 100,
        currency,
        description,
      },
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

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Ошибка при создании платежа:", error);
    return NextResponse.json({
      error: `Ошибка при обработке платежа", ${error}`,
    });
  }
}
