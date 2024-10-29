"use client";

import dayjs from "dayjs";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { GoodsValues } from "../components/GoodsIncomingForm";
import { useToast } from "../hooks";
import { FirebaseService } from "../lib/FirebaseServices";
import { GoodService } from "../lib/GoodService";
import { FilterItem, Goods } from "../types";
import { getFilteredOrders } from "../utils";
import { getCalculatedGoods } from "../utils/getCalculatedGoods";
import { useOrdersTableContext } from "./OrdersTableContext";

export interface GoodsAvailable {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

interface StatsProps {
  sold: GoodsAvailable[];
  received: GoodsAvailable[];
}

interface GoodsContextType {
  invoices: GoodsValues[];
  filter: FilterItem;
  inventoryGoods: GoodsAvailable[];
  stats: StatsProps;
  openDeleteWindow: boolean;
  goods: Goods[];
  handleFilterFieldsChange: (
    id: string,
    filterProp: string,
    event: any,
    val?: string
  ) => void;
  setOpenDeleteWindow: Dispatch<SetStateAction<boolean>>;
  setApplyGoodsCalculationFilter: Dispatch<SetStateAction<boolean>>;
  handleRemoveGoodsInventoryItem: (documentId: string) => void;
}

export const GoodsContext = React.createContext<GoodsContextType>({
  invoices: [],
  inventoryGoods: [],
  goods: [],
  filter: {
    id: "1",
    column: "Delivery Date",
    operator: "",
    value1: dayjs() as any,
    value2: dayjs() as any,
  },
  stats: {
    sold: [],
    received: [],
  },
  openDeleteWindow: false,
  handleFilterFieldsChange: () => {},
  setOpenDeleteWindow: () => {},
  setApplyGoodsCalculationFilter: () => {},
  handleRemoveGoodsInventoryItem: () => {},
});

type GoodsProviderProps = {
  children: ReactNode;
};

export const GoodsProvider = ({ children }: GoodsProviderProps) => {
  const { rows } = useOrdersTableContext();
  const { showSuccessToast, showErrorToast } = useToast();

  const [goods, setGoods] = useState<Goods[]>([]);
  const [inventoryGoods, setInventoryGoods] = useState<GoodsAvailable[]>([]);
  const [invoices, setInvoices] = useState<GoodsValues[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<GoodsValues[]>([]);
  const [openDeleteWindow, setOpenDeleteWindow] = useState(false);
  const [applyGoodsCalculationFilter, setApplyGoodsCalculationFilter] =
    useState(true);

  const [filter, setFilter] = useState<FilterItem>({
    id: "1",
    column: "Delivery Date",
    operator: "",
    value1: dayjs() as any,
    value2: dayjs() as any,
  });
  const [stats, setStats] = useState<StatsProps>({
    sold: [],
    received: [],
  });

  const handleFilterFieldsChange = (
    id: string,
    filterProp: string,
    event: any,
    val?: string
  ) => {
    setApplyGoodsCalculationFilter(false);
    setFilter((prev) => ({
      ...prev,
      [filterProp]: val,
    }));
  };

  const handleRemoveGoodsInventoryItem = async (documentId: string) => {
    await FirebaseService.deleteDocument("goodsInventory", documentId);
    await FirebaseService.deleteDocument("goods", documentId);

    setOpenDeleteWindow(false);
    showSuccessToast("Item successfully removed");
  };

  useEffect(() => {
    const unsubscribeInventoryGoods =
      GoodService.getGoodsInventoryArray(setInventoryGoods);
    const unsubscribeInvoices =
      GoodService.getGoodsIncomingInvoices(setInvoices);
    const unsubscribeGoods = GoodService.getGoods(setGoods);

    return () => {
      unsubscribeInventoryGoods();
      unsubscribeInvoices();
      unsubscribeGoods();
    };
  }, []);

  useEffect(() => {
    if (invoices && invoices.length > 0 && applyGoodsCalculationFilter) {
      const parseFormat = "DD-MM-YYYY";
      const startDate = filter?.value1;
      const endDate = filter?.value2;

      const filtered = invoices.filter(
        (invoice) =>
          dayjs(invoice?.date, parseFormat).isSameOrAfter(startDate, "day") &&
          dayjs(invoice?.date, parseFormat).isSameOrBefore(endDate, "day")
      );

      setFilteredInvoices(filtered);
    }
  }, [filter, invoices, applyGoodsCalculationFilter]);

  console.log(applyGoodsCalculationFilter, "app");

  useEffect(() => {
    if (
      inventoryGoods.length &&
      rows.length &&
      invoices &&
      applyGoodsCalculationFilter
    ) {
      const orders = getFilteredOrders([filter], rows);
      const sold = getCalculatedGoods(orders, inventoryGoods);
      const received = getCalculatedGoods(filteredInvoices, inventoryGoods);

      setStats({
        sold,
        received: received as GoodsAvailable[],
      });
    }
  }, [
    filter,
    rows,
    filteredInvoices,
    inventoryGoods,
    applyGoodsCalculationFilter,
  ]);

  return (
    <GoodsContext.Provider
      value={{
        inventoryGoods,
        invoices,
        filter,
        stats,
        openDeleteWindow,
        goods,
        setOpenDeleteWindow,
        handleFilterFieldsChange,
        handleRemoveGoodsInventoryItem,
        setApplyGoodsCalculationFilter,
      }}
    >
      {children}
    </GoodsContext.Provider>
  );
};

export const useGoodsContext = () => useContext(GoodsContext);
