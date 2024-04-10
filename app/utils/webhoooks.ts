import axios from "axios";

export const requestToReturnSuccessStatus = async () => {
  const webhookUrl = "https://delaqua.vercel.app/api/return";
  const events = ["ORDER_COMPLETED"];
  try {
    const response = await axios.post(
      "/api/webhookSuccess",
      {
        webhookUrl,
        events,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return null;
  } catch (error) {
    console.error("Ошибка при создании webhook:", error);
  }
};
const key = process.env.REVOLUT_KEY;
export const requestToReturnFailStatus = async () => {
  const webhookUrl = "https://delaqua.vercel.app/api/returnNot";
  const events = ["ORDER_PAYMENT_DECLINED"];
  try {
    const response = await axios.post(
      "/api/webhookFail",
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
