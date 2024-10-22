import { useToast } from "@/app/hooks";
import { OrdersData } from "@/app/types";
import { updateOrderStatus } from "@/app/utils";
import { Close, Report } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SharedButton } from "../shared";
import {
  CancelTitle,
  CardRow,
  HistoryCardWrapper,
  ModalWrapper,
  TextTypo,
  TitleTypo,
} from "./styled";

interface CancelModalProps {
  open: boolean;
  handleClose: () => void;
  orderToCancel: OrdersData | null;
}

export const CancelModal = ({
  open,
  handleClose,
  orderToCancel,
}: CancelModalProps) => {
  const { t } = useTranslation(["orderslist", "orderTable"]);
  const { showSuccessToast } = useToast();

  const handleChangeStatus = async () => {
    await updateOrderStatus(
      [orderToCancel?.idDb || ""],
      "",
      "Cancelled (client)"
    );
    showSuccessToast("The order successfully canceled");
    handleClose();
  };

  const paymentStatusText = Array.isArray(orderToCancel?.paymentStatus)
    ? orderToCancel.paymentStatus
        .map((status) =>
          t(`paymentStatuses.${status.toLowerCase().replace(/\s+/g, "_")}`, {
            ns: "orderTable",
          })
        )
        .join(", ")
    : typeof orderToCancel?.paymentStatus === "string"
    ? t(
        `paymentStatuses.${orderToCancel?.paymentStatus
          .toLowerCase()
          .replace(/\s+/g, "_")}`,
        {
          ns: "orderTable",
        }
      )
    : t("paymentStatuses.unpaid");

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalWrapper>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 5,
            top: 5,
          }}
        >
          <Close />
        </IconButton>
        <Box>
          <Report
            sx={{
              width: "40px",
              height: "40px",
              color: "#D34942",
            }}
          />
          <CancelTitle>
            {t("cancelOrder", {
              ns: "main",
            })}
          </CancelTitle>

          <Typography fontSize="18px">
            {t("sureCancel", {
              ns: "main",
            })}
          </Typography>
        </Box>

        <HistoryCardWrapper>
          <CardRow>
            <TitleTypo>{t("table_phone")}:</TitleTypo>
            <TextTypo>{orderToCancel?.phoneNumber}</TextTypo>
          </CardRow>

          <CardRow>
            <TitleTypo>{t("table_delivery_time")}:</TitleTypo>
            <TextTypo>
              {`${orderToCancel?.deliveryDate}, ${orderToCancel?.deliveryTime}`}
            </TextTypo>
          </CardRow>

          <Box textAlign="left">
            <Typography
              variant="body1"
              fontWeight="bold"
              marginRight="5px"
              display={"inline"}
              textAlign="left"
            >
              {t("table_address")}:
            </Typography>
            <Typography
              variant="body1"
              display="inline"
              width="100%"
              textAlign="left"
            >
              {`${orderToCancel?.postalIndex}, ${orderToCancel?.deliveryAddress}`}
            </Typography>
          </Box>

          <CardRow>
            <TitleTypo>{t("table_payment_method")}:</TitleTypo>
            <TextTypo>{orderToCancel?.paymentMethod}</TextTypo>
          </CardRow>

          <CardRow>
            <TitleTypo>{t("table_total")}:</TitleTypo>
            <TextTypo>{orderToCancel?.totalPayments}</TextTypo>
          </CardRow>

          <CardRow
            sx={{
              justifyContent: "space-between",
            }}
          >
            <CardRow
              sx={{
                flex: 1,
              }}
            >
              <TitleTypo>{t("table_status")}:</TitleTypo>
              <TextTypo>{paymentStatusText}</TextTypo>
            </CardRow>
          </CardRow>
        </HistoryCardWrapper>

        <Box display="flex" flexDirection="row" width="100%" gap="20px">
          <SharedButton
            onClick={handleClose}
            text={t("back", {
              ns: "main",
            })}
            variantType="success"
            width="100%"
            sx={{ textTransform: "none" }}
            fontSize="14px"
          />

          <SharedButton
            onClick={handleChangeStatus}
            text={t("confirm", {
              ns: "main",
            })}
            variantType="error"
            width="100%"
            sx={{ textTransform: "none" }}
            fontSize="14px"
          />
        </Box>
      </ModalWrapper>
    </Modal>
  );
};
