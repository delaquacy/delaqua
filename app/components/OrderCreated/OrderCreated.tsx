import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import "../../i18n";
import styles from "./OrderCreated.module.css";
import { getDayOfWeek } from "@/app/utils/dayOfWeeks";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
    router.push("/");
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

  const dayOfWeek = dayjs(deliveryDate).format("dddd");
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

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
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
            {t("we_will_deliver_to_you")} &nbsp;
            <span className={styles.bold}>{bottlesNumber}</span>&nbsp;
            {t("numbers_of_deliver_water")} &nbsp;
            <span className={styles.boldDay}>
              {translatedDayOfWeek}
            </span>
            &nbsp;
            <span className={styles.bold}>{formattedDate}</span>.
          </Typography>
          <Typography
            className={styles.center}
            id="modal-modal-description"
          >
            {paymentText}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default BasicModal;
