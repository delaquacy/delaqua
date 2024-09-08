import dayjs from "dayjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";

export const addInvoiceNumberToOldOrder = async (
  data: OrdersData,
  orderId: string,
  userId: string
) => {
  const currentYear = dayjs(data.deliveryDate).format("YY");
  const lastInvoiceNumRef = doc(db, "oldInvoiceCounter/1");

  const orderRef = doc(db, `users/${userId}/orders/${orderId}`);

  const allOrdersRef = collection(db, "allOrders");
  const q = query(allOrdersRef, where("id", "==", data.id));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Order not found");
  }
  const allOrderId = querySnapshot.docs[0].id;
  const allOrderRef = doc(db, `users/${userId}/orders/${orderId}`);

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
    const invoiceNumber = `INV-${currentYear}-${currentCount}-AR`;

    const netVal = (data?.items || [])
      .reduce(
        (acc, item: any) => acc + (item?.net ? +item.count * +item?.net : 0),
        0
      )
      .toFixed(2);

    const vatVal = (data?.items || [])
      .reduce(
        (acc, item: any) => acc + (item.vat ? +item.count * +item.vat : 0),
        0
      )
      .toFixed(2);

    const preparedData = {
      clientId: data?.userId || data?.useId,
      clientName: data?.deliveryAddressObj?.firstAndLast || data?.firstAndLast,
      createdAt: data.createdAt,
      deliveryDate: data.deliveryDate,
      invoiceNumber: invoiceNumber,
      paymentStatus: data?.paymentStatus,
      phoneNumber: data?.phoneNumber,
      totalPayments: (+data?.totalPayments).toFixed(2),
      netVal,
      vatVal,
      orderId: orderId,
      allOrderId: allOrderId,
    };

    const invoiceRef = doc(db, `userInvoicesOld`, invoiceNumber);
    await setDoc(invoiceRef, preparedData);

    await updateDoc(lastInvoiceNumRef, {
      currentCount: newCount,
    });

    await updateDoc(orderRef, {
      invoiceNumber,
    });
    await updateDoc(allOrderRef, {
      invoiceNumber,
    });

    return invoiceNumber;
  } catch (error) {
    console.error("Error while work with invoice:", error);
  }
};
