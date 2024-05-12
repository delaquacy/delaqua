"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import { getInfoFromDB } from "@/app/utils/getInfoFromDb";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./InfoModal.module.css";
import { InfoData } from "../../lib/definitions";
interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  const { i18n } = useTranslation();
  const [info, setInfo] = useState<InfoData | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const currentLocale = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInfoFromDB();
      setInfo(data);
      const status = sessionStorage.getItem("infoModalStatus");
      if (data && data.status && (!status || status === "true")) {
        setOpen(true);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("infoModalStatus", "false");
    }
    onClose();
  };

  const getTextByLocale = () => {
    if (!info) return "";
    switch (currentLocale) {
      case "en":
        return info.enText;
      case "ru":
        return info.ruText;
      case "el":
        return info.elText;
      case "uk":
        return info.ukText;
      default:
        return "";
    }
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.container}>
          <Box className={styles.closeButton}>
            <CloseIcon onClick={handleClose} />
          </Box>

          <Typography
            className={styles.mainText}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {getTextByLocale()}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
          ></Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default InfoModal;
