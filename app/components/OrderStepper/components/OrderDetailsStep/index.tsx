import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import useAmplitudeContext from "@/app/utils/amplitudeHook";
import Image from "next/image";

import { OrderItemsTable } from "@/app/components/OrderItemsTable";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { useToast } from "@/app/hooks";
import { db } from "@/app/lib/config";
import { deliveryValidation } from "@/app/utils";
import { getAndSetPaymentLink } from "@/app/utils/getAndSetPaymentLink";
import { postInvoicesData } from "@/app/utils/postInvoiceData";
import {
  AccountCircleOutlined,
  EventOutlined,
  HomeOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
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

const RENT_CODE = 120;

export const OrderDetailsStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t } = useTranslation("form");
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const { setShowWindow, unpaidOrders } = useUserContext();
  const { userOrder, userData, handleAddOrderDetails, setPaymentUrl } =
    useOrderDetailsContext();
  const { showErrorToast } = useToast();

  const [showTooltipMessage, setShowTooltipMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      paymentMethod: "Cash",
    },
  });

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
    // trackAmplitudeEvent("submitOrder", {
    //   text: "On submit click",
    // });

    handleAddOrderDetails(data);

    const orderData = {
      ...userOrder,
      ...data,
      createdAt: dayjs().format("DD.MM.YYYY HH:mm"),
      items: userOrder.items.filter(({ count }) => !!+count),
    };

    const { isCurrentDayAfterTen, isCurrentDayAfterNoon } = deliveryValidation(
      dayjs()
    );

    if (
      isCurrentDayAfterTen &&
      orderData.deliveryDate === dayjs().format("DD.MM.YYYY") &&
      orderData.deliveryTime === "9-12"
    ) {
      showErrorToast("Please, change the delivery time");
      return;
    }

    if (
      isCurrentDayAfterNoon &&
      orderData.deliveryDate === dayjs().format("DD.MM.YYYY") &&
      orderData.deliveryTime === "9-17"
    ) {
      showErrorToast("Please, change the delivery date");
      return;
    }

    const rentCount = orderData.items.find(
      ({ itemCode }) => +itemCode === RENT_CODE
    )?.count;

    if (data.paymentMethod === "Cash") {
      orderData.paymentStatus = "CASH";
    }

    const orderRef = await addDoc(
      collection(db, `users/${userData.userId}/orders`),
      orderData
    );
    const allOrderRef = await addDoc(collection(db, `allOrders`), orderData);

    const addressRef = doc(
      db,
      `users/${userData.userId}/addresses/${userOrder.deliveryAddressObj.id}`
    );

    if (rentCount)
      await updateDoc(addressRef, {
        numberOfBottles:
          +orderData.deliveryAddressObj.numberOfBottles + +rentCount,
      });

    const currentOrderId = orderRef.id;
    const currentAllOrderId = allOrderRef.id;

    const response = await axios.post(
      process.env.NEXT_PUBLIC_ORDERS_SHEET_LINK as string,
      orderData,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    const invoiceNumber = await postInvoicesData(
      orderData,
      currentOrderId,
      currentAllOrderId
    );

    await updateDoc(orderRef, {
      invoiceNumber,
    });
    await updateDoc(allOrderRef, {
      invoiceNumber,
    });

    if (data.paymentMethod === "Online") {
      await getAndSetPaymentLink(
        +userOrder.totalPayments,
        userOrder.phoneNumber,
        `${userOrder.deliveryDate}, ${userOrder.deliveryTime}`,
        currentOrderId,
        currentAllOrderId,
        userData.userId,
        setPaymentUrl
      );
    }
    setLoading(false);

    handleNext();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={100} thickness={2} />
      </Box>
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
          </Typography>{" "}
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
              <Tooltip title={t("number_of_bottles_to_return")}>
                <Image
                  src="/recycleWater.svg"
                  height={25}
                  width={25}
                  alt="recycleWater"
                />
              </Tooltip>
              <Typography>{userOrder.bottlesNumberToReturn}</Typography>
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
                flex: 2,
              }}
            >
              <Tooltip title={t("geolocation_link")}>
                <PlaceOutlined />
              </Tooltip>
              <Typography noWrap>
                <Link href={userOrder.deliveryAddressObj.geolocation}>
                  {userOrder.deliveryAddressObj.geolocation}
                </Link>
              </Typography>
            </DetailsCardItemRow>

            <DetailsCardItemRow
              sx={{
                flex: 3,
              }}
            >
              <Tooltip title={t("address")}>
                <HomeOutlined />
              </Tooltip>
              <Typography>
                {`${userOrder.deliveryAddressObj.postalIndex}, ${userOrder.deliveryAddressObj.deliveryAddress}, ${userOrder.deliveryAddressObj.addressDetails}, ${userOrder.deliveryAddressObj.comments}`}
              </Typography>
            </DetailsCardItemRow>
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

      {renderButtonsGroup(showTooltipMessage ? "Done Requirement first" : "")}
    </FormWrapper>
  );
};
