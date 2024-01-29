import useUserOrders from "@/app/utils/getOrdersfromDb";
import { Box, Grid } from "@mui/material";
import styles from "./SavedData.module.css";
const SavedData = () => {
  const { userOrders } = useUserOrders();
  const lastOrder = userOrders[userOrders.length - 1];

  return (
    <Box className={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={10} md={10}>
          <span className={styles.subtitles}>
            First and last name *
          </span>{" "}
          {lastOrder?.firstAndLast}
        </Grid>

        <Grid item xs={10} md={10}>
          <span className={styles.subtitles}>Post index</span>{" "}
          {lastOrder?.postalIndex}
        </Grid>
        <Grid item xs={2} md={2}>
          edit
        </Grid>

        <Grid item xs={10} md={10}>
          <span className={styles.subtitles}>Delivery address</span>{" "}
          {lastOrder?.deliveryAddress}
        </Grid>

        <Grid item xs={10} md={10}>
          <span className={styles.subtitles}>
            Link to your geolocation
          </span>{" "}
          {lastOrder?.geolocation}
        </Grid>

        <Grid item xs={10} md={10}>
          <span className={styles.subtitles}>Address details</span>{" "}
          {lastOrder?.addressDetails}
        </Grid>
      </Grid>
    </Box>
  );
};
export default SavedData;
