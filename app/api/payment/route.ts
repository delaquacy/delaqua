import axios from "axios";
import { NextResponse } from "next/server";
const key = process.env.REVOLUT_KEY;

export async function POST(req: any, res: any) {
  const body = await req.json();
  const { currency, amount, description } = body;
  //  amount: amount * 100 - The total amount of the order in minor currency units. For example, 7034 represents €70.34.
  try {
    const response = await axios.post(
      "https://merchant.revolut.com/api/orders",
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
