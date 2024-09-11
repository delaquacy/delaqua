import { OrderService } from "@/app/lib/OrderService";
import { deliveryValidation } from "@/app/utils";
import dayjs from "dayjs";
import { getAndSetPaymentLink } from "./getAndSetPaymentLink";
import { postInvoicesData } from "./postInvoiceData";

export const processOrder = async (
  userData: any,
  userOrder: any,
  orderData: any,
  setPaymentUrl: (url: string) => void,
  handleNext: () => void,
  showErrorToast: (message: string) => void
) => {
  const { isCurrentDayAfterTen, isCurrentDayAfterNoon } = deliveryValidation(
    dayjs()
  );

  if (
    isCurrentDayAfterTen &&
    orderData.deliveryDate === dayjs().format("DD.MM.YYYY") &&
    orderData.deliveryTime === "9-12"
  ) {
    showErrorToast("Please, change the delivery time");
    return;
  }

  if (
    isCurrentDayAfterNoon &&
    orderData.deliveryDate === dayjs().format("DD.MM.YYYY") &&
    orderData.deliveryTime === "9-17"
  ) {
    showErrorToast("Please, change the delivery date");
    return;
  }

  const rentCount = orderData.items.find(
    ({ itemCode }: { itemCode: string }) => +itemCode === 120
  )?.count;

  if (orderData.paymentMethod === "Cash") {
    orderData.paymentStatus = "CASH";
  }

  const { orderRefId, allOrderRefId } = await OrderService.addOrder(
    userData.userId,
    orderData
  );

  if (rentCount) {
    await OrderService.updateAddressWithBottles(
      userData.userId,
      userOrder.deliveryAddressObj.id,
      (+orderData.deliveryAddressObj.numberOfBottles || 0) + +rentCount
    );
  }

  await OrderService.sendOrderDataToSheet(orderData);

  const invoiceNumber = await postInvoicesData(
    orderData,
    orderRefId,
    allOrderRefId
  );

  await OrderService.updateOrderWithInvoice(
    orderRefId,
    allOrderRefId,
    userData.userId,
    invoiceNumber as string
  );

  if (orderData.paymentMethod === "Online") {
    await getAndSetPaymentLink(
      +userOrder.totalPayments,
      userOrder.phoneNumber,
      `${userOrder.deliveryDate}, ${userOrder.deliveryTime}`,
      orderRefId,
      allOrderRefId,
      userData.userId,
      setPaymentUrl
    );
  }

  handleNext();

  return invoiceNumber;
};
