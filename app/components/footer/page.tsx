import React from "react";
import { Box, IconButton } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import styles from "./page.module.css";

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
