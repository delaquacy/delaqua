"use client";
import { adminCheck } from "@/app/utils/adminCheck";
import {
  Box,
  CircularProgress,
  Container,
  Link,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/contexts/UserContext";
import { ShoppingCart, Inventory2 } from "@mui/icons-material";
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
    <MainContentWrapper admin>
      <Box alignSelf="center" fontSize="30px" fontWeight="900">
        Admins Panel
      </Box>
      <Box display="flex" flexDirection="column" gap="10px">
        <Link href="/admin_dashboard/orders">
          <MenuItem>
            <ListItemIcon>
              <ShoppingCart sx={{ color: "black" }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
              Orders
            </Typography>
          </MenuItem>
        </Link>
        <Link href="/admin_dashboard/goods">
          <MenuItem>
            <ListItemIcon>
              <Inventory2 sx={{ color: "black" }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
              Goods
            </Typography>
          </MenuItem>
        </Link>
      </Box>
    </MainContentWrapper>
  );
};

export default AdminDashboard;
