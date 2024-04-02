"use client";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import "./i18n";
import { useEffect } from "react";

export default function Home() {
  const { t } = useTranslation("main");
  const { i18n } = useTranslation();
  useEffect(() => {
    const preferredLanguage = localStorage.getItem("language");

    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }
  }, [i18n]);
  return (
    <main>
      <Box className={styles.container}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <h1>{t("title")}</h1>
            <Box className={styles.blocks}>
              <CalendarMonthOutlinedIcon fontSize="large" />
              <p className={styles.subtitle}>{t("water_delivery")}</p>
            </Box>
            <Box className={styles.blocks}>
              <LocalDrinkOutlinedIcon fontSize="large" />
              <Box className={styles.list}>
                <h3> {t("our_prices")}</h3>
                <ul>
                  <li> {t("one_bottle_price")}</li>
                  <li>{t("order_2-9")}</li>
                  <li> {t("order_more_than_10")}</li>
                </ul>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Image
              layout="responsive"
              src="/bottles.webp"
              alt="bottles"
              width={400}
              height={410}
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
  );
}
