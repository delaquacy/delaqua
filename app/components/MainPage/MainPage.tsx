"use client";
import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import styles from "./MainPage.module.css";
import { useTranslation } from "react-i18next";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useToggle } from "@/app/lib/ToggleContext";
import "../../i18n";
import InfoModal from "../InfoModal/InfoModal";

export default function MainPage() {
  const { t } = useTranslation();
  const { setToggle, isToggled } = useToggle();
  const [showModal, setShowModal] = useState(true);
  const handleToggle = () => {
    setToggle(!isToggled);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <main>
        <Box className={styles.container}>
          {showModal && <InfoModal onClose={handleCloseModal} />}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <h1>{t("title")}</h1>
              <Box className={styles.blocks}>
                <CalendarMonthOutlinedIcon fontSize="large" />
                <p className={styles.subtitle}>
                  {t("water_delivery")}
                </p>
              </Box>
              <Box className={styles.blocks}>
                <LocalDrinkOutlinedIcon fontSize="large" />
                <Box className={styles.list}>
                  <h3> {t("our_prices")}</h3>
                  <ul>
                    <li> {t("one_bottle_price")}</li>
                    <li>{t("order_2-9")}</li>
                    <li>
                      {" "}
                      {t("order_more_than_10")}{" "}
                      <a
                        className={styles.link}
                        target="_blank"
                        href="https://t.me/delaquacy"
                      >
                        {t("message_us_telegram")}
                      </a>
                    </li>
                  </ul>
                </Box>
              </Box>
              <Box>
                <div className={styles.blockLogin}>
                  <div className={styles.colorText}>
                    {t("log_in_with_phone")}
                  </div>
                </div>
              </Box>
              <Box className={styles.button}>
                <Button onClick={handleToggle} variant="contained">
                  <LocalShippingOutlinedIcon />
                  {t("order_now")}
                </Button>
              </Box>
            </Grid>
            <Grid
              style={{ position: "relative" }}
              item
              xs={12}
              md={4}
            >
              <img
                style={{ width: "100%", height: "auto" }}
                src="/bottles.webp"
                alt="bottles"
              />
              <div className={styles.imageDescr}>*18.9 litres</div>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: 2 }} className={styles.infoBlock}>
            <Grid container spacing={1}>
              <Grid
                className={styles.borderContainer}
                item
                xs={12}
                md={8}
              >
                <Box className={styles.waterDescription}>
                  <p> {t("water_characteristics")}</p>
                  <Image
                    src={"/table.webp"}
                    alt={"chemical_analysis"}
                    width={295}
                    height={180}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className={styles.depositDescription}>
                  {t("deposite")}
                  <span> {t("one_bottle_deposite")}</span>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </main>
    </>
  );
}
