import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import useAmplitudeContext from "@/app/utils/amplitudeHook";
import Image from "next/image";
import Link from "next/link";

import { OrderItemsTable } from "@/app/components/OrderItemsTable";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import {
  AccountCircleOutlined,
  EventOutlined,
  HomeOutlined,
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
import {
  DetailsCard,
  DetailsCardItem,
  DetailsCardItemColumn,
  DetailsCardItemRow,
  FormWrapper,
} from "./styled";

interface FormValues {
  paymentMethod: string;
}

export const OrderDetailsStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t } = useTranslation("form");
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const { userOrder, goods, handleAddOrderDetails, setPaymentUrl } =
    useOrderDetailsContext();

  const [showTooltipMessage, setShowTooltipMessage] = useState(false);

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
    // trackAmplitudeEvent("submitOrder", {
    //   text: "On submit click",
    // });

    handleAddOrderDetails(data);

    const orderData = {
      ...userOrder,
      ...data,
      createdAt: dayjs().format("DD-MM-YYYY HH:mm"),
      items: userOrder.items.filter(({ count }) => !!+count),
    };

    console.log(orderData);

    // if (data.paymentMethod === "Cash") {
    //   orderData.paymentStatus = "CASH";
    // }

    // const orderRef = await addDoc(
    //   collection(db, `users/${userOrder.userId}/orders`),
    //   orderData
    // );

    // const allOrderRef = await addDoc(collection(db, `allOrders`), orderData);

    // const currentOrderId = orderRef.id;
    // const currentAllOrderId = allOrderRef.id;

    // console.log(orderRef);

    // const response = await axios.post(
    //   process.env.NEXT_PUBLIC_ORDERS_SHEET_LINK as string,
    //   orderData,
    //   {
    //     headers: {
    //       "Content-Type": "text/plain",
    //     },
    //   }
    // );

    // const invoiceNumber = await postInvoicesData(
    //   orderData,
    //   currentOrderId,
    //   currentAllOrderId
    // );

    // await updateDoc(orderRef, {
    //   invoiceNumber,
    // });
    // await updateDoc(allOrderRef, {
    //   invoiceNumber,
    // });

    // console.log(invoiceNumber, "INVOICE NUM");
    // console.log(orderData, "ORDER_DATA");

    // if (data.paymentMethod === "Online") {
    //   await getAndSetPaymentLink(
    //     +userOrder.totalPayments,
    //     userOrder.phoneNumber,
    //     `${userOrder.deliveryDate}, ${userOrder.deliveryTime}`,
    //     currentOrderId,
    //     currentAllOrderId,
    //     userOrder.userId,
    //     setPaymentUrl
    //   );
    // }

    // handleNext();
  };

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography>{t("checkAndPay")}</Typography>

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

        <Box
          sx={{
            marginBlock: "15px",
          }}
        >
          {t("orderDetails")}
        </Box>

        <OrderItemsTable
          orderItems={userOrder.items}
          totalPayments={userOrder.totalPayments}
        />

        <DetailsCard>
          <DetailsCardItem>
            <DetailsCardItemColumn>
              <DetailsCardItemRow>
                <Tooltip title={t("delivery_date_and_time")}>
                  <EventOutlined />
                </Tooltip>
                <Typography>{`${userOrder.deliveryDate as string}, ${
                  userOrder.deliveryTime
                }`}</Typography>
              </DetailsCardItemRow>

              <DetailsCardItemRow>
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
            </DetailsCardItemColumn>

            <DetailsCardItemColumn>
              <DetailsCardItemRow>
                <Tooltip title={t("first_and_last")}>
                  <AccountCircleOutlined />
                </Tooltip>
                <Typography>
                  {userOrder.deliveryAddressObj.firstAndLast}
                </Typography>
              </DetailsCardItemRow>

              <DetailsCardItemRow>
                <Tooltip title={t("address")}>
                  <HomeOutlined />
                </Tooltip>
                <Typography>
                  {`${userOrder.deliveryAddressObj.postalIndex}, ${userOrder.deliveryAddressObj.deliveryAddress}, ${userOrder.deliveryAddressObj.addressDetails}, ${userOrder.deliveryAddressObj.comments}`}
                </Typography>
              </DetailsCardItemRow>
            </DetailsCardItemColumn>
          </DetailsCardItem>

          <DetailsCardItem>
            <Tooltip title={t("geolocation_link")}>
              <PlaceOutlined />
            </Tooltip>
            <Typography>
              <Link href={userOrder.deliveryAddressObj.geolocation}>
                {userOrder.deliveryAddressObj.geolocation}
              </Link>
            </Typography>
          </DetailsCardItem>
        </DetailsCard>
      </Box>

      {renderButtonsGroup(showTooltipMessage ? "Done Requirement first" : "")}
    </FormWrapper>
  );
};
