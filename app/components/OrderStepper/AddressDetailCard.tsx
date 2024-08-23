import { Address } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize, useToast } from "@/app/hooks";
import {
  AccountCircleOutlined,
  Delete,
  HomeOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalRemoveAddress } from "../ModalRemoveAddress/ModalRemoveAddress";
import Image from "next/image";

interface AddressDetailCardProps {
  address: Address;
  onRemove: (address: Address) => void;
  onTransfer: () => Promise<void>;
  canBeRemoved: boolean;
  selected: boolean;
}

export const AddressDetailCard = ({
  address,
  onRemove,
  onTransfer,
  canBeRemoved,
  selected,
}: AddressDetailCardProps) => {
  const { t } = useTranslation("savedAddresses");
  const { isSmallScreen } = useScreenSize();
  const [openTransferForm, setOpenTransferForm] = useState(false);
  const { showSuccessToast } = useToast();

  const handleRemove = (transfer: boolean) => {
    if (!transfer) return;

    onTransfer().then(() => showSuccessToast("Transfer successfully done"));
    onRemove(address);
  };

  const askUserAboutTransfer = () => {
    if (+address.numberOfBottles > 0) {
      setOpenTransferForm(true);
      return;
    }

    onRemove(address);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        gap: "20px",
        padding: "20px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap="10px"
        sx={{
          width: isSmallScreen ? "100%" : "45%",
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
          <Typography
            textAlign={"left"}
          >{`${address.postalIndex}, ${address.deliveryAddress}, ${address.addressDetails}`}</Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="10px"
        sx={{
          width: isSmallScreen ? "100%" : "45%",
        }}
      >
        <Box display="flex" flexDirection="row" gap="10px">
          <Tooltip title={t("number_of_bottles")}>
            <Image
              src={selected ? "/recycleWater.svg" : "/recycleWaterGray.svg"}
              height={25}
              width={25}
              alt="recycleWater"
            />
          </Tooltip>
          <Typography>{address.numberOfBottles || 0}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" gap="10px">
          <PlaceOutlined />
          <Typography
            sx={{
              textAlign: "left",
              wordBreak: "break-word", // Переносить довгі слова
              whiteSpace: "normal", // Дозволяє переноси тексту
            }}
          >
            {address.geolocation}
          </Typography>
        </Box>
      </Box>

      {canBeRemoved ? (
        <Tooltip
          title={"Remove this address"}
          onClick={(event) => {
            event.stopPropagation();
            askUserAboutTransfer();
          }}
        >
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
      ) : (
        <Box
          sx={{
            width: "35px",
            height: "35px",
          }}
        ></Box>
      )}

      <ModalRemoveAddress
        isOpen={openTransferForm}
        onClose={() => setOpenTransferForm(false)}
        onConfirm={handleRemove}
      />
    </Box>
  );
};
