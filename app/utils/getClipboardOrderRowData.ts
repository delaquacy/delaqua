import { CombinedItem, OrdersData, UserOrderItem } from "../types";
import { findBottlesByCode } from "./findBottlesByCode";

const POMP_CODES_MAX = 104;

export const getClipboardOrderRowData = (row: OrdersData) => {
  const { bigBottle, bigBottleRent, middleBottle, smallBottle } =
    findBottlesByCode(row?.items) as Record<string, CombinedItem | undefined>;

  const pomps =
    row?.items &&
    row?.items.reduce(
      (acc: string, item: UserOrderItem) =>
        +item.itemCode < +POMP_CODES_MAX ? `${acc} ${item.itemCode}` : acc,
      ""
    );

  return `${row.userId || row.useId}\t ${row.firstAndLast}\t  ${
    row.phoneNumber
  }\t ${bigBottle?.count || row.bottlesNumberToBuy}\t ${
    row.bottlesNumberToReturn
  }\t ${middleBottle?.count || "-"}\t ${
    smallBottle?.count || "-"
  }\t  ${pomps}\t ${row.deliveryDate}\t ${row.postalIndex}\t ${
    row.deliveryAddress
  }\t ${(row.addressDetails as string).replace("\n", "")}\t ${
    row.geolocation
  }\t ${row.deliveryTime}\t ${(row.comments as string).replace("\n", "")}\t ${
    row.totalPayments
  }\t ${row.paymentMethod} - ${row.paymentStatus}\t
`;
};
