"use client";

import dayjs from "dayjs";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { WriteOffService } from "../lib/WriteOffService";
import { Goods, UserOrderItem } from "../types";
import { getStaticGoodsArray } from "../utils/getStaticGoodsArray";

export interface WriteOffData {
  id: string;
  items: UserOrderItem[];
  createdAt: string;
}

interface WriteOffGoodsContextType {
  isLoading: boolean;
  writeOffData: WriteOffData;
  writeOffItems: WriteOffData[];
  goods: Goods[];
}

export const WriteOffGoodsContext = createContext<WriteOffGoodsContextType>({
  isLoading: true,
  writeOffData: {
    id: "",
    items: [],
    createdAt: "",
  },
  writeOffItems: [],
  goods: [],
});

type WriteOffGoodsProviderProps = {
  children: ReactNode;
};

export const WriteOffGoodsProvider = ({
  children,
}: WriteOffGoodsProviderProps) => {
  const [goods, setGoods] = useState<Goods[]>([]);
  const [writeOffItems, setWriteOffItems] = useState<WriteOffData[]>([]);
  const [defaultItems, setDefaultItems] = useState<UserOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [writeOffData, setWriteOffData] = useState({
    id: dayjs().format("DD-MM-YYYY-HH-mm-ss"),
    items: [] as UserOrderItem[],
    createdAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
  });

  const getGoods = async () => {
    setIsLoading(true);
    const data = await getStaticGoodsArray();

    setGoods(data.map((item) => ({ ...item, picture: `${item.id}.webp` })));

    const items = data.reverse().map((good) => ({
      id: good.id,
      itemCode: good.itemCode,
      name: good.name,
      sellPrice: good.sellPrice,
      net: good.netSaleWorth,
      vat: good.sellPriceVAT,
      count: "0",
      sum: "0",
    }));

    setDefaultItems(items);
    setWriteOffData((prev) => ({
      ...prev,
      items,
    }));
    setIsLoading(false);
  };

  useEffect(() => {
    getGoods();
  }, []);

  useEffect(() => {
    const unsubscribeWriteOffItems =
      WriteOffService.getWriteOffDataArray(setWriteOffItems);

    return () => {
      unsubscribeWriteOffItems();
    };
  }, []);

  return (
    <WriteOffGoodsContext.Provider
      value={{
        isLoading,
        writeOffData,
        writeOffItems,
        goods,
      }}
    >
      {children}
    </WriteOffGoodsContext.Provider>
  );
};

export const useWriteOffGoodsContext = () => useContext(WriteOffGoodsContext);
