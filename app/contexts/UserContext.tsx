"use client";

import { User, getAuth } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { getUnpaidOrders } from "../utils/getUnpaidOrders";
import { adminCheck } from "../utils";
import dayjs from "dayjs";

import { fetchOrdersWithSpecificDate } from "../utils/fetchOrdersWithSpecificDate";
import { checkAndAddAllOrder } from "../utils/checkAndAddAllOrder";
import { OrdersData } from "../types";
import { getAllUserOrders } from "../utils/getAllUserOrders";

const auth = getAuth();

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  orders: OrdersData[];
  unpaidOrders: OrdersData[];
  setUser: (user: User) => void;
}

export const UserContext = React.createContext<UserContextType>({
  user: null,
  isAdmin: false,
  orders: [],
  unpaidOrders: [],
  setUser: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unpaidOrders, setUnpaidOrders] = useState<OrdersData[]>([]);
  const [orders, setOrders] = useState<OrdersData[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        adminCheck(currentUser.phoneNumber as string).then((res) =>
          setIsAdmin(res as boolean)
        );

        getUnpaidOrders(currentUser?.uid as string).then(setUnpaidOrders);
        getAllUserOrders(currentUser?.uid as string).then(setOrders);
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  //sync all data to allOrders collection
  useEffect(() => {
    const today = dayjs().format("D.M.YYYY");
    // const today = "17.7.2024";

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

  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        unpaidOrders,
        orders,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);
