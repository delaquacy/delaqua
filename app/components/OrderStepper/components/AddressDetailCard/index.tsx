import { useToast } from "@/app/hooks";
import { Address } from "@/app/types";
import {
  AccountCircleOutlined,
  ApartmentOutlined,
  Delete,
  HouseOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalRemoveAddress } from "../ModalRemoveAddress";
import { CardBlockRow, CardWrapper, RemoveButtonWrapper } from "./styled";

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
  const [openTransferForm, setOpenTransferForm] = useState(false);
  const { showSuccessToast } = useToast();

  const handleRemove = (transfer: boolean) => {
    if (!transfer) return;

    onTransfer().then(() => showSuccessToast(t("transferSuccessful")));
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
    <CardWrapper>
      <CardBlockRow
        sx={{
          flex: 2,
        }}
      >
        <AccountCircleOutlined />
        <Typography>{address.firstAndLast}</Typography>
      </CardBlockRow>

      <CardBlockRow
        sx={{
          flex: 3,
        }}
      >
        <PlaceOutlined />
        <Link href={address.geolocation || "/"}>
          <Typography textAlign={"left"} sx={{ color: "#1976d2" }}>
            {`${address.postalIndex}, ${address.deliveryAddress}, ${address.addressDetails}`}
          </Typography>
        </Link>
      </CardBlockRow>

      <CardBlockRow
        sx={{
          flex: 1,
        }}
      >
        <Tooltip title={t("number_of_bottles")}>
          <Image
            src={selected ? "/recycleWater.svg" : "/recycleWaterGray.svg"}
            height={25}
            width={25}
            alt="recycleWater"
          />
        </Tooltip>
        <Typography>{address.numberOfBottles || 0}</Typography>
      </CardBlockRow>

      <CardBlockRow
        sx={{
          flex: 1,
        }}
      >
        {!address.addressType || address.addressType === "Home" ? (
          <HouseOutlined />
        ) : (
          <ApartmentOutlined />
        )}
        <Typography>
          {t(address.addressType?.toLowerCase() || "home")}
        </Typography>
      </CardBlockRow>

      {canBeRemoved ? (
        <Tooltip
          title={"Remove this address"}
          onClick={(event) => {
            event.stopPropagation();
            askUserAboutTransfer();
          }}
        >
          <RemoveButtonWrapper>
            <Delete
              sx={{
                color: "gray",
              }}
            />
          </RemoveButtonWrapper>
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
    </CardWrapper>
  );
};
