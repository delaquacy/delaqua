"use client";

import dayjs from "dayjs";
import { User, getAuth } from "firebase/auth";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { adminCheck } from "../utils";

import { OrdersData } from "../types";
import { checkAndAddAllOrder } from "../utils/checkAndAddAllOrder";
import { fetchOrdersWithSpecificDate } from "../utils/fetchOrdersWithSpecificDate";
import { getAllUserOrders } from "../utils/getAllUserOrders";

const auth = getAuth();

const statusConditions = [
  "Unpaid",
  "ORDER_CANCELLED",
  "ORDER_PAYMENT_DECLINED",
  "ORDER_PAYMENT_FAILED",
];

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  orders: OrdersData[];
  loading: boolean;
  showWindow: boolean;
  showContinueText: boolean;
  unpaidOrders: OrdersData[];
  setUser: (user: User) => void;
  setOrders: Dispatch<SetStateAction<OrdersData[]>>;
  setShowWindow: (show: boolean) => void;
  setShowContinueText: (show: boolean) => void;
}

export const UserContext = React.createContext<UserContextType>({
  user: null,
  isAdmin: false,
  orders: [],
  unpaidOrders: [],
  loading: true,
  showWindow: true,
  showContinueText: true,
  setUser: () => {},
  setOrders: () => {},
  setShowWindow: () => {},
  setShowContinueText: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unpaidOrders, setUnpaidOrders] = useState<OrdersData[]>([]);
  const [orders, setOrders] = useState<OrdersData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [showContinueText, setShowContinueText] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setLoading(true);
        adminCheck(currentUser.phoneNumber as string).then((res) =>
          setIsAdmin(res as boolean)
        );

        const unsubscribeOrders = getAllUserOrders(
          currentUser?.uid as string,
          setOrders
        );

        setUser(currentUser);
        setLoading(false);

        return unsubscribeOrders;
      }
    });

    setLoading(false);

    return () => unsubscribe();
  }, []);

  //sync all data to allOrders collection
  useEffect(() => {
    const today = dayjs().format("D.M.YYYY");

    fetchOrdersWithSpecificDate(today).then((orders: any[]) => {
      const current = orders.filter((order) => {
        const [day, month, year] = order.deliveryDate
          .split(".")
          .map((num: any) => parseInt(num));

        const deliveryDate = dayjs(`${year}-${month}-${day}`);

        return deliveryDate.isSameOrAfter(
          dayjs(deliveryDate).format("YYYY-MM-DD"),
          "day"
        );
      });

      if (!current.length) return;

      current.forEach((order) => {
        checkAndAddAllOrder(order);
      });
    });
  }, []);

  useEffect(() => {
    const isStatusInConditions = (paymentStatus: string | string[]) => {
      if (typeof paymentStatus === "string") {
        return statusConditions.includes(paymentStatus);
      }
      if (Array.isArray(paymentStatus)) {
        return paymentStatus.some((status) =>
          statusConditions.includes(status)
        );
      }
      return false;
    };

    const unpaidOrders = orders.filter(
      (order) =>
        order.paymentMethod === "Online" &&
        !order.canceled &&
        !order.completed &&
        isStatusInConditions(order.paymentStatus)
    );

    setUnpaidOrders(unpaidOrders);
  }, [orders]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        unpaidOrders,
        orders,
        loading,
        showWindow,
        showContinueText,
        setShowWindow,
        setShowContinueText,
        setUser,
        setOrders,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);
