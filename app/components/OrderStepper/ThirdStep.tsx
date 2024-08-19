import {
  Box,
  Card,
  FormHelperText,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useScreenSize } from "@/app/hooks";

import { GoodsIncomingFormInputItem } from "../GoodsIncomingForm/GoodsIncomingFormInputItem";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";
import { AddressDetailCard } from "./AddressDetailCard";
import {
  AddLocationAltOutlined,
  WrongLocationOutlined,
} from "@mui/icons-material";
import { FieldValue, serverTimestamp } from "firebase/firestore";

interface FormValues {
  id: string;
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
  id: "",
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

  const theme = useTheme();
  const { userOrder, userData, handleAddOrderDetails } =
    useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();

  const [showTooltipMessage, setShowTooltipMessage] = useState(
    !userOrder.deliveryAddress.id
  );
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState(
    userOrder.deliveryAddress
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: userOrder.deliveryAddress,
    resolver: yupResolver(validationSchema as any),
  });

  const handleSetNewValues = (newValues: FormValues) => {
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

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;
    console.log(data?.postalIndex, "data from form");

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

  console.log(
    "SELECTED",
    userData?.addresses.find((ad) => ad.id === selectedAddress?.id)?.postalIndex
  );
  console.log(
    "userOrder.deliveryAddress",
    userOrder?.deliveryAddress?.postalIndex
  );

  console.log(showTooltipMessage, "showTooltipMessage");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              Enter delivery address
              {addresses.length > 0 && (
                <Tooltip title={"Return to addresses list"}>
                  <IconButton onClick={() => setShowAddressForm(false)}>
                    <WrongLocationOutlined />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                gap: "20px",
              }}
            >
              <GoodsIncomingFormInputItem
                name={"firstAndLast"}
                type="string"
                control={control}
                label={`${t("first_and_last")} *`}
                error={!!errors.firstAndLast}
                helperText={errors.firstAndLast?.message as string}
                sx={{
                  flex: 1,
                }}
              />

              <GoodsIncomingFormInputItem
                name={"postalIndex"}
                type="string"
                control={control}
                label={`${t("post_index")} *`}
                error={!!errors.postalIndex}
                helperText={errors.postalIndex?.message as string}
                sx={{
                  flex: 1,
                }}
              />
              <GoodsIncomingFormInputItem
                name={"deliveryAddress"}
                type="string"
                control={control}
                label={`${t("delivery_address")} *`}
                error={!!errors.deliveryAddress}
                helperText={errors.deliveryAddress?.message as string}
                sx={{
                  flex: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                }}
              >
                <GoodsIncomingFormInputItem
                  name={"geolocation"}
                  type="string"
                  control={control}
                  label={`${t("geolocation_link")} *`}
                  error={!!errors.geolocation}
                  helperText={
                    <Box
                      sx={{
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: "12px",
                        lineHeight: 1.66,
                        marginInline: "14px",
                        marginTop: "3px",
                      }}
                    >
                      {errors.geolocation && (
                        <FormHelperText
                          sx={{
                            color: "#d32f2f",
                          }}
                        >
                          {errors.geolocation.message}
                        </FormHelperText>
                      )}
                      {t("follow_the_link")}{" "}
                      <Link
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        target="_blank"
                        href="https://www.google.com/maps"
                      >
                        {t("google_maps")}
                      </Link>
                      {t("and_choose")}
                    </Box>
                  }
                />
              </Box>

              <GoodsIncomingFormInputItem
                name={"addressDetails"}
                type="string"
                control={control}
                label={`${t("address_details")} *`}
                error={!!errors.addressDetails}
                sx={{
                  flex: 1,
                }}
                helperText={
                  <Box
                    sx={{
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "12px",
                      lineHeight: 1.66,
                      marginInline: "14px",
                      marginTop: "3px",
                    }}
                  >
                    {errors.addressDetails && (
                      <FormHelperText
                        sx={{
                          color: "#d32f2f",
                        }}
                      >
                        {errors.addressDetails.message}
                      </FormHelperText>
                    )}
                    {t("address_placeholder")}
                  </Box>
                }
              />
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
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap="20px">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Select delivery address
              <Tooltip title={"Add new address"}>
                <IconButton onClick={() => setShowAddressForm(true)}>
                  <AddLocationAltOutlined />
                </IconButton>
              </Tooltip>
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
                  key={index}
                  value={address}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                  }}
                >
                  <AddressDetailCard address={address} key={index} />
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
        )}
        {renderButtonsGroup(
          showTooltipMessage ? "Please select delivery address" : ""
        )}
      </Card>
    </form>
  );
};
