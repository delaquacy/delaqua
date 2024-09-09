import { Address } from "@/app/contexts/OrderDetailsContext";
import { useToast } from "@/app/hooks";
import {
  AccountCircleOutlined,
  Delete,
  HomeOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
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
        <HomeOutlined />
        <Typography
          textAlign={"left"}
        >{`${address.postalIndex}, ${address.deliveryAddress}, ${address.addressDetails}`}</Typography>
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
          flex: 2,
        }}
      >
        <PlaceOutlined />
        <Typography
          sx={{
            textAlign: "left",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {address.geolocation}
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
