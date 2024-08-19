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
import { useScreenSize } from "@/app/hooks";

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

const BIG_BOTTLE_ID = "119";
const RENT_BOTTLE_ID = "120";

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

  const { userOrder, goods, handleAddOrderDetails } = useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();

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

  const onSubmit = (data: FormValues) => {
    // const {total: amount, }
    // const paymentUrl = getAndSetPaymentLink();

    console.log(data, "INSIDE");

    // handleAddOrderDetails(data);
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
          <Typography>
            Please check your order details and select payment method
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

          <Box>Order Details</Box>
          <Table
            size="small"
            sx={{
              padding: "20px",
            }}
          >
            <TableHead>
              <TableRow>
                {ORDER_DETAILS_HEAD.map((order, index) => (
                  <TableCell
                    key={index}
                    scope="row"
                    padding="none"
                    variant="head"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      borderRight:
                        index < ORDER_DETAILS_HEAD.length - 1
                          ? "1px solid #ddd"
                          : "none",
                    }}
                  >
                    {order.value}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {userOrder.items
                .filter(({ count }) => !!+count)
                .map((order, index) => (
                  <Tooltip
                    key={index}
                    title={
                      order.itemCode === RENT_BOTTLE_ID
                        ? "Deposit for additional bottles"
                        : ""
                    }
                  >
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {order.id}
                      </TableCell>
                      <TableCell
                        scope="row"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {order.name}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {order.count}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {order.sellPrice}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {order.sum}
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                ))}
              <TableRow>
                <TableCell colSpan={3} />
                <TableCell
                  colSpan={1}
                  align="center"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {userOrder.totalPayments} €
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

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
                  <Tooltip title={t("name")}>
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
