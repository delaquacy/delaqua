import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { Box, Button, Card, Typography } from "@mui/material";

import styles from "../../../OrderCreated/OrderCreated.module.css";

import { useTranslation } from "react-i18next";

import useAmplitudeContext from "@/app/utils/amplitudeHook";
import { CheckBox } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import "../../../../i18n";

export const FinishStep = ({ returnBottles }: { returnBottles: boolean }) => {
  const { t } = useTranslation("finishModal");
  const router = useRouter();

  const { trackAmplitudeEvent } = useAmplitudeContext();

  const { userOrder, paymentUrl } = useOrderDetailsContext();

  const count = +userOrder.bottlesNumberToReturn || 0;
  const countSum = +(userOrder.bottlesNumberToReturn || "0") * 7;

  const clickToPay = () => {
    trackAmplitudeEvent("clickToPay", {
      text: "Click ot payment link",
    });
  };

  const handleClose = () => {
    trackAmplitudeEvent("closePayment", {
      text: "Close payment",
    });

    window.location.href = "/order_history";
  };

  const paymentText =
    userOrder.paymentMethod === "Online" ? (
      <>
        <div> {t("proceed_online_payment")}</div>
        <div>
          <Button
            onClick={clickToPay}
            style={{ marginTop: "10px" }}
            variant="contained"
          >
            <a href={paymentUrl} target="_blank">
              {t("click_to_pay_online")}
            </a>
          </Button>
        </div>
      </>
    ) : returnBottles ? (
      <span style={{ fontWeight: "bold" }}>{t("returnBottle")}</span>
    ) : (
      <span style={{ fontWeight: "bold" }}>
        {t("prepare_for_payment", { amount: userOrder.totalPayments })}
      </span>
    );

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "60vh",
        padding: "20px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        width: "100%",
        marginBottom: "15px",
      }}
    >
      {returnBottles && (
        <Box display="flex" flexDirection="column" gap="30px">
          <Typography
            className={styles.center}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            <span className={styles.bold}>
              {userOrder.bottlesNumberToReturn ===
              userOrder.deliveryAddressObj.numberOfBottles
                ? t("sorry")
                : t("accept")}
            </span>
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography maxWidth="98%">
              {t("sum", { count, countSum })}
            </Typography>
            <Typography>{t("afterSum")}</Typography>
          </Box>

          {userOrder.bottlesNumberToReturn ===
            userOrder.deliveryAddressObj.numberOfBottles && (
            <Typography
              className={styles.center}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              <span className={styles.bold}>{t("thanks")}</span>
            </Typography>
          )}
        </Box>
      )}

      {!returnBottles && (
        <Box>
          <Box className={styles.center}>
            <CheckBox fontSize="large" className={styles.icon} />
          </Box>

          <Typography
            className={styles.center}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            <span className={styles.bold}> {t("thanks_for_order")}</span>
          </Typography>

          {!returnBottles && (
            <Typography className={styles.center} id="modal-modal-description">
              {userOrder.paymentMethod === "Cash"
                ? t("we_will_deliver_to_you", {
                    date: userOrder.deliveryDate,
                    time: userOrder.deliveryTime,
                  })
                : t("we_will_deliver_to_you_pay", {
                    date: userOrder.deliveryDate,
                    time: userOrder.deliveryTime,
                  })}
            </Typography>
          )}

          <Box className={styles.center} id="modal-modal-description">
            {paymentText}
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        sx={{
          alignSelf: "center",
          width: "200px",
        }}
        onClick={handleClose}
      >
        {t("done")}
      </Button>
    </Card>
  );
};
