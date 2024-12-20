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

import dayjs, { Dayjs } from "dayjs";
import { usePathname } from "next/navigation";
import { NEW_ORDER } from "../constants/NewOrder";
import { GoodService } from "../lib/GoodService";
import { InfoManagementService } from "../lib/InfoManagementService";
import sessionService from "../lib/SessionService";
import { Address, Goods, OrdersData } from "../types";
import {
  fetchAddresses,
  fetchOrders,
  fetchUserNumber,
  formatPhoneNumber,
  getOrdersArray,
} from "../utils";
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

interface AdminAssignedUser {
  uid: string;
  phoneNumber: string;
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
  orderStatus?: string;
  paymentMethod: string;
  canceled: boolean;
}

interface OrderDetailsContextType {
  goods: Goods[];
  userOrder: UserOrder;
  userData: UserData;
  isFirstOrder: boolean;
  defaultItems: UserOrderItem[];
  paymentUrl: string;
  loading: boolean;
  error: string;
  allOrders: OrdersData[];
  adminCreateMode: boolean;
  disabledDates: string[];
  setPaymentUrl: (url: string) => void;
  setUserData: Dispatch<SetStateAction<UserData>>;
  setAdminCreateMode: Dispatch<SetStateAction<boolean>>;
  handleAddOrderDetails: (newDetails: any) => void;
  handleResetData: () => void;
  setAdminAssignedUser: Dispatch<
    SetStateAction<AdminAssignedUser | null | undefined>
  >;
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
  error: "",
  allOrders: [],
  adminCreateMode: false,
  defaultItems: [],
  disabledDates: [],
  setPaymentUrl: () => {},
  setUserData: () => {},
  setAdminCreateMode: () => {},
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
  userOrder: NEW_ORDER,
  handleAddOrderDetails: () => {},
  handleResetData: () => {},
  setAdminAssignedUser: () => {},
});

type OrderDetailsProviderProps = {
  children: ReactNode;
};
export const OrderDetailsProvider = ({
  children,
}: OrderDetailsProviderProps) => {
  const { user } = useUserContext();

  const pathname = usePathname();

  const [goods, setGoods] = useState<Goods[]>([]);
  const [defaultItems, setDefaultItems] = useState<UserOrderItem[]>([]);
  const [isFirstOrder, setIsFirstOrder] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allOrders, setAllOrders] = useState<OrdersData[]>([]);
  const [adminCreateMode, setAdminCreateMode] = useState(false);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  const [adminAssignedUser, setAdminAssignedUser] =
    useState<AdminAssignedUser | null>();

  const [userOrder, setUserOrder] = useState<UserOrder>(
    sessionService.getFormData() || NEW_ORDER
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

      const [ordersData, userNumber] = await Promise.all([
        fetchOrders(userId),
        fetchUserNumber(userId),
      ]);

      setUserData((prevData) => ({
        ...prevData,
        orders: ordersData,
        userUniqId: userNumber,
        userId,
      }));

      const unsubscribeAddresses = fetchAddresses(userId, (addressesData) => {
        setUserData((prevData) => ({
          ...prevData,
          addresses: addressesData,
        }));
      });

      setUserOrder((prev) => ({
        ...prev,
        userId: userNumber,
      }));

      setIsFirstOrder(ordersData.length === 0);
      setLoading(false);

      return unsubscribeAddresses;
    } catch (error) {
      setError(`Error fetching user data: ${error}`);
      setLoading(false);
      console.error("Error fetching user data:", error);
    }
  };

  const handleSetFormattedGoods = (data: Goods[]) => {
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
    setUserOrder((prev) => ({
      ...prev,
      items,
    }));

    setDefaultItems(items);
  };

  const handleAddOrderDetails = (newDetails: any) => {
    // newDetails it`s an object with userOrderProperty, for ex.: {items: []}
    setUserOrder((prev) => ({
      ...prev,
      ...newDetails,
    }));
  };

  const handleUpdateUserData = (user: AdminAssignedUser) => {
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
  };

  const handleResetData = () =>
    setUserOrder((prev) => ({
      ...prev,
      items: [] as UserOrderItem[],
      deliveryDate: dayjs(),
      deliveryTime: "9-12",
      bottlesNumberToReturn: "",
      pump: "",
      createdAt: "",
      priceOfWater: "",
      depositForBottles: "",
      totalPayments: "",
      numberOfBottlesAtThisAddress: "",
      paymentStatus: "Unpaid",
      paymentMethod: "",
      completed: false,
      canceled: false,
    }));

  useEffect(() => {
    if (user && !adminCreateMode) {
      handleUpdateUserData(user as AdminAssignedUser);
    }
  }, [user]);

  useEffect(() => {
    if (adminAssignedUser && adminCreateMode) {
      handleUpdateUserData(adminAssignedUser as AdminAssignedUser);
    }
  }, [adminAssignedUser]);

  useEffect(() => {
    const isAdminPage = pathname.includes("admin_dashboard");

    if (!isAdminPage) {
      setAdminCreateMode(false);
      setAdminAssignedUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    const unsubscribeOrdersArray = getOrdersArray((data) => {
      setAllOrders(data as OrdersData[]);
    });

    const unsubscribeGoods = GoodService.getGoods(handleSetFormattedGoods);

    return () => {
      unsubscribeOrdersArray();
      unsubscribeGoods();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = InfoManagementService.getAllDisabledDates((dates) => {
      setDisabledDates(dates);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <OrderDetailsContext.Provider
      value={{
        goods,
        userOrder,
        userData,
        isFirstOrder,
        paymentUrl,
        loading,
        error,
        allOrders,
        adminCreateMode,
        disabledDates,
        defaultItems,
        setPaymentUrl,
        setUserData,
        handleAddOrderDetails,
        setAdminAssignedUser,
        handleResetData,
        setAdminCreateMode,
      }}
    >
      {children}
    </OrderDetailsContext.Provider>
  );
};

export const useOrderDetailsContext = () => useContext(OrderDetailsContext);
