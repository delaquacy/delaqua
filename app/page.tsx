import { Box, Grid } from "@mui/material";
import Image from "next/image";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import styles from "./page.module.css";
import MyForm from "./components/form/page";
export default function Home() {
  return (
    <main>
      <Box className={styles.container}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <h1>Water delivery in Limassol</h1>
            <Box className={styles.blocks}>
              <CalendarMonthOutlinedIcon fontSize="large" />
              <p className={styles.subtitle}>
                We deliver water bottles from 9 AM to 5 PM from
                Tuesday to Saturday. Fill in the form below to make an
                order!
              </p>
            </Box>
            <Box className={styles.blocks}>
              <LocalDrinkOutlinedIcon fontSize="large" />
              <Box className={styles.list}>
                <h3>Our prices:</h3>
                <ul>
                  <li>7 euros if you order one bottle</li>
                  <li>
                    6 euros — per each, if you order 2 to 9 bottles
                  </li>
                  <li>more than 10 bottles — price is negotiable</li>
                </ul>
              </Box>
            </Box>
          </Grid>
          <Grid className={styles.imageContainer} item xs={12} md={4}>
            <div className={styles.imageWrapper}>
              <Image
                src="/bottles.webp"
                alt="bottles"
                width={400}
                height={410}
              />
            </div>
            <p>*18.9 litres</p>
          </Grid>
        </Grid>
        <Box className={styles.infoBlock}>
          <Grid container spacing={1}>
            <Grid
              className={styles.waterDescription}
              item
              xs={12}
              md={8}
            >
              We deliver Mersini Spring Water, which is bottled at
              source within minutes of leaving the ground, always
              under constant quality control, following strict HACCP
              protocol as well as E.U. specifications.
              <Image
                src={"/table.webp"}
                alt={"chemical_analysis"}
                width={350}
                height={180}
              />
            </Grid>
            <Grid
              className={styles.depositDescription}
              item
              xs={12}
              md={4}
            >
              For the first delivery, we take a deposit for bottles,
              it will be returned if you decide to stop ordering our
              water.
              <span> The deposit for one bottle — is 7 euros.</span>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={styles.formWrapper}>
        <MyForm />
      </Box>
    </main>
  );
}
