import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { Box, Button, Card, Typography } from "@mui/material";

import styles from "../../../OrderCreated/OrderCreated.module.css";

import { useScreenSize } from "@/app/hooks";
import { useTranslation } from "react-i18next";

import useAmplitudeContext from "@/app/utils/amplitudeHook";
import { CheckBox } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import "../../../../i18n";

interface FormValues {}

export const FinishStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t, i18n } = useTranslation("finishModal");
  const router = useRouter();

  const { trackAmplitudeEvent } = useAmplitudeContext();

  const { userOrder, paymentUrl } = useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();

  const currentLocale = i18n.language;

  const clickToPay = () => {
    trackAmplitudeEvent("clickToPay", {
      text: "Click ot payment link",
    });
  };
  const closePayment = () => {
    trackAmplitudeEvent("closePayment", {
      text: "Close payment",
    });
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
    ) : (
      <span style={{ fontWeight: "bold" }}>
        {t("prepare_for_payment", { amount: userOrder.totalPayments })}
      </span>
    );

  const onSubmit = (data: FormValues) => {
    console.log(data, "INSIDE");
  };

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

        <Box className={styles.center} id="modal-modal-description">
          {paymentText}
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{
          alignSelf: "center",
          width: "200px",
        }}
        onClick={() => router.push("/order_history")}
      >
        {t("done")}
      </Button>
    </Card>
  );
};
