import { Address } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import {
  AccountCircleOutlined,
  Delete,
  HomeOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface AddressDetailCardProps {
  address: Address;
}

export const AddressDetailCard = ({ address }: AddressDetailCardProps) => {
  const { t } = useTranslation("savedAddresses");
  const { isSmallScreen } = useScreenSize();
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        gap: "15px",
        padding: "20px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          flex: 1,
        }}
      >
        <Box display="flex" flexDirection="row" gap="10px">
          {/* <Typography>{t("name")}</Typography> */}
          <AccountCircleOutlined />
          <Typography>{address.firstAndLast}</Typography>
        </Box>

        <Box display="flex" flexDirection="row" gap="10px">
          {/* <Typography>{t("address")}</Typography> */}
          <HomeOutlined />
          <Typography>{`${address.postalIndex}, ${address.deliveryAddress}, ${address.addressDetails}`}</Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        sx={{
          flex: 1,
        }}
      >
        <Box display="flex" flexDirection="row" gap="10px">
          {/* <Typography>{t("geolocation")}</Typography> */}
          <PlaceOutlined />
          <Typography>
            <Link href={address.geolocation}>{address.geolocation}</Link>
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" gap="10px">
          <Typography>{t("number_of_bottles")}</Typography>
          <Typography>{address.numberOfBottles || 0}</Typography>
        </Box>{" "}
      </Box>

      <Tooltip title={"Remove this address"}>
        <Box
          sx={{
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "all 0.15s ",

            ":hover": {
              background: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <Delete
            sx={{
              color: "gray",
            }}
          />
        </Box>
      </Tooltip>
    </Box>
  );
};
