"use client";
import React from "react";
import { Box, IconButton } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

export default function Footers() {
  const { t } = useTranslation("main");
  return (
    <footer className={styles.container}>
      <Box className={styles.returnContainer}>
        <div>
          <p className={styles.returnText}>
            {t("message_us_1")}{" "}
            <a
              className={styles.returnLink}
              target="_blank"
              href="https://t.me/delaquacy"
            >
              {t("message_us_2")}
            </a>{" "}
            {t("find_us")}
            @delaquacy.
          </p>
        </div>
      </Box>
      <Box className={styles.social_media}>
        <IconButton
          target="_blank"
          href="https://t.me/delaquacy"
          color="info"
        >
          <TelegramIcon />
        </IconButton>

        <IconButton
          target="_blank"
          href="https://wa.me/35795154204"
          color="success"
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton
          target="_blank"
          href="https://facebook.com/delaquacy"
          color="primary"
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="mailto:delaqua.cy@gmail.com"
          color="default"
        >
          <EmailIcon />
        </IconButton>
        <IconButton
          target="_blank"
          href="https://www.instagram.com/delaqua.cy"
        >
          <InstagramIcon />
        </IconButton>
      </Box>
    </footer>
  );
}
