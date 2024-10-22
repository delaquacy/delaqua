import dayjs from "dayjs";
import { FirebaseService } from "../lib/FirebaseServices";

export const addCommentToOrders = async (
  orderIds: string[],
  comment: string
) => {
  const updatePromises = orderIds.map((orderId) => {
    const updateData = {
      courierComment: comment,
      addCommentAt: dayjs().format("DD.MM.YYYY HH:mm"),
    };

    return FirebaseService.updateDocument("allOrders", orderId, updateData);
  });

  await Promise.all(updatePromises);
};
