import {
  Box,
  Card,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { ChangeEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ORDER_DETAILS_HEAD } from "@/app/constants/OrderDetailsHead";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import {
  AccountCircleOutlined,
  EventOutlined,
  HomeOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { getAndSetPaymentLink } from "@/app/utils/getAndSetPaymentLink";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/config";
import axios from "axios";
import { BIG_BOTTLE_ID, RENT_BOTTLE_ID } from "@/app/constants/OrderItemsIds";
import { OrderItemsTable } from "../OrderItemsTable";

interface FormValues {
  paymentMethod: string;
}

export const FourthStep = ({
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

    // const orderData = { ...userOrder, data };

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

    // const response = await axios.post(
    //   process.env.NEXT_PUBLIC_ORDERS_SHEET_LINK as string,
    //   orderData,
    //   {
    //     headers: {
    //       "Content-Type": "text/plain",
    //     },
    //   }
    // );

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

    console.log(data, "INSIDE");

    handleNext();
  };

  useEffect(() => {
    if (userOrder.items.find(({ id }) => `${id}` === RENT_BOTTLE_ID)) {
      return;
    }
    const returnBottles = userOrder.bottlesNumberToReturn;

    const currentOrderBottles =
      userOrder.items.find(({ id }) => +id === +BIG_BOTTLE_ID)?.count || 0;

    if (+currentOrderBottles > +returnBottles) {
      const rentCount = +currentOrderBottles - +returnBottles;
      const rentGood = goods.find(({ id }) => `${id}` === RENT_BOTTLE_ID);
      const rentItem = {
        id: rentGood?.id,
        itemCode: rentGood?.id,
        name: rentGood?.name,
        sellPrice: rentGood?.sellPrice,
        count: rentCount,
        sum: `${+rentCount * +(rentGood?.sellPrice || 0)}`,
      };

      handleAddOrderDetails({
        items: [...userOrder.items, rentItem],
        totalPayments: `${+userOrder.totalPayments + +rentItem.sum}`,
        totalBottlesAtCurrentAddress: `${
          +userOrder.deliveryAddress.numberOfBottles + +rentCount
        }`,
      });
    }

    if (+currentOrderBottles < +returnBottles) {
      const returnCount = +returnBottles - +currentOrderBottles;

      handleAddOrderDetails({
        totalBottlesAtCurrentAddress: `${
          +userOrder.deliveryAddress.numberOfBottles - returnCount
        }`,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          padding: "20px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
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

          <Box>{t("orderDetails")}</Box>
          <OrderItemsTable
            orderItems={userOrder.items}
            totalPayments={userOrder.totalPayments}
          />

          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "15px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  flex: 1,
                }}
              >
                <Box display="flex" flexDirection="row" gap="10px">
                  <Tooltip title={t("delivery_date_and_time")}>
                    <EventOutlined />
                  </Tooltip>
                  <Typography>{`${userOrder.deliveryDate as string}, ${
                    userOrder.deliveryTime
                  }`}</Typography>
                </Box>

                <Box display="flex" flexDirection="row" gap="10px">
                  <Tooltip title={t("number_of_bottles_to_return")}>
                    <Image
                      src="/recycleWater.svg"
                      height={25}
                      width={25}
                      alt="recycleWater"
                    />
                  </Tooltip>
                  <Typography>{userOrder.bottlesNumberToReturn}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  flex: 1,
                }}
              >
                <Box display="flex" flexDirection="row" gap="10px">
                  <Tooltip title={t("first_and_last")}>
                    <AccountCircleOutlined />
                  </Tooltip>
                  <Typography>
                    {userOrder.deliveryAddress.firstAndLast}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="row" gap="10px">
                  <Tooltip title={t("address")}>
                    <HomeOutlined />
                  </Tooltip>
                  <Typography>
                    {`${userOrder.deliveryAddress.postalIndex}, ${userOrder.deliveryAddress.deliveryAddress}, ${userOrder.deliveryAddress.addressDetails}, ${userOrder.deliveryAddress.comments}`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box display="flex" flexDirection="row" gap="10px">
              <Tooltip title={t("geolocation_link")}>
                <PlaceOutlined />
              </Tooltip>
              <Typography>
                <Link href={userOrder.deliveryAddress.geolocation}>
                  {userOrder.deliveryAddress.geolocation}
                </Link>
              </Typography>
            </Box>
          </Card>
        </Box>
        {renderButtonsGroup(showTooltipMessage ? "Done Requirement first" : "")}
      </Card>
    </form>
  );
};
