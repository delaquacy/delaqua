import { BIG_BOTTLE_PRICE } from "../constants/bigBottlePrise";
import { UserOrderItem } from "../types";

export const calculateItemSumWithBigBottlePrice = (
  order: UserOrderItem,
  isFirstOrder: boolean
): UserOrderItem => {
  const isBigBottle = +order.itemCode === 119;
  const isMoreThanOneBigBottle = isBigBottle && +order.count > 1;
  const isTenOrMoreBigBottle = isBigBottle && +order.count >= 10;

  const newSellPrice = !isMoreThanOneBigBottle
    ? BIG_BOTTLE_PRICE.FIRST_AND_ONE
    : isTenOrMoreBigBottle
    ? BIG_BOTTLE_PRICE.TEN_OR_MORE
    : BIG_BOTTLE_PRICE.DEFAULT;

  return {
    ...order,
    sellPrice: isBigBottle ? newSellPrice : order.sellPrice,
    sum: `${+order.count * +(isBigBottle ? newSellPrice : order.sellPrice)}`,
  };
};
