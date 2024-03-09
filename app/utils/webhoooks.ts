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

    console.log("Webhook создан успешно:", response.config.data);
  } catch (error) {
    console.error("Ошибка при создании webhook:", error);
  }
};
const key =
  "sk_CAWFozjx49HzfPb05oju56ciYeaVc28IG8-fAgNO3oE_KyvdPGaSW3ysNZIDiCVB";
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

    console.log("Webhook создан успешно:", response.config.data);
  } catch (error) {
    console.error("Ошибка при создании webhook:", error);
  }
};
