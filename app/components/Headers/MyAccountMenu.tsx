import { useScreenSize } from "@/app/hooks";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import {
  AccountCircle,
  Shop,
  ShoppingBag,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const MyAccountMenu = () => {
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const { i18n, t } = useTranslation("main");
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
            handleClose();
            trackAmplitudeEvent("myHistory", {
              text: "My history",
            });
          }}
        >
          <Link href="/order_history">{t("viewOrderHistory")}</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/new_order">{t("newOrder")}</Link>
        </MenuItem>
      </Menu>
    </Box>
  );
};
