import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { calculateItemSumWithBigBottlePrice } from "@/app/utils/calculateItemSumWithBigBottlePrice";
import { findBottlesByCode } from "@/app/utils/findBottlesByCode";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CombinedItem, Goods, UserOrderItem } from "../types";

interface FormValues {
  items: UserOrderItem[];
  bottlesNumberToReturn: string;
}

export const useStoreStepLogic = (handleNext: () => void) => {
  const { goods, userOrder, isFirstOrder, userData, handleAddOrderDetails } =
    useOrderDetailsContext();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);

  const [suppliesError, setSuppliesError] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>(
    {
      defaultValues: {
        items: [],
        bottlesNumberToReturn: "0",
      },
    }
  );

  const items = watch("items");

  const itemsDetails = items.map((item) => {
    const good = goods.find((good) => good.itemCode === item.itemCode);
    return {
      ...item,
      ...good,
    };
  });

  const { bigBottle, bigBottleRent, middleBottle, smallBottle } =
    findBottlesByCode(itemsDetails) as Record<string, CombinedItem | undefined>;

  useEffect(() => {
    if (userOrder.items.length > 0) {
      const { bigBottle } = findBottlesByCode(userOrder.items) as Record<
        string,
        CombinedItem | undefined
      >;

      const bigBottleCount = !bigBottle?.available
        ? "0"
        : isFirstOrder
        ? "1"
        : userData.orders.length === 1
        ? "2"
        : (userData.orders[0].items as UserOrderItem[]).find(
            (item) => `${item.id}` === "119"
          )?.count || "0";

      reset({
        items: userOrder.items.map((item) =>
          `${item.id}` === "119"
            ? { ...bigBottle, count: bigBottleCount }
            : item
        ),
        bottlesNumberToReturn: userOrder.bottlesNumberToReturn,
      });
    }
  }, [userOrder.items]);

  useEffect(() => {
    const formattedData = itemsDetails
      .filter(({ id }) => id !== "120")
      .map((order) => calculateItemSumWithBigBottlePrice(order, isFirstOrder));

    const currentPrice = formattedData.reduce(
      (acc, item) => acc + +item.sum,
      0
    );

    const bigBottleCount = bigBottle?.count ? +bigBottle.count : 0;
    const middleBottleCount = middleBottle?.count ? +middleBottle.count : 0;
    const smallBottleCount = smallBottle?.count ? +smallBottle.count : 0;

    const hasBottles =
      !!bigBottleCount || !!middleBottleCount || !!smallBottleCount;

    const hasSupplies = !!(formattedData as (UserOrderItem & Goods)[]).filter(
      ({ category, count }) => category === "supplies" && !!+(count || "")
    ).length;

    const minOrder = isFirstOrder
      ? bigBottleCount >= 1
      : hasBottles && currentPrice >= 12;

    setSuppliesError(hasSupplies && !hasBottles);
    setShowTooltipMessage(!minOrder);
  }, [items, isFirstOrder, bigBottle, middleBottle, smallBottle]);

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    const formattedData = data.items.map((order) =>
      calculateItemSumWithBigBottlePrice(order, isFirstOrder)
    );

    handleAddOrderDetails({
      items: formattedData,
      bottlesNumberToReturn: data.bottlesNumberToReturn,
      totalPayments: formattedData.reduce((acc, item) => acc + +item.sum, 0),
    });

    handleNext();
  };

  return {
    control,
    watch,
    handleSubmit,
    onSubmit,
    showTooltipMessage,
    items,
    setValue,
    suppliesError,
    bigBottle,
    bigBottleRent,
    middleBottle,
    smallBottle,
    isFirstOrder,
    goods,
  };
};
