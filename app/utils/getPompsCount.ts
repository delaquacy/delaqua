import { POMP_CODES_MAX } from "../constants/pompMaxCode";
import { UserOrderItem } from "../types";

export const getPompsCount = (items?: UserOrderItem[]) => {
  return (
    items &&
    items.reduce(
      (acc: string, item: UserOrderItem) =>
        +item.itemCode <= +POMP_CODES_MAX && +item.count
          ? acc + ` ${item.itemCode}(${item.count})`
          : acc,
      ""
    )
  );
};
