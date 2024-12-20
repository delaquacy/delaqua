import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import useAmplitudeContext from "@/app/utils/amplitudeHook";

import { Loader } from "@/app/components/Loader";
import { OrderItemsTable } from "@/app/components/OrderItemsTable";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useToast } from "@/app/hooks";
import { GoodService } from "@/app/lib/GoodService";
import sessionService from "@/app/lib/SessionService";
import { processOrder } from "@/app/utils/processOrder";
import {
  AccountCircleOutlined,
  ApartmentOutlined,
  EventOutlined,
  HouseOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import {
  DetailsCard,
  DetailsCardItemRow,
  FormInternalWrapper,
  FormWrapper,
} from "./styled";

interface FormValues {
  paymentMethod: string;
}

export const OrderDetailsStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (
    errorMessage?: string,
    disableNext?: boolean
  ) => React.ReactNode;
  handleNext: () => void;
  activeStep: number;
}) => {
  const { t } = useTranslation(["form", "orderTable"]);
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const {
    userOrder,
    userData,
    disabledDates,
    handleAddOrderDetails,
    setPaymentUrl,
  } = useOrderDetailsContext();

  const { showErrorToast } = useToast();

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      paymentMethod: "Cash",
    },
  });

  const currentMethod = watch("paymentMethod");

  const addressInfo = `${userOrder.deliveryAddressObj.postalIndex}, 
  ${userOrder.deliveryAddressObj.deliveryAddress}, 
  ${userOrder.deliveryAddressObj.addressDetails}, 
  ${userOrder.deliveryAddressObj.comments}`;

  const handleChangePayment = (e: ChangeEvent<HTMLInputElement>) => {
    const paymentMethod = e.target.value;

    if (paymentMethod === "Cash") {
      trackAmplitudeEvent("payCash", {
        text: "Payment by cash selected",
      });
    }

    if (paymentMethod === "Online") {
      trackAmplitudeEvent("payOnline", {
        text: "Payment online selected",
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    trackAmplitudeEvent("submitOrder", {
      text: "On submit click",
    });

    handleAddOrderDetails(data);

    const orderData = {
      ...userOrder,
      ...data,
      createdAt: dayjs().format("DD.MM.YYYY HH:mm"),
      items: userOrder.items.filter(({ count }) => !!+count),
    };

    // if (data.paymentMethod === "Online" && unpaidOrders.length) {
    //   setLoading(false);
    //   setShowWindow(true);
    //   setShowContinueText(true);

    //   sessionService.saveStep(activeStep);
    //   sessionService.saveFormData(orderData);
    //   return;
    // }

    const invoiceNumber = await processOrder(
      userData,
      userOrder,
      orderData,
      disabledDates,
      setPaymentUrl,
      handleNext,
      showErrorToast
    );

    handleAddOrderDetails({ invoiceNumber });

    await GoodService.addOrderItemsToInventoryTable({
      ...orderData,
      invoiceNumber,
    } as any);

    setLoading(false);
    sessionService.clearAll();
  };

  useEffect(() => {
    if (userOrder.paymentMethod) {
      reset({
        paymentMethod: userOrder.paymentMethod,
      });
    }
  }, [userOrder.items]);

  if (loading) {
    return (
      <Loader
        text={
          currentMethod === "Cash"
            ? t("loading_order")
            : t("loading_paymentLink")
        }
      />
    );
  }

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <FormInternalWrapper>
        <Box>
          <Typography
            sx={{
              marginBottom: "15px",
            }}
          >
            {t("checkAndPay")}:
          </Typography>

          <DetailsCard>
            <DetailsCardItemRow
              sx={{
                flex: 1,
              }}
            >
              <Tooltip title={t("delivery_date_and_time")}>
                <EventOutlined />
              </Tooltip>
              <Typography>{`${userOrder.deliveryDate as string}, ${
                userOrder.deliveryTime
              }`}</Typography>
            </DetailsCardItemRow>

            <DetailsCardItemRow
              sx={{
                flex: 1,
              }}
            >
              <Tooltip title={t("first_and_last")}>
                <AccountCircleOutlined />
              </Tooltip>
              <Typography>
                {userOrder.deliveryAddressObj.firstAndLast}
              </Typography>
            </DetailsCardItemRow>

            <DetailsCardItemRow
              sx={{
                flex: 1,
              }}
            >
              <Tooltip title={t("geolocation_link")}>
                <PlaceOutlined />
              </Tooltip>
              <Link href={userOrder.deliveryAddressObj.geolocation}>
                <Typography sx={{ color: "#1976d2", wordBreak: "break-word" }}>
                  {userOrder.deliveryAddressObj.geolocation}
                </Typography>
              </Link>
            </DetailsCardItemRow>

            <DetailsCardItemRow
              sx={{
                flex: 3,
              }}
            >
              <Tooltip
                title={
                  t("tableHeadCells.addressType", { ns: "orderTable" }) +
                  ": " +
                  t(
                    userOrder.deliveryAddressObj.addressType?.toLowerCase() ||
                      "home",
                    { ns: "savedAddresses" }
                  )
                }
              >
                {!userOrder.deliveryAddressObj.addressType ||
                userOrder.deliveryAddressObj.addressType === "Home" ? (
                  <HouseOutlined />
                ) : (
                  <ApartmentOutlined />
                )}
              </Tooltip>
              <Typography>{addressInfo}</Typography>
            </DetailsCardItemRow>
            {userOrder.deliveryAddressObj?.VAT_Num && (
              <DetailsCardItemRow
                sx={{
                  flex: 1,
                }}
              >
                <Tooltip title={t("address")}>
                  <Image
                    src="/vat_num.svg"
                    height={25}
                    width={25}
                    alt="vat num"
                  />
                </Tooltip>
                <Typography>
                  {userOrder.deliveryAddressObj?.VAT_Num || ""}
                </Typography>
              </DetailsCardItemRow>
            )}
          </DetailsCard>
        </Box>

        <Box>
          <Typography
            sx={{
              marginBottom: "20px",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: "5px",
            }}
          >
            {t("orderDetails")}:
          </Typography>

          <OrderItemsTable
            orderItems={userOrder.items}
            totalPayments={userOrder.totalPayments}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            Payment:
          </Typography>

          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioGroup
                row
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  handleChangePayment(e);
                }}
                sx={{
                  gap: "10px",
                  paddingInline: "5px",
                  borderBlock: "1px solid lightgray",
                  width: "fit-content",
                }}
              >
                <FormControlLabel
                  value="Cash"
                  control={<Radio />}
                  label={t("cash")}
                />
                <FormControlLabel
                  value="Online"
                  control={<Radio />}
                  label={t("online")}
                />
              </RadioGroup>
            )}
          />
        </Box>
      </FormInternalWrapper>
      {renderButtonsGroup("", loading)}
    </FormWrapper>
  );
};
