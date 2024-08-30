import dayjs from "dayjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserOrder } from "../contexts/OrderDetailsContext";
import { db } from "../lib/config";

export const postInvoicesData = async (
  data: UserOrder,
  orderId: string,
  allOrderId: string
) => {
  const currentYear = dayjs().format("YY");
  const lastInvoiceNumRef = doc(db, "counter/1");

  try {
    const lastInvoiceNumDoc = await getDoc(lastInvoiceNumRef);

    if (!lastInvoiceNumDoc.exists()) {
      throw new Error("Document not found");
    }

    const docData = lastInvoiceNumDoc.data();

    if (typeof docData?.currentCount !== "number") {
      throw new Error("currentCount in not a number");
    }

    const currentCount = docData.currentCount;
    const newCount = currentCount + 1;
    const invoiceNumber = `INV-${currentYear}-${currentCount}`;

    const netVal = data.items.reduce(
      (acc, item) => acc + (item.net ? +item.count * +item.net : 0),
      0
    );
    const vatVal = data.items.reduce(
      (acc, item) => acc + (item.vat ? +item.count * +item.vat : 0),
      0
    );

    const preparedData = {
      clientId: data.userId,
      clientName: data.deliveryAddressObj.firstAndLast,
      createdAt: data.createdAt,
      deliveryDate: data.deliveryDate,
      invoiceNumber: invoiceNumber,
      paymentStatus: data.paymentStatus,
      phoneNumber: data.phoneNumber,
      totalPayments: data.totalPayments,
      netVal,
      vatVal,
      orderId: orderId,
      allOrderId: allOrderId,
    };

    console.log(data.userId, "IDDD");
    console.log(preparedData, "prep");

    const invoiceRef = doc(db, `userInvoices`, invoiceNumber);
    await setDoc(invoiceRef, preparedData);

    console.log(`Invoice added with ID: ${newCount}`);

    await updateDoc(lastInvoiceNumRef, {
      currentCount: newCount,
    });

    console.log(`Counter update: ${newCount}`);

    return invoiceNumber;
  } catch (error) {
    console.error("Error while work with invoice:", error);
  }
};
