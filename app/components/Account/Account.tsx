"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container } from "@mui/material";
import styles from "./Account.module.css";
import MyForm from "../MyForm/MyForm";
import { useRouter } from "next/navigation";
import InfoModal from "../InfoModal/InfoModal";

export default function Account() {
  const route = useRouter();
  const auth = getAuth();
  const [showModal, setShowModal] = useState(true);
  const handleCloseModal = () => {
    setShowModal(false);
  };

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
      {showModal && <InfoModal onClose={handleCloseModal} />}
      <MyForm />
    </Container>
  );
}
