import { useScreenSize } from "@/app/hooks";
import { OrdersData } from "@/app/types";
import { Cancel } from "@mui/icons-material";
import {
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
} from "@mui/material";
import Link from "next/link";
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
  onClose: () => void;
  unpaidOrders: OrdersData[];
}

export const UnpaidOrdersModal = ({
  showWindow,
  onClose,
  unpaidOrders,
}: UnpaidOrdersModalProps) => {
  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

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
      <DialogContent>
        {isSmallScreen ? (
          <CardsContainer>
            {unpaidOrders.map((order: OrdersData) => (
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
                  <TextTypo>
                    {t(`paymentStatuses.${order.paymentStatus}`)}
                  </TextTypo>
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
            ))}
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
