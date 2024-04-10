import axios from "axios";
const key =
  "sk_r-rVS2vIlgIfhVpv-Cw1mWazWOY6JypuXTbvx1Cw5EhoxjjA4cZkyXpAwbiTCqxT";
export const requestGeneral = async () => {
  const webhookUrl = "https://delaqua.vercel.app/api/return";
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
    console.log("success");
    return null;
  } catch (error) {
    console.error("Ошибка при создании webhook:", error);
  }
};
