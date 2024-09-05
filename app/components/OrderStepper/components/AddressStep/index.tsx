import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize, useToast } from "@/app/hooks";
import { Box, Skeleton, ToggleButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  AddLocationAltOutlined,
  WrongLocationOutlined,
} from "@mui/icons-material";
import { FieldValue, serverTimestamp } from "firebase/firestore";

import { ControllerInputField } from "@/app/components/shared";
import { AddressesService } from "@/app/lib/AddressesService";
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

export const ADDRESS_DEFAULT_VALUES = {
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

  const { userOrder, userData, loading, handleAddOrderDetails, setUserData } =
    useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast } = useToast();

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
      reset(ADDRESS_DEFAULT_VALUES);
      setShowTooltipMessage(true);
      return;
    }

    reset(newValues);
    setShowTooltipMessage(false);
  };

  const handleAddNewAddress = async (newAddress: FormValues) => {
    await AddressesService.addNewAddress(userData.userId, newAddress);

    setAddresses((prev) => [newAddress, ...prev]);
    setUserData((prev) => ({
      ...prev,
      addresses: [newAddress, ...prev.addresses],
    }));

    showSuccessToast(`Add new address successfully`);
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
  };

  const handleRemoveAddress = async (address: FormValues) => {
    if (!address?.id) return;

    if (selectedAddress?.id === address.id) {
      setSelectedAddress(null);
      handleSetNewValues(ADDRESS_DEFAULT_VALUES);
      setShowTooltipMessage(!null);
    }

    setAddresses((prev) => prev.filter(({ id }) => id !== address.id));

    setUserData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter(({ id }) => id !== address.id),
    }));

    await AddressesService.updateAddress(userData.userId, address?.id, {
      archived: true,
      numberOfBottles: 0,
    });
  };

  const handleTransferBottles = async (
    newAddressId: string,
    newNumberOfBottles: string
  ) => {
    AddressesService.transferBottles(
      userData.userId,
      newAddressId,
      newNumberOfBottles
    );

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

    if (!!userData && !lastAddress) {
      setShowAddressForm(true);
    }
  }, [userData, userOrder]);

  if (loading) {
    return (
      <Box>
        <Skeleton height="250px" />
      </Box>
    );
  }

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
            disableBack={addresses.length === 0}
          />
        </FormWrapper>
      ) : (
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
      )}
    </>
  );
};