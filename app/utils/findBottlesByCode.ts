import { CombinedItem, Goods, UserOrderItem } from "../types";

const BOTTLE_CODES = {
  bigBottle: 119,
  bigBottleRent: 120,
  middleBottle: 115,
  smallBottle: 110,
};

export const findBottlesByCode = (
  items: UserOrderItem[] | Goods[] | undefined
) => {
  if (!items) return {};

  return Object.entries(BOTTLE_CODES).reduce((acc, [key, code]) => {
    const foundItem = items.find((item) => +item.itemCode === code);
    if (foundItem) {
      acc[key] = foundItem;
    }
    return acc;
  }, {} as Record<string, UserOrderItem | Goods | CombinedItem>);
};
