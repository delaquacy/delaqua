import axios from "axios";

// export const requestToReturnSuccessStatus = async () => {
//   const webhookUrl = "https://delaqua.vercel.app/api/return";
//   const events = ["ORDER_COMPLETED"];
//   try {
//     const response = await axios.post(
//       "/api/webhookSuccess",
//       {
//         webhookUrl,
//         events,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return null;
//   } catch (error) {
//     console.error("Ошибка при создании webhook:", error);
//   }
// };
const key = process.env.NEXT_PUBLIC_REVOLUT_KEY;
// export const requestToReturnFailStatus = async () => {
//   const webhookUrl = "https://delaqua.vercel.app/api/returnNot";
//   const events = ["ORDER_PAYMENT_DECLINED"];
//   try {
//     const response = await axios.post(
//       "/api/webhookFail",
//       {
//         webhookUrl,
//         events,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${key}`,
//         },
//       }
//     );

//     return null;
//   } catch (error) {
//     console.error("Ошибка при создании webhook:", error);
//   }
// };

export const requestGeneral = async () => {
  const webhookUrl = "https://delaqua.vercel.app/api/returnHook";
  const events = [
    "ORDER_COMPLETED",
    "ORDER_AUTHORISED",
    "ORDER_CANCELLED",
    "ORDER_PAYMENT_AUTHENTICATED",
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
