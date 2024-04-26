"use client";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container } from "@mui/material";
import styles from "./Account.module.css";
import MyForm from "../MyForm/MyForm";
import { useRouter } from "next/navigation";

export default function Account() {
  const route = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        route.push("/");
      }
    });

    return () => unsubscribe();
  }, [auth, route]);

  return (
    <Container className={styles.container}>
      <MyForm />
    </Container>
  );
}
