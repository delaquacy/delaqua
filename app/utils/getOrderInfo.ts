import { OrdersData } from "../types";

interface OrderStatusInfo {
  inDelivery: boolean;
  completed: boolean;
  canceled: boolean;
  isInProgress: boolean;
  tooltipTitle: string;
  paymentStatusText: string;
}

export const getOrderInfo = (
  row: OrdersData,
  t: Function,
  ns: string = "orderTable"
): OrderStatusInfo => {
  const inDelivery = row?.orderStatus === "In delivery";

  const completed = row?.orderStatus
    ? row?.orderStatus === "Delivered"
    : row?.completed;

  const canceled = row?.orderStatus
    ? ["Cancelled (client)", "Cancelled (admin)", "Cancelled"].includes(
        row?.orderStatus
      )
    : row?.canceled;

  const isInProgress = !inDelivery && !completed && !canceled;

  const tooltipTitle = completed
    ? "Delivered"
    : canceled && row?.orderStatus
    ? row?.orderStatus
    : canceled
    ? "Cancelled"
    : inDelivery
    ? "In Delivery"
    : "In Progress";

  const paymentStatusText = Array.isArray(row.paymentStatus)
    ? row.paymentStatus
        .map((status) =>
          t(`paymentStatuses.${status.toLowerCase().replace(/\s+/g, "_")}`, {
            ns,
          })
        )
        .join(", ")
    : typeof row.paymentStatus === "string"
    ? t(
        `paymentStatuses.${row.paymentStatus
          .toLowerCase()
          .replace(/\s+/g, "_")}`,
        { ns }
      )
    : t("paymentStatuses.unpaid", { ns });

  return {
    inDelivery,
    completed,
    canceled,
    isInProgress,
    tooltipTitle,
    paymentStatusText,
  };
};
