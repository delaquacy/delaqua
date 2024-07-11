"use client";

import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { getUnpaidOrders } from "../utils/getUnpaidOrders";
import { adminCheck } from "../utils";
import { OrdersData } from "../components/OrdersTable";
import dayjs from "dayjs";

import { fetchOrdersWithSpecificDate } from "../utils/fetchOrdersWithSpecificDate";
import { checkAndAddAllOrder } from "../utils/checkAndAddAllOrder";

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  unpaidOrders: OrdersData[];
  setUser: (user: User) => void;
}

export const UserContext = React.createContext<UserContextType>({
  user: null,
  isAdmin: false,
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
  let order: any = [];

  const verifyAdmin = async (user: User) => {
    if (user) {
      const isAdmin = await adminCheck(user.phoneNumber as string);

      setIsAdmin(isAdmin);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    verifyAdmin(user);
    getUnpaidOrders(user?.uid as string).then(setUnpaidOrders);
  }, [user]);

  //sync all data to allOrders collection
  useEffect(() => {
    const today = dayjs().format("D.M.YYYY");

    fetchOrdersWithSpecificDate(today).then((orders: any[]) => {
      const current = orders.filter((order) => {
        const [day, month, year] = order.deliveryDate
          .split(".")
          .map((num: any) => parseInt(num));

        const deliveryDate = dayjs(`${year}-${month}-${day}`);

        return deliveryDate.isSameOrAfter(dayjs().format("YYYY-MM-DD"), "day");
      });

      console.log(`Orders with delivery date from ${today}:`, current);

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
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);
