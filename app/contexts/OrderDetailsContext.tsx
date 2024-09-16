"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs, { Dayjs } from "dayjs";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import sessionService from "../lib/SessionService";
import { Goods } from "../types";
import {
  fetchAddresses,
  fetchOrders,
  fetchUserNumber,
  formatPhoneNumber,
} from "../utils";
import { getStaticGoodsArray } from "../utils/getStaticGoodsArray";
import { useUserContext } from "./UserContext";

export interface UserOrderItem {
  id: string;
  itemCode: string;
  name: string;
  sellPrice: string;
  count: string;
  sum: string;
  net?: string;
  vat?: string;
}

export interface UserOrder {
  id: string;
  items: UserOrderItem[];
  deliveryDate: Dayjs | string;
  deliveryTime: string;
  deliveryAddressObj: Address;
  phoneNumber: string;
  bottlesNumberToReturn: string;
  pump: string;
  createdAt: string;
  userId?: string;
  useId?: string;
  firstAndLast?: string;
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
  paymentUrl: string;
  loading: boolean;
  setPaymentUrl: (url: string) => void;
  setUserData: Dispatch<SetStateAction<UserData>>;
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
  userId: string;
  pomp: string;
}
export const OrderDetailsContext = createContext<OrderDetailsContextType>({
  goods: [],
  isFirstOrder: true,
  paymentUrl: "",
  loading: false,
  setPaymentUrl: () => {},
  setUserData: () => {},
  userData: {
    formattedUserPhone: "",
    userPhone: "",
    addresses: [],
    orders: [],
    numberOfBottlesInStock: "",
    userUniqId: "",
    pomp: "",
    userId: "",
  },
  userOrder: {
    id: "",
    items: [],
    deliveryDate: dayjs(),
    deliveryTime: "",
    deliveryAddressObj: {
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
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [userOrder, setUserOrder] = useState<UserOrder>(
    sessionService.getFormData() || {
      id: uuidv4(),
      items: [] as UserOrderItem[],
      deliveryDate: dayjs(),
      deliveryTime: "9-12",
      deliveryAddressObj: {
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
      paymentStatus: "Unpaid",
      paymentMethod: "",
      completed: false,
      canceled: false,
    }
  );

  const [userData, setUserData] = useState<UserData>({
    formattedUserPhone: null,
    userPhone: null,
    addresses: [],
    orders: [],
    numberOfBottlesInStock: "0",
    userUniqId: "0",
    pomp: "0",
    userId: "",
  });

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);

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
        userId,
      }));

      setUserOrder((prev) => ({
        ...prev,
        userId: userNumber,
      }));

      setIsFirstOrder(ordersData.length === 0);
      setLoading(false);

      return [addressesData, ordersData, userNumber];
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getGoods = async () => {
    try {
      const data = await getStaticGoodsArray();
      setGoods(data.map((item) => ({ ...item, picture: `${item.id}.webp` }))); // TODO: remove this when we will have correct picture link from storage
      if (userOrder.items.length) return;

      setUserOrder((prev) => ({
        ...prev,
        items: data.reverse().map((good) => ({
          id: good.id,
          itemCode: good.itemCode,
          name: good.name,
          sellPrice: good.sellPrice,
          net: good.netSaleWorth,
          vat: good.sellPriceVAT,
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

      setUserOrder((prev) => ({
        ...prev,
        phoneNumber: user?.phoneNumber || "",
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
        paymentUrl,
        loading,
        setPaymentUrl,
        setUserData,
        handleAddOrderDetails,
      }}
    >
      {children}
    </OrderDetailsContext.Provider>
  );
};

export const useOrderDetailsContext = () => useContext(OrderDetailsContext);
