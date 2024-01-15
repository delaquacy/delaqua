"use client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/config";
import { IForm } from "../lib/definitions";

const useUserOrders = () => {
  const [userOrders, setUserOrders] = useState<IForm[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const userDoc = await getDoc(doc(db, "users", userId));

          if (userDoc.exists()) {
            const orderRefs = userDoc.data().orders || [];
            const orderIds = orderRefs.map(
              (orderRef: any) => orderRef.id
            );

            const ordersPromises = orderIds.map(
              async (orderId: string) => {
                try {
                  const orderDoc = await getDoc(
                    doc(db, "orders", orderId)
                  );
                  return orderDoc.data();
                } catch (error) {
                  console.error(
                    `Error fetching order with ID ${orderId}:`,
                    error
                  );
                  return null;
                }
              }
            );

            const userOrdersData = await Promise.all(ordersPromises);

            setUserOrders(
              userOrdersData.filter(
                (order: IForm | null) => order !== null
              )
            );
          } else {
            console.log("User not found in Firestore");
          }
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
      };
    };

    fetchUserOrders();
  }, []);

  return { userOrders, loading };
};

export default useUserOrders;
