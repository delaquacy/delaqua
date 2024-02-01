import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, getCurrentUserId } from "../lib/config";

const getOrdersFromDb = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await getCurrentUserId();

        if (userId) {
          const q = collection(db, `users/${userId}/orders`);
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

export default getOrdersFromDb;
