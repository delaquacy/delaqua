import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { getDayOfWeek } from "@/app/utils/dayOfWeeks";
import CloseIcon from "@mui/icons-material/Close";
import "../../i18n";
import styles from "./OrderCreated.module.css";

interface ModalProps {
  method: "online" | "cash";
  url?: any;
  amount?: any;
  isOpen: boolean;
  bottlesNumber: number;
  deliveryDate: dayjs.Dayjs;
  onClose: () => void;
}
const BasicModal: React.FC<ModalProps> = ({
  method,
  url,
  amount,
  isOpen,
  onClose,
  bottlesNumber,
  deliveryDate,
}) => {
  const { t } = useTranslation("finishModal");
  const [open, setOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
    window.location.reload();
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (isOpen) {
      handleOpen();
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setSelectedLanguage(savedLanguage);
  }, []);

  const formattedDate = dayjs(deliveryDate).format("DD.MM.YYYY");
  const translatedDayOfWeek = getDayOfWeek(
    deliveryDate,
    selectedLanguage
  );

  const paymentText =
    method === "online" ? (
      <>
        {" "}
        <div> {t("proceed_online_payment")}</div>
        <div>
          <a href={url} style={{ color: "blue" }} target="_blank">
            {t("click_to_pay_online")}
          </a>
        </div>
      </>
    ) : (
      <span style={{ fontWeight: "bold" }}>
        {t("prepare_for_payment", { amount: amount })}
      </span>
    );
  const deliveryText =
    method === "cash" ? (
      <span>{t("we_will_deliver_to_you")}</span>
    ) : (
      <span>{t("we_will_deliver_to_you_pay")}</span>
    );

  function formatDeliveryText(numBottles: number) {
    let bottlesText;

    if (selectedLanguage === "ru") {
      if (numBottles === 1) {
        bottlesText = "бутыль";
      } else if (numBottles >= 2 && numBottles <= 4) {
        bottlesText = "бутыля";
      } else {
        bottlesText = "бутылей";
      }
    } else if (selectedLanguage === "uk") {
      if (numBottles === 1) {
        bottlesText = "пляшку";
      } else if (numBottles >= 2 && numBottles <= 4) {
        bottlesText = "пляшок";
      } else {
        bottlesText = "пляшок";
      }
    } else if (selectedLanguage === "en") {
      if (numBottles === 1) {
        bottlesText = "";
      } else if (numBottles >= 2 && numBottles <= 4) {
        bottlesText = "";
      } else {
        bottlesText = "";
      }
    } else if (selectedLanguage === "el") {
      if (numBottles === 1) {
        bottlesText = "μπουκάλι";
      } else if (numBottles >= 2 && numBottles <= 4) {
        bottlesText = "μπουκάλια";
      } else {
        bottlesText = "μπουκάλια";
      }
    }

    return bottlesText;
  }

  const numbersOfDeliverWater = t("numbers_of_deliver_water");
  const bottlesText = formatDeliveryText(bottlesNumber);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <CloseIcon
            className={styles.closeButton}
            onClick={handleClose}
          />

          <Box className={styles.center}>
            <CheckBoxIcon fontSize="large" className={styles.icon} />
          </Box>

          <Typography
            className={styles.center}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            <span className={styles.bold}>
              {" "}
              {t("thanks_for_order")}
            </span>
          </Typography>

          <Typography
            className={styles.center}
            id="modal-modal-description"
          >
            {deliveryText}&nbsp;
            <span className={styles.bold}>{bottlesNumber}</span>&nbsp;
            {`${bottlesText} ${numbersOfDeliverWater}`} &nbsp;
            <span className={styles.boldDay}>
              {translatedDayOfWeek}
            </span>
            &nbsp;
            <span className={styles.bold}>{formattedDate}</span>.
          </Typography>
          <Box className={styles.center} id="modal-modal-description">
            {paymentText}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
export default BasicModal;
