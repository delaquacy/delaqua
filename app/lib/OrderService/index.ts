import { OrdersData } from "@/app/types";
import { getAndSetPaymentLink } from "@/app/utils/getAndSetPaymentLink";
import axios from "axios";
import { FirebaseService } from "../FirebaseServices";

export const OrderService = {
  async fetchOrders(userId: string): Promise<OrdersData[]> {
    return FirebaseService.getAllDocuments(`users/${userId}/orders`) as Promise<
      OrdersData[]
    >;
  },

  async addOrder(userId: string, orderData: any) {
    const orderRefId = await FirebaseService.addDocument(
      `users/${userId}/orders`,
      orderData
    );
    const allOrderRefId = await FirebaseService.addDocument(`allOrders`, {
      ...orderData,
      orderId: orderRefId,
    });
    return { orderRefId, allOrderRefId };
  },

  async updateAddressWithBottles(
    userId: string,
    addressId: string,
    rentCount: number
  ) {
    await FirebaseService.updateDocument(
      `users/${userId}/addresses`,
      addressId,
      { numberOfBottles: rentCount || 0 }
    );
  },

  async updateOrderWithInvoice(
    orderId: string,
    allOrderId: string,
    userId: string,
    invoiceNumber: string
  ) {
    await FirebaseService.updateDocument(`users/${userId}/orders`, orderId, {
      invoiceNumber,
    });
    await FirebaseService.updateDocument(`allOrders`, allOrderId, {
      invoiceNumber,
    });
  },

  async createPayment(
    amount: number,
    phoneNumber: string | undefined,
    dataAndTime: string
  ) {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "EUR",
        description: `Delaqua Water delivery for ${phoneNumber}, ordered for ${dataAndTime}`,
      }),
    });

    return response.json();
  },

  async updateOrderPaymentData(
    userId: string,
    orderIdFromDB: string,
    currentAllOrderId: string,
    paymentData: {
      paymentId: string;
      paymentLink: string;
      paymentMethod: "Online";
    }
  ) {
    await FirebaseService.updateDocument(
      `users/${userId}/orders`,
      orderIdFromDB,
      paymentData
    );

    await FirebaseService.updateDocument(
      `allOrders`,
      currentAllOrderId,
      paymentData
    );
  },

  async sendPaymentDataToSheet(
    userPhone: string,
    amount: number,
    orderId: string,
    dataAndTime: string
  ) {
    await axios.post(
      process.env.NEXT_PUBLIC_PAYMENT_SHEET_LINK as string,
      {
        userPhone,
        amount: `${amount}€`,
        orderId,
        description: `date:${dataAndTime}, number: ${userPhone}`,
      },
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  },

  async sendOrderDataToSheet(orderData: any) {
    await axios.post(
      process.env.NEXT_PUBLIC_PAYMENT_SHEET_LINK as string,
      orderData,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  },

  async setPaymentLinkForOrder(
    totalPayments: number,
    phoneNumber: string,
    dataAndTime: string,
    orderId: string,

    allOrderId: string,
    userId: string,
    setPaymentUrl: (url: string) => void
  ) {
    await getAndSetPaymentLink(
      totalPayments,
      phoneNumber,
      dataAndTime,
      orderId,
      allOrderId,
      userId,
      setPaymentUrl
    );
  },

  async updateEditedOrder(orderData: any) {
    await FirebaseService.updateDocument(`allOrders`, orderData.id, orderData);
  },
};
