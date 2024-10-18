import { FirebaseService } from "../lib/FirebaseServices";

export const updateOrderStatus = async (
  orderIds: string[],
  paymentStatus: string,
  orderStatus: string
) => {
  const updatePromises = orderIds.map((orderId) => {
    const updateData: { paymentStatus?: string; orderStatus?: string } = {};

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (orderStatus) {
      updateData.orderStatus = orderStatus;
    }

    return FirebaseService.updateDocument("allOrders", orderId, updateData);
  });

  await Promise.all(updatePromises);
};
