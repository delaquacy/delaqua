"use client";

import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { getUnpaidOrders } from "../utils/getUnpaidOrders";
import { adminCheck } from "../utils";
import { OrdersData } from "../components/OrdersTable";

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
