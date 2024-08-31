"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { adminCheck } from "@/app/utils/adminCheck";
import { Inventory2, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Container,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MainContentWrapper } from "../shared/styled";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { user } = useUserContext();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsLoading(false);
        router.push("/");
        return;
      }

      const isAdmin = await adminCheck(user?.phoneNumber as string);
      if (!isAdmin) {
        router.push("/");
      }
      setIsLoading(false);
    };

    checkAdmin();
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
    <MainContentWrapper admin={"true"}>
      <Box alignSelf="center" fontSize="30px" fontWeight="900">
        Admins Panel
      </Box>
      <Box display="flex" flexDirection="column" gap="10px">
        <MenuItem onClick={() => router.push("/admin_dashboard/orders")}>
          <ListItemIcon>
            <ShoppingCart sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            Orders
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => router.push("/admin_dashboard/goods")}>
          <ListItemIcon>
            <Inventory2 sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            Goods
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => router.push("/admin_dashboard/user_invoices")}>
          <ListItemIcon>
            <Inventory2 sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            User Invoices
          </Typography>
        </MenuItem>
      </Box>
    </MainContentWrapper>
  );
};

export default AdminDashboard;
