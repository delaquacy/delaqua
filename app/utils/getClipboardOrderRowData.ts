import { OrdersData } from "../types";

export const getClipboardOrderRowData = (row: OrdersData) =>
  `${row.userId || row.useId}\t ${row.phoneNumber}\t  ${row.firstAndLast}\t ${
    row.bottlesNumberToBuy
  }\t ${row.bottlesNumberToReturn}\t ${row.pump}\t ${row.deliveryDate}\t ${
    row.postalIndex
  }\t ${row.deliveryAddress}\t ${(row.addressDetails as string).replace(
    "\n",
    ""
  )}\t ${row.geolocation}\t ${row.deliveryTime}\t ${(
    row.comments as string
  ).replace("\n", "")}\t ${row.totalPayments}\t ${row.paymentMethod} - ${
    row.paymentStatus
  }\t
`;
