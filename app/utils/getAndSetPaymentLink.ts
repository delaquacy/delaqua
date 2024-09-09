import { FirebaseService } from "../lib/FirebaseServices";
import { OrderService } from "../lib/OrderService";

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
    const data = await OrderService.createPayment(
      amount,
      phoneNumber,
      dataAndTime
    );

    const formatPhoneNumber = phoneNumber?.replace(/\+/g, "");

    await OrderService.sendPaymentDataToSheet(
      formatPhoneNumber || "",
      amount,
      data.id,
      dataAndTime
    );

    await OrderService.updateOrderPaymentData(
      userId,
      orderIdFromDB,
      currentAllOrderId,
      {
        paymentId: data.id,
        paymentLink: data.checkout_url,
        paymentMethod: "Online",
      }
    );

    await FirebaseService.setDocument("payments", data.id, {
      userId,
      number: phoneNumber,
      amount,
    });

    setUrl(data.checkout_url);
  } catch (error) {
    console.error("Error when creating an order:", error);
  }
};
