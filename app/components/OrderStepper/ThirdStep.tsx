import {
  Box,
  Button,
  Card,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useScreenSize } from "@/app/hooks";

import { GoodsIncomingFormInputItem } from "../GoodsIncomingForm/GoodsIncomingFormInputItem";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";
import { AddressDetailCard } from "./AddressDetailCard";
import {
  AddLocationAltOutlined,
  WrongLocationOutlined,
} from "@mui/icons-material";
import {
  FieldValue,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AddNewAddressForm } from "./AddNewAddressForm";
import { ModalRemoveAddress } from "../ModalRemoveAddress/ModalRemoveAddress";
import { db } from "@/app/lib/config";

interface FormValues {
  id?: string;
  firstAndLast: string;
  addressDetails: string;
  deliveryAddress: string;
  geolocation: string;
  postalIndex: string;
  comments: string;
  createdAt: FieldValue;
  archived: boolean;
  numberOfBottles: string;
}

const DEFAULT_VALUES = {
  firstAndLast: "",
  postalIndex: "",
  deliveryAddress: "",
  geolocation: "",
  addressDetails: "",
  comments: "",
  createdAt: serverTimestamp(),
  archived: false,
  numberOfBottles: "",
};

export const ThirdStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t } = useTranslation("form");

  const { userOrder, userData, handleAddOrderDetails } =
    useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();

  const [showTooltipMessage, setShowTooltipMessage] = useState(
    !userOrder.deliveryAddress.id
  );
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<FormValues | null>(
    userOrder.deliveryAddress
  );

  console.log(addresses);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: userOrder.deliveryAddress,
  });

  const handleSetNewValues = (newValues: FormValues | null) => {
    if (!newValues) {
      reset({
        ...DEFAULT_VALUES,
      });
      setShowTooltipMessage(true);
      return;
    }

    reset({
      ...newValues,
    });
    setShowTooltipMessage(false);
  };

  const handleAddNewAddress = (newAddress: FormValues) => {
    if (addresses.find(({ id }) => id === newAddress.id)) return;

    setAddresses((prev) => [newAddress, ...prev]);
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
  };

  const handleRemoveAddress = (address: FormValues) => {
    if (selectedAddress?.id === address.id) {
      setSelectedAddress(null);
      handleSetNewValues(DEFAULT_VALUES);
      setShowTooltipMessage(!null);
    }
    setAddresses((prev) => prev.filter(({ id }) => id !== address.id));
  };

  const handleTransferBottles = async (
    addressId: string,
    newAddressId: string,
    newNumberOfBottles: string
  ) => {
    const addressRef = doc(
      db,
      `users/${userData.userId}/addresses/${addressId}`
    );

    const newAddressRef = doc(
      db,
      `users/${userData.userId}/addresses/${newAddressId}`
    );

    const newAddressDoc = await getDoc(newAddressRef);
    const newAddressBottles = newAddressDoc.data()?.numberOfBottles || "0";

    await updateDoc(addressRef, {
      archived: true,
      numberOfBottles: 0,
    });

    await updateDoc(newAddressRef, {
      numberOfBottles: `${+newAddressBottles + +newNumberOfBottles}`,
    });

    setAddresses((prev) =>
      prev.map(
        (item) =>
          item.id === newAddressId && {
            ...item,
            numberOfBottles: +item.numberOfBottles + +newNumberOfBottles,
          }
      )
    );
  };

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    handleAddOrderDetails({ deliveryAddress: data });
    handleNext();
  };

  useEffect(() => {
    const lastAddress = userData.addresses[0];

    if (lastAddress) {
      setAddresses(userData.addresses);
      setShowAddressForm(false);
    }

    if (!userOrder.deliveryAddress.id && lastAddress) {
      setSelectedAddress(lastAddress);
      handleSetNewValues(lastAddress);
      setShowAddressForm(false);
    }
  }, [userData, userOrder]);

  return (
    <Card
      sx={{
        padding: "20px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      {showAddressForm ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {addresses.length > 0 ? (
              <>
                {t("address")}
                <Button
                  onClick={() => setShowAddressForm(false)}
                  sx={{
                    textTransform: "none",
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <WrongLocationOutlined />
                  {t("returnToAddressList")}
                </Button>
              </>
            ) : (
              <>{t("address")}</>
            )}
          </Box>
          <AddNewAddressForm
            onAdd={handleAddNewAddress}
            onBack={() => setShowAddressForm(false)}
            userId={userData.userId}
            disableBack={addresses.length === 0}
          />
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {t("deliveryAddress")}
              <Button
                onClick={() => setShowAddressForm(true)}
                sx={{
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                }}
              >
                <AddLocationAltOutlined />
                {t("add_new_address")}
              </Button>
            </Box>

            <ToggleButtonGroup
              orientation="vertical"
              sx={{
                "& .Mui-selected": {
                  backgroundColor: "rgba(25,118,210, 0.2) !important",
                  ":hover": {
                    backgroundColor: "rgba(25,118,210, 0.2) !important",
                  },
                },
              }}
              value={
                addresses.find(({ id }) => id === selectedAddress?.id) || null
              }
              exclusive
              onChange={(e, newVal) => {
                setSelectedAddress(newVal);
                handleSetNewValues(newVal);
                setShowTooltipMessage(!newVal);
              }}
            >
              {addresses.map((address, index) => (
                <ToggleButton
                  key={address.id}
                  value={address}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                  }}
                >
                  <AddressDetailCard
                    onRemove={handleRemoveAddress}
                    onTransfer={() =>
                      handleTransferBottles(
                        address.id,
                        addresses.filter(({ id }) => id !== address.id)[0].id,
                        address.numberOfBottles
                      )
                    }
                    canBeRemoved={addresses.length > 1}
                    address={address}
                    key={index}
                  />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <GoodsIncomingFormInputItem
              name={"comments"}
              type="string"
              control={control}
              label={`${t("comments")}`}
              error={false}
              helperText={t("comments_placeholder")}
              multiline
              sx={{
                flex: 1,
              }}
            />
          </Box>
          {renderButtonsGroup(
            showTooltipMessage ? "Please select delivery address" : ""
          )}
        </form>
      )}
    </Card>
  );
};
