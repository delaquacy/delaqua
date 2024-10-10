"use client";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import { ShoppingBagOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const MyAccountMenu = () => {
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const router = useRouter();

  const { t } = useTranslation("main");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(750));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box>
        {isSmallScreen ? (
          <IconButton
            onClick={handleClick}
            sx={{
              width: "50px",
              height: "50px",
            }}
          >
            <ShoppingBagOutlined color="primary" fontSize="small" />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            endIcon={<ShoppingBagOutlined fontSize="small" />}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {t("order")}
          </Button>
        )}
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            router.push("/new_order");
            handleClose();
          }}
        >
          <Box>{t("newOrder")}</Box>
        </MenuItem>

        <MenuItem
          onClick={() => {
            router.push("/order_history");
            handleClose();
            trackAmplitudeEvent("myHistory", {
              text: "My history",
            });
          }}
        >
          <Box>{t("viewOrderHistory")}</Box>
        </MenuItem>

        <MenuItem
          onClick={() => {
            router.push("/return_bottles");
            handleClose();
          }}
        >
          <Box>{t("returnBottles")}</Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
