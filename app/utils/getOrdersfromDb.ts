import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, getCurrentUserId } from "../lib/config";
import { OrdersData } from "../types";

const useGetOrdersFromDb = () => {
  const [orders, setOrders] = useState<[] | OrdersData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await getCurrentUserId();

        if (userId) {
          const q = query(
            collection(db, `users/${userId}/orders`),
            orderBy("createdAt", "desc"),
            limit(5)
          );

          const querySnapshot = await getDocs(q);

          const ordersData: any = [];
          querySnapshot.forEach((doc) => {
            const orderId = doc.id;
            const orderData = doc.data();
            ordersData.push({ id: orderId, ...orderData });
          });

          setOrders(ordersData);
        } else {
          console.error("User not authenticated!");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading };
};

export default useGetOrdersFromDb;
