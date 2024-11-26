"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { adminCheck } from "@/app/utils/adminCheck";
import {
  Announcement,
  EventBusy,
  Inventory2,
  ReceiptLong,
  ShoppingBasket,
  ShoppingCart,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Container,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { MainContentWrapper } from "../shared/styled";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { user } = useUserContext();

  useLayoutEffect(() => {
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
            <ReceiptLong sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            User Invoices
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => router.push("/admin_dashboard/create_order")}>
          <ListItemIcon>
            <ShoppingBasket sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            Create Order
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => router.push("/admin_dashboard/write_goods_off")}
        >
          <ListItemIcon>
            <ShoppingCartCheckout sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            Write off
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => router.push("/admin_dashboard/turn_off_the_day")}
        >
          <ListItemIcon>
            <EventBusy sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            Turn off the day
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() =>
            router.push("/admin_dashboard/announcement_management")
          }
        >
          <ListItemIcon>
            <Announcement sx={{ color: "black" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
            Announcement management
          </Typography>
        </MenuItem>
      </Box>
    </MainContentWrapper>
  );
};

export default AdminDashboard;
