import axios from "axios";
const key = process.env.REVOLUT_KEY;
export const requestGeneral = async () => {
  const webhookUrl = "https://delaqua.vercel.app/api/returnHook";
  const events = [
    "ORDER_COMPLETED",
    "ORDER_CANCELLED",
    "ORDER_PAYMENT_DECLINED",
    "ORDER_PAYMENT_FAILED",
  ];
  try {
    const response = await axios.post(
      "/api/webhook",
      {
        webhookUrl,
        events,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    return null;
  } catch (error) {
    console.error("Ошибка при создании webhook:", error);
  }
};
