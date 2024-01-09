"use client";
import { Box, Container, Grid, Paper } from "@mui/material";
import OrderTable from "../components/table/OrderTable";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import styles from "./page.module.css";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/config";
import { useEffect, useState } from "react";
import { IForm } from "../lib/definitions";
export default function Page() {
  const orders = [
    { id: 1, date: "2023-12-01", quantity: 3, paymentMethod: "Cash" },
    { id: 2, date: "2023-12-05", quantity: 5, paymentMethod: "Card" },
  ];
  const [userOrders, setUserOrders] = useState<IForm[] | []>([]);

  useEffect(() => {
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
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  console.log(userOrders);
  return (
    <Container className={styles.container}>
      <h1>Information about you</h1>
      <Grid container spacing={4}>
        <Grid className={styles.gridContainer} item xs={12} md={6}>
          <article>
            <p className={styles.infoTitle}>Total number of orders</p>
            <div className={styles.iconAndCount}>
              <FactCheckOutlinedIcon fontSize="large" />
              <span>{`${orders.length}`}</span>
            </div>
          </article>
        </Grid>
        <Grid className={styles.gridContainer} item xs={12} md={6}>
          <article>
            <p className={styles.infoTitle}>
              Number of bottles available
            </p>
            <div className={styles.iconAndCount}>
              <LocalDrinkOutlinedIcon fontSize="large" />
              <span>4</span>
            </div>
          </article>
        </Grid>
      </Grid>
      <section className={styles.tableSection}>
        <h2>Your previos orders</h2>
        <Box className={styles.table}>
          <OrderTable orders={orders} />
        </Box>
      </section>
    </Container>
  );
}
