import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { Box, ToggleButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { db } from "@/app/lib/config";
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

import { ControllerInputField } from "@/app/components/shared";
import { AddNewAddress } from "../AddNewAddress";
import { AddressDetailCard } from "../AddressDetailCard";
import {
  FormHeaderButton,
  FormHeaderWrapper,
  FormWrapper,
  ToggleButtonGroupWrap,
} from "./styled";

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

export const AddressStep = ({
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
    !userOrder.deliveryAddressObj.id
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<FormValues | null>(
    userOrder.deliveryAddressObj
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: userOrder.deliveryAddressObj,
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

    const { id, ...restData } = data;

    handleAddOrderDetails({ deliveryAddressObj: data, ...restData });
    handleNext();
  };

  useEffect(() => {
    const lastAddress = userData.addresses[0];

    if (lastAddress) {
      setAddresses(userData.addresses);
      setShowAddressForm(false);
    }

    if (!userOrder.deliveryAddressObj.id && lastAddress) {
      setSelectedAddress(lastAddress);
      handleSetNewValues(lastAddress);
      setShowAddressForm(false);
    }

    if (userData && !lastAddress) {
      setShowAddressForm(true);
    }
  }, [userData, userOrder]);

  return (
    <>
      {showAddressForm ? (
        <FormWrapper>
          <FormHeaderWrapper>
            {addresses.length > 0 ? (
              <>
                {t("address")}

                <FormHeaderButton onClick={() => setShowAddressForm(false)}>
                  <WrongLocationOutlined />
                  {t("returnToAddressList")}
                </FormHeaderButton>
              </>
            ) : (
              <>{t("address")}</>
            )}
          </FormHeaderWrapper>

          <AddNewAddress
            onAdd={handleAddNewAddress}
            onBack={() => setShowAddressForm(false)}
            userId={userData.userId}
            disableBack={addresses.length === 0}
          />
        </FormWrapper>
      ) : userData?.addresses?.at(-1) ? (
        <>
          <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <FormHeaderWrapper>{t("deliveryAddress")}</FormHeaderWrapper>
            <ToggleButtonGroupWrap
              orientation="vertical"
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
                    padding: "7px",
                    width: "100%",
                    textTransform: "none",
                  }}
                >
                  <AddressDetailCard
                    onRemove={handleRemoveAddress}
                    selected={selectedAddress?.id === address.id}
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
            </ToggleButtonGroupWrap>
            <ControllerInputField
              name={"comments"}
              type="string"
              control={control}
              label={`${t("comments")}`}
              error={false}
              helperText={`*${t("comments_placeholder")}`}
              multiline
              sx={{
                flex: 1,
              }}
            />
            <FormHeaderButton onClick={() => setShowAddressForm(true)}>
              <AddLocationAltOutlined />
              {t("add_new_address")}
            </FormHeaderButton>
            {renderButtonsGroup(
              showTooltipMessage ? "Please select delivery address" : ""
            )}
          </FormWrapper>
        </>
      ) : (
        <Box></Box>
      )}
    </>
  );
};
