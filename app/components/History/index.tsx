"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { useScreenSize } from "@/app/hooks";
import { OrdersData } from "@/app/types";
import { getDateFromTimestamp } from "@/app/utils";
import { ApartmentOutlined, HouseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MainContentWrapper } from "../shared/styled";
import { CancelModal } from "./CancelModal";
import { HistoryTableRow } from "./HistoryTableRow";
import {
  CardRow,
  HeaderWrapper,
  HistoryCardWrapper,
  HistoryCardsWrapper,
  HistoryTableHeadCell,
  TextTypo,
  TitleTypo,
} from "./styled";

const GeneratePdf = dynamic(() => import("../InvoiceGenerator"), {
  ssr: false,
});

export const History = () => {
  const { t } = useTranslation([
    "orderslist",
    "orderTable",
    "form",
    "savedAddresses",
  ]);
  const { orders, loading } = useUserContext();
  const { isSmallScreen } = useScreenSize();
  const [hasUncompletedOrder, setHasUncompletedOrder] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<null | OrdersData>(null);

  const handleOpenCancelModal = (order: OrdersData) => {
    setShowCancelModal(true);
    setOrderToCancel(order);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  useEffect(() => {
    const hasUncompletedOrder = orders.some(
      (order) => !order.canceled && !order.completed
    );

    setHasUncompletedOrder(hasUncompletedOrder);
  }, [orders]);

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
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
    <>
      <MainContentWrapper>
        <HeaderWrapper>
          <Typography variant="h4">{t("history")}</Typography>
        </HeaderWrapper>

        {isSmallScreen ? (
          <HistoryCardsWrapper>
            {orders.map((order, index) => {
              const couldBeCanceled =
                hasUncompletedOrder && !order.canceled && !order.completed;

              return (
                <HistoryCardWrapper key={order.id + index}>
                  <Tooltip
                    title={`${order.postalIndex}, ${order.deliveryAddress}`}
                    placement="bottom-start"
                  >
                    <CardRow>
                      {!order?.deliveryAddressObj?.addressType ||
                      order?.deliveryAddressObj?.addressType === "Home" ? (
                        <HouseOutlined />
                      ) : (
                        <ApartmentOutlined />
                      )}
                      <Typography fontSize="14px">
                        {t(
                          order?.deliveryAddressObj?.addressType?.toLowerCase() ||
                            "home",
                          { ns: "savedAddresses" }
                        )}
                      </Typography>
                    </CardRow>
                  </Tooltip>
                  <CardRow>
                    <TitleTypo>{t("table_phone")}:</TitleTypo>
                    <TextTypo>{order.phoneNumber}</TextTypo>
                  </CardRow>

                  <CardRow>
                    <TitleTypo>{t("table_delivery_time")}:</TitleTypo>
                    <TextTypo>
                      {`${order.deliveryDate}, ${order.deliveryTime}`}
                    </TextTypo>
                  </CardRow>

                  <CardRow>
                    <TitleTypo>{t("table_order_time")}:</TitleTypo>
                    <TextTypo>
                      {typeof order.createdAt === "string"
                        ? order.createdAt
                        : getDateFromTimestamp(order.createdAt as any)}
                    </TextTypo>
                  </CardRow>

                  <CardRow>
                    <TitleTypo>{t("table_payment_method")}:</TitleTypo>
                    <TextTypo>{order.paymentMethod}</TextTypo>
                  </CardRow>

                  <CardRow>
                    <TitleTypo>{t("table_total")}:</TitleTypo>
                    <TextTypo>{order.totalPayments}</TextTypo>
                  </CardRow>

                  <CardRow
                    sx={{
                      flex: 1,
                    }}
                  >
                    <TitleTypo>{t("table_status")}:</TitleTypo>
                    <TextTypo>
                      {t(`paymentStatuses.${order.paymentStatus}`, {
                        ns: "orderTable",
                      })}
                    </TextTypo>
                  </CardRow>

                  <CardRow
                    sx={{
                      flex: 1,
                    }}
                  >
                    <TitleTypo>{t("downloadInvoice")}:</TitleTypo>
                    <GeneratePdf order={order} />
                  </CardRow>

                  <CardRow>
                    {couldBeCanceled && (
                      <Button
                        sx={{
                          border: "1px solid",
                          width: "50%",
                          textTransform: "capitalize",
                        }}
                        onClick={() => handleOpenCancelModal(order)}
                      >
                        {t("cancel", {
                          ns: "form",
                        })}
                      </Button>
                    )}
                  </CardRow>
                </HistoryCardWrapper>
              );
            })}
          </HistoryCardsWrapper>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              paddingInline: "20px",
              paddingBottom: "20px",

              height: isSmallScreen
                ? `calc(100dvh - 84px - 129px)`
                : `calc(100dvh - 70px - 129px)`,
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          >
            <Table
              stickyHeader
              sx={{
                paddingBottom: "10px",
                overflowY: "scroll",
              }}
            >
              <TableHead>
                <TableRow>
                  <HistoryTableHeadCell>
                    {t("table_phone")}
                  </HistoryTableHeadCell>
                  <HistoryTableHeadCell align="center">
                    {t("table_address")}
                  </HistoryTableHeadCell>

                  <HistoryTableHeadCell
                    sx={{
                      maxWidth: "120px",
                    }}
                  >
                    {t("table_delivery_time")}
                  </HistoryTableHeadCell>

                  <HistoryTableHeadCell
                    sx={{
                      maxWidth: "120px",
                    }}
                  >
                    {t("table_order_time")}
                  </HistoryTableHeadCell>

                  <HistoryTableHeadCell>
                    {t("table_payment_method")}
                  </HistoryTableHeadCell>

                  <HistoryTableHeadCell>
                    {t("table_total")}
                  </HistoryTableHeadCell>
                  <HistoryTableHeadCell>
                    {t("table_status")}
                  </HistoryTableHeadCell>
                  <HistoryTableHeadCell>{t("invoice")}</HistoryTableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.length ? (
                  orders.map((order, index) => (
                    <HistoryTableRow
                      key={order.id + index}
                      order={order}
                      hasUncompletedOrder={hasUncompletedOrder}
                      handleOpenCancelModal={handleOpenCancelModal}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      {t("table_no_orders_yet")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </MainContentWrapper>

      <CancelModal
        open={showCancelModal}
        handleClose={handleCloseCancelModal}
        orderToCancel={orderToCancel}
      />
    </>
  );
};
