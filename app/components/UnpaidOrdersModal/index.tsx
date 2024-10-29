import { useScreenSize } from "@/app/hooks";
import { OrdersData } from "@/app/types";
import { getOrderInfo } from "@/app/utils";
import { Cancel } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ExpandRow } from "../WrapperHeader/ExpandRow";
import {
  CardCol,
  CardRow,
  CardWrapper,
  CardsContainer,
  TextTypo,
  TitleTypo,
} from "./styled";

interface UnpaidOrdersModalProps {
  showWindow: boolean;
  showContinueText: boolean;
  onClose: () => void;
  unpaidOrders: OrdersData[];
}

export const UnpaidOrdersModal = ({
  showWindow,
  showContinueText,
  onClose,
  unpaidOrders,
}: UnpaidOrdersModalProps) => {
  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

  useEffect(() => {
    if (unpaidOrders.length === 0) {
      onClose();
    }
  }, [unpaidOrders]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="xl"
      open={showWindow}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <IconButton
        onClick={onClose}
        sx={{
          width: "30px",
          height: "30px",
          position: "absolute",
          right: "7px",
          top: "5px",
        }}
      >
        <Cancel />
      </IconButton>
      <DialogTitle id="alert-dialog-title">{t("tableTitle")}</DialogTitle>
      {showContinueText && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <Typography
            sx={{
              paddingInline: "24px",
            }}
          >
            {t("tableSubTitle")}
          </Typography>
          <Box
            sx={{
              paddingInline: "24px",
              width: "90%",
            }}
          >
            <Typography
              sx={{
                display: "inline",
              }}
            >
              {t("tableHelperText").split("Telegram")[0]}
            </Typography>
            <Link target="_blank" href="https://t.me/delaquacy">
              <Typography
                sx={{
                  display: "inline",
                  color: "#1976d2",
                }}
              >
                Telegram
              </Typography>
            </Link>
          </Box>
        </Box>
      )}
      <DialogContent>
        {isSmallScreen ? (
          <CardsContainer>
            {unpaidOrders.map((order: OrdersData) => {
              const { paymentStatusText } = getOrderInfo(order, t);

              return (
                <CardWrapper key={order.id}>
                  <CardCol>
                    <TitleTypo>{t("tableHeadCells.dateAndTime")}:</TitleTypo>
                    <TextTypo>
                      {`${order.deliveryDate}, ${order.deliveryTime}`}
                    </TextTypo>
                  </CardCol>

                  <CardRow>
                    <TitleTypo
                      sx={{
                        textTransform: "capitalize",
                      }}
                    >
                      {t("tableHeadCells.total")}:
                    </TitleTypo>
                    <TextTypo>{order.totalPayments}</TextTypo>
                  </CardRow>

                  <CardRow>
                    <TitleTypo>{t("tableHeadCells.status")}:</TitleTypo>
                    <TextTypo>{paymentStatusText}</TextTypo>
                  </CardRow>

                  <CardCol>
                    <TitleTypo>{t("tableHeadCells.paymentLink")}:</TitleTypo>

                    <Link
                      href={(order.paymentLink as string) || "/"}
                      target="_blank"
                    >
                      <TextTypo
                        sx={{
                          color: "#1565c0",
                          textDecoration: "underline",
                          textUnderlineOffset: 2,
                        }}
                      >
                        {order.paymentLink}
                      </TextTypo>
                    </Link>
                  </CardCol>
                </CardWrapper>
              );
            })}
          </CardsContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {t("tableHeadCells.dateAndTime")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {t("tableHeadCells.total")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {t("tableHeadCells.status")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {t("tableHeadCells.paymentLink")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unpaidOrders.map((order: OrdersData) => (
                  <ExpandRow order={order} key={order.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};
