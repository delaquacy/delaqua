import dayjs from "dayjs";
import { FirebaseService } from "../lib/FirebaseServices";

interface UpdateData {
  paymentStatus?: string;
  paymentStatusUpdatedAt?: string;
  orderStatus?: string;
  orderStatusUpdatedAt?: string;
}

export const updateOrderStatus = async (
  orderIds: string[],
  paymentStatus: string,
  orderStatus: string
) => {
  const updatePromises = orderIds.map((orderId) => {
    const updateData: UpdateData = {};

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      updateData.paymentStatusUpdatedAt = dayjs().format("DD.MM.YYYY HH:mm");
    }

    if (orderStatus) {
      updateData.orderStatus = orderStatus;
      updateData.orderStatusUpdatedAt = dayjs().format("DD.MM.YYYY HH:mm");
    }

    return FirebaseService.updateDocument("allOrders", orderId, updateData);
  });

  await Promise.all(updatePromises);
};
