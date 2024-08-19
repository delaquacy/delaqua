"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { v4 as uuidv4 } from "uuid";

import { getStaticGoodsArray } from "../utils/getStaticGoodsArray";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import {
  deliveryValidation,
  fetchAddresses,
  fetchOrders,
  fetchUserNumber,
  formatPhoneNumber,
  getSortedOrders,
} from "../utils";
import { useUserContext } from "./UserContext";
import { FieldValue, serverTimestamp } from "firebase/firestore";

export interface Goods {
  id: string;
  itemCode: string;
  name: string;
  picture: string;
  description: string;
  netBuyWorth: string;
  netSaleWorth: string;
  sellPrice: string;
  sellPriceVAT: string;
  taxRate: string;
  buyPrice: string;
  buyPriceVAT: string;
  category: "water" | "supplies";
}

export interface UserOrderItem {
  id: string;
  itemCode: string;
  name: string;
  sellPrice: string;
  count: string;
  sum: string;
}

export interface UserOrder {
  id: string;
  items: UserOrderItem[];
  deliveryDate: Dayjs;
  deliveryTime: string;
  deliveryAddress: Address;
  phoneNumber: string;
  bottlesNumberToReturn: string;
  pump: string;
  createdAt: string;
  userId: string;
  priceOfWater: string;
  depositForBottles: string;
  totalPayments: string;
  numberOfBottlesAtThisAddress: string;
  completed: boolean;
  paymentStatus: string;
  paymentMethod: string;
  canceled: boolean;
}

interface OrderDetailsContextType {
  goods: Goods[];
  userOrder: UserOrder;
  userData: UserData;
  isFirstOrder: boolean;
  handleAddOrderDetails: (newDetails: any) => void;
}

export interface Address {
  id: string;
  firstAndLast: string;
  addressDetails: string;
  archived: boolean;
  createdAt: FieldValue;
  deliveryAddress: string;
  geolocation: string;
  numberOfBottles: string;
  postalIndex: string;
  comments: string;
}
interface UserData {
  formattedUserPhone: string | null;
  userPhone: string | null;
  addresses: any[];
  orders: any;
  numberOfBottlesInStock: string;
  userUniqId: string;
  pomp: string;
}
export const OrderDetailsContext = createContext<OrderDetailsContextType>({
  goods: [],
  isFirstOrder: true,
  userData: {
    formattedUserPhone: "",
    userPhone: "",
    addresses: [],
    orders: [],
    numberOfBottlesInStock: "",
    userUniqId: "",
    pomp: "",
  },
  userOrder: {
    id: "",
    items: [],
    deliveryDate: dayjs(),
    deliveryTime: "",
    deliveryAddress: {
      id: "",
      firstAndLast: "",
      postalIndex: "",
      deliveryAddress: "",
      geolocation: "",
      addressDetails: "",
      comments: "",
      createdAt: serverTimestamp(),
      archived: false,
      numberOfBottles: "",
    },
    phoneNumber: "",
    bottlesNumberToReturn: "",
    pump: "",
    createdAt: "",
    userId: "",
    priceOfWater: "",
    depositForBottles: "",
    totalPayments: "",
    numberOfBottlesAtThisAddress: "",
    completed: false,
    paymentStatus: "",
    paymentMethod: "",
    canceled: false,
  },
  handleAddOrderDetails: () => {},
});

type OrderDetailsProviderProps = {
  children: ReactNode;
};
export const OrderDetailsProvider = ({
  children,
}: OrderDetailsProviderProps) => {
  const { user } = useUserContext();

  const [goods, setGoods] = useState<Goods[]>([]);
  const [isFirstOrder, setIsFirstOrder] = useState(true);
  const [userOrder, setUserOrder] = useState<UserOrder>({
    id: `${uuidv4()}`,
    items: [] as UserOrderItem[],
    deliveryDate: dayjs(),
    deliveryTime: "9-12",
    deliveryAddress: {
      id: "",
      firstAndLast: "",
      postalIndex: "",
      deliveryAddress: "",
      geolocation: "",
      addressDetails: "",
      comments: "",
      createdAt: serverTimestamp(),
      archived: false,
      numberOfBottles: "",
    },
    phoneNumber: "",
    bottlesNumberToReturn: "",
    pump: "",
    createdAt: "",
    userId: "",
    priceOfWater: "",
    depositForBottles: "",
    totalPayments: "",
    numberOfBottlesAtThisAddress: "",
    completed: false,
    paymentStatus: "",
    paymentMethod: "",
    canceled: false,
  });

  const [userData, setUserData] = useState<UserData>({
    formattedUserPhone: null,
    userPhone: null,
    addresses: [],
    orders: [],
    numberOfBottlesInStock: "0",
    userUniqId: "0",
    pomp: "0",
  });

  const fetchUserData = async (userId: string) => {
    try {
      const [addressesData, ordersData, userNumber] = await Promise.all([
        fetchAddresses(userId),
        fetchOrders(userId),
        fetchUserNumber(userId),
      ]);

      setUserData((prevData) => ({
        ...prevData,
        addresses: addressesData,
        orders: ordersData,
        userUniqId: userNumber,
      }));

      setIsFirstOrder(ordersData.length === 0);

      return [addressesData, ordersData, userNumber];
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getGoods = async () => {
    try {
      const data = await getStaticGoodsArray();
      setGoods(data.map((item) => ({ ...item, picture: `${item.id}.webp` }))); // TODO: remove this when we will have correct picture link
      setUserOrder((prev) => ({
        ...prev,
        items: data
          .filter((good) => good.id !== "120")
          .reverse()
          .map((good) => ({
            id: good.id,
            itemCode: good.itemCode,
            name: good.name,
            sellPrice: good.sellPrice,
            count: "0",
            sum: "0",
          })),
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAddOrderDetails = (newDetails: any) => {
    // newDetails it`s an object with userOrderProperty, for ex.: {items: []}
    setUserOrder((prev) => ({
      ...prev,
      ...newDetails,
    }));
  };

  useEffect(() => {
    if (user) {
      setUserData((prevData) => ({
        ...prevData,
        formattedUserPhone: formatPhoneNumber(user.phoneNumber!),
        userPhone: user.phoneNumber,
      }));

      user?.uid && fetchUserData(user?.uid);
      getGoods();
    }
  }, [user]);

  return (
    <OrderDetailsContext.Provider
      value={{
        goods,
        userOrder,
        userData,
        isFirstOrder,
        handleAddOrderDetails,
      }}
    >
      {children}
    </OrderDetailsContext.Provider>
  );
};

export const useOrderDetailsContext = () => useContext(OrderDetailsContext);
