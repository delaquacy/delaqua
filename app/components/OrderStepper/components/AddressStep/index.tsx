import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useToast } from "@/app/hooks";

import { MAX_ADDRESS_NUM } from "@/app/constants/AddressesNum";
import { getAddressTypeCount } from "@/app/utils/getAddressTypeCount";
import {
  Box,
  Button,
  CircularProgress,
  ToggleButton,
  Typography,
} from "@mui/material";
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
import { useRouter } from "next/navigation";
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
  phoneNumber?: string;
  addressDetails: string;
  deliveryAddress: string;
  geolocation: string;
  postalIndex: string;
  comments: string;
  createdAt: FieldValue;
  archived: boolean;
  numberOfBottles: string;
  addressType?: string;
  VAT_Num?: string;
}

export const ADDRESS_DEFAULT_VALUES = {
  firstAndLast: "",
  postalIndex: "",
  phoneNumber: "",
  deliveryAddress: "",
  geolocation: "",
  addressDetails: "",
  comments: "",
  createdAt: serverTimestamp(),
  archived: false,
  numberOfBottles: "",
  addressType: "Home",
  VAT_Num: "",
};

export const AddressStep = ({
  renderButtonsGroup,
  handleNext,
  returnBottles,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
  returnBottles?: boolean;
}) => {
  const { t } = useTranslation("form");

  const {
    userOrder,
    userData,
    loading,
    error,
    handleAddOrderDetails,
    setUserData,
  } = useOrderDetailsContext();

  const { showSuccessToast, showErrorToast } = useToast();
  const router = useRouter();

  const [showTooltipMessage, setShowTooltipMessage] = useState(
    !userOrder.deliveryAddressObj.id
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [disableReturnBottles, setDisableReturnBottles] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<FormValues | null>(
    userOrder.deliveryAddressObj
  );

  const addressCount = getAddressTypeCount(addresses);

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
    const id = await AddressesService.addNewAddress(
      userData.userId,
      newAddress
    );

    setAddresses((prev) => [{ id, ...newAddress }, ...prev]);
    setUserData((prev) => ({
      ...prev,
      addresses: [{ id, ...newAddress }, ...prev.addresses],
    }));

    showSuccessToast(`Add new address successfully`);
    setSelectedAddress({ id, ...newAddress });
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

  const handleReload = () => {
    router.refresh();
  };

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    const { id, ...restData } = data;

    handleAddOrderDetails({ deliveryAddressObj: data, ...restData });
    if (returnBottles) {
      handleAddOrderDetails({ bottlesNumberToReturn: data.numberOfBottles });
    }
    handleNext();
  };

  useEffect(() => {
    const addresses = returnBottles
      ? userData.addresses.filter((address) => address.numberOfBottles)
      : userData.addresses;

    const lastAddress = addresses[0];

    if (lastAddress) {
      setAddresses(addresses);

      setShowAddressForm(false);
    }

    if (!userOrder.deliveryAddressObj.id && lastAddress) {
      setSelectedAddress(lastAddress);
      handleSetNewValues(lastAddress);
      setShowAddressForm(false);
    }

    if (!!userData && !lastAddress && !returnBottles) {
      setShowAddressForm(true);
    }

    if (!!userData && !lastAddress && returnBottles) {
      setDisableReturnBottles(true);
    } else {
      setDisableReturnBottles(false);
    }
  }, [userData, userOrder, returnBottles]);

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          width: "100%",
          justifyContent: "top",
          marginTop: "30px",
          alignItems: "center",
        }}
      >
        <Typography align="center">{t("loading")}</Typography>
        <CircularProgress size={100} thickness={2} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          width: "100%",
          justifyContent: "top",
          marginTop: "30px",
          alignItems: "center",
        }}
      >
        <Typography align="center">{error}</Typography>
        <Button variant="contained" onClick={handleReload}>
          {t("reload")}
        </Button>
      </Box>
    );
  }

  if (disableReturnBottles) {
    return (
      <Box display="flex" flexDirection="column" gap="20px" marginInline="10px">
        {t("no_bottles_to_return")}
        <Button
          variant="contained"
          onClick={() => router.push("/new_order")}
          sx={{
            width: "300px",
          }}
        >
          {t("newOrder")}
        </Button>
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
            addressCount={addressCount}
            disableBack={addresses.length === 0}
          />
        </FormWrapper>
      ) : (
        <>
          <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
            {!returnBottles && (
              <FormHeaderWrapper>{t("deliveryAddress")}</FormHeaderWrapper>
            )}
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
            {!returnBottles && (
              <FormHeaderButton
                onClick={() => {
                  if (
                    addresses.length >=
                    MAX_ADDRESS_NUM.HOME + MAX_ADDRESS_NUM.BUSINESS
                  ) {
                    showErrorToast("You cant have more than 10 addresses");
                    return;
                  }
                  setShowAddressForm(true);
                }}
              >
                <AddLocationAltOutlined />
                {t("add_new_address")}
              </FormHeaderButton>
            )}
            {renderButtonsGroup(
              showTooltipMessage ? "Please select delivery address" : ""
            )}
          </FormWrapper>
        </>
      )}
    </>
  );
};
