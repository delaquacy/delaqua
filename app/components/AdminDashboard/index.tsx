"use client";
import { adminCheck } from "@/app/utils/adminCheck";
import { CircularProgress, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrdersTable from "../OrdersTable";
import { useUserContext } from "@/app/contexts/UserContext";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      adminCheck(user.phoneNumber as string).then((res) => {
        !res && router.push("/");
      });
    }

    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px",
        }}
      >
        <CircularProgress size={100} />
      </Container>
    );
  }

  return (
    <>
      <OrdersTable />
    </>
  );
};

export default AdminDashboard;
