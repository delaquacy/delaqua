import { useGoodsContext } from "@/app/contexts/GoodsContext";
import { useToast } from "@/app/hooks";
import { GoodService } from "@/app/lib/GoodService";
import { Goods } from "@/app/types";
import { useMemo, useState } from "react";
import { GoodsAvailable } from "../components/GoodsAvailableTable";

export const useGoodsAvailableTable = () => {
  const {
    goods,
    inventoryGoods,
    openDeleteWindow,
    setOpenDeleteWindow,
    handleRemoveGoodsInventoryItem,
  } = useGoodsContext();

  const { showSuccessToast, showErrorToast } = useToast();

  const [displayDelete, setDisplayDelete] = useState(false);
  const [editGoodItem, setEditGoodItem] = useState<Goods | null>(null);
  const [itemDetails, setItemDetails] = useState({ details: "", id: "" });

  const originalGood = useMemo(
    () => goods.find(({ id }) => id === editGoodItem?.id),
    [goods, editGoodItem]
  );

  const isItemEdited = (originalItem: Goods | undefined, editedItem: Goods) => {
    if (!originalItem) return false;
    return Object.keys(editedItem).some(
      (key) =>
        editedItem[key as keyof Goods] !== originalItem[key as keyof Goods]
    );
  };

  const handleRemoveClick = (good: GoodsAvailable) => {
    setItemDetails({ details: `${good.id} - ${good.name}`, id: good.id });
    setOpenDeleteWindow(true);
  };

  const handleDeleteToggle = () => setDisplayDelete((prev) => !prev);

  const handleToggleAvailableEditGood = () => {
    setEditGoodItem((prev) => prev && { ...prev, available: !prev.available });
  };

  const handleUpdateGood = async () => {
    if (!editGoodItem) return;

    const hasChanges = isItemEdited(originalGood, editGoodItem);
    if (!hasChanges) {
      setEditGoodItem(null);
      return;
    }

    try {
      await GoodService.updateGood(editGoodItem);
      showSuccessToast(`${editGoodItem.name} updated successfully!`);
      setEditGoodItem(null);
    } catch (error) {
      console.error("Error updating good:", error);
      showErrorToast(`Error updating good: ${error}`);
    }
  };

  return {
    inventoryGoods,
    displayDelete,
    editGoodItem,
    itemDetails,
    openDeleteWindow,
    goods,
    handleRemoveClick,
    handleDeleteToggle,
    handleToggleAvailableEditGood,
    handleUpdateGood,
    setEditGoodItem,
    setOpenDeleteWindow,
    handleRemoveGoodsInventoryItem,
  };
};
