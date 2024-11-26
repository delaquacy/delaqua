import { useWriteOffGoodsContext } from "@/app/contexts/WriteOffGoodContext";
import { useToast } from "@/app/hooks";
import { GoodService } from "@/app/lib/GoodService";
import { WriteOffService } from "@/app/lib/WriteOffService";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { OrdersData, UserOrderItem } from "../types";

export interface FormValues {
  items: UserOrderItem[];
  createdAt: Dayjs;
}

export const useWriteGoodsOff = () => {
  const router = useRouter();
  const { goods, writeOffData, isLoading } = useWriteOffGoodsContext();
  const { showErrorToast, showSuccessToast } = useToast();

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      items: [],
      createdAt: dayjs(),
    },
  });

  const items = watch("items");

  const itemsDetails = items.map((item) => {
    const good = goods.find((good) => good.itemCode === item.itemCode);
    return { ...item, ...good };
  });

  const hasCount = itemsDetails.some((item) => +item.count);

  const onSubmit = async (data: FormValues) => {
    if (!hasCount) {
      showErrorToast("All item counts are empty");
      return;
    }

    const filteredItems = data.items.filter((item) => +item.count);

    await WriteOffService.addWriteOffDoc({
      ...writeOffData,
      ...data,
      items: filteredItems,
      createdAt: data.createdAt.format("DD-MM-YYYY HH:mm:ss"),
    });

    await GoodService.addOrderItemsToInventoryTable({
      items: filteredItems,
      createdAt: data.createdAt.format("DD-MM-YYYY HH:mm:ss"),
      invoiceNumber: `writeOff-${dayjs().format("DD-MM-YYYY HH:mm:ss")}`,
    } as OrdersData);

    showSuccessToast("The goods have been successfully written off");
    reset();
    router.push("/admin_dashboard/goods?tab=3");
  };

  useEffect(() => {
    reset({ items: writeOffData.items, createdAt: dayjs() });
  }, [writeOffData.items.length]);

  return {
    isLoading,
    goods,
    control,
    handleSubmit,
    onSubmit,
    hasCount,
    items,
  };
};
