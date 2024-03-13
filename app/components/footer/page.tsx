import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import styles from "./page.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.container}>
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
        <IconButton href="#" color="default">
          <EmailIcon />
        </IconButton>
      </Box>

      <Box className={styles.copyright}>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
        >
          DelAqua Copyright © 2023 Water - All rights reserved ||
          Designed By: Illia
        </Typography>
      </Box>
    </footer>
  );
}
