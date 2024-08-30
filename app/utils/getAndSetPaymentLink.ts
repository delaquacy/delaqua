import axios from "axios";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/config";

export const getAndSetPaymentLink = async (
  amount: number,
  phoneNumber: string | undefined,
  dataAndTime: string,
  orderIdFromDB: string,
  currentAllOrderId: string,
  userId: string,
  setUrl: (url: string) => void
) => {
  try {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        currency: "EUR",
        description: `Delaqua Water delivery for ${phoneNumber}, ordered on ${dataAndTime}`,
      }),
    });

    const data = await response.json();

    const formatPhoneNumber = phoneNumber?.replace(/\+/g, "");

    const resp = await axios.post(
      process.env.NEXT_PUBLIC_PAYMENT_SHEET_LINK as string,
      {
        userPhone: formatPhoneNumber,
        amount: `${amount}€`,
        orderId: data.id,
        description: `date:${dataAndTime}, number: ${phoneNumber}`,
      },
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    const orderRef = doc(db, `users/${userId}/orders/${orderIdFromDB}`);
    const allOrdersRef = doc(db, `allOrders/${currentAllOrderId}`);

    await updateDoc(orderRef, {
      paymentId: data.id,
      paymentLink: data.checkout_url,
    });

    await updateDoc(allOrdersRef, {
      paymentId: data.id,
      paymentLink: data.checkout_url,
    });

    const paymentRef = doc(db, `payments/${data.id}`);

    await setDoc(paymentRef, {
      userId: userId,
      number: phoneNumber,
      amount: amount,
    });

    setUrl(data.checkout_url);
  } catch (error) {
    console.error("Error when creating an order:", error);
  }
};
