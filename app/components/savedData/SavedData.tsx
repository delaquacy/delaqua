import { IAddress } from "@/app/lib/definitions";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./SavedData.module.css";

interface Props {
  addresses: IAddress[];
  deleteAddress: any;
  onAddressClick: any;
}
const SavedData: React.FC<Props> = ({
  addresses,
  deleteAddress,
  onAddressClick,
}) => {
  const [emptyOrder, setEmptyOrder] = useState(true);
  useEffect(() => {
    if (addresses && addresses.length !== 1) {
      setEmptyOrder(false);
    } else {
      setEmptyOrder(true);
    }
  }, [addresses]);
  return (
    <>
      {addresses.map((address) => (
        <Box
          key={address?.id}
          className={styles.container}
          onClick={() => emptyOrder && onAddressClick(address)}
        >
          <Grid container spacing={2}>
            <Grid item xs={10} md={10}>
              <span className={styles.subtitles}>
                First and last name *
              </span>{" "}
              {address?.firstAndLast}
            </Grid>

            <Grid item xs={10} md={10}>
              <span className={styles.subtitles}>Post index</span>{" "}
              {address?.postalIndex}
            </Grid>
            {!emptyOrder && (
              <Grid item xs={2} md={2}>
                <span
                  className={styles.btns}
                  onClick={() => onAddressClick(address)}
                >
                  Order to this address
                </span>
              </Grid>
            )}

            <Grid item xs={10} md={10}>
              <span className={styles.subtitles}>
                Delivery address
              </span>{" "}
              {address?.deliveryAddress}
            </Grid>
            <Grid item xs={2} md={2}>
              <span
                className={styles.btns}
                onClick={() => deleteAddress(address?.id)}
              >
                Remove
              </span>
            </Grid>

            <Grid item xs={10} md={10}>
              <span className={styles.subtitles}>
                Link to your geolocation
              </span>{" "}
              {address?.geolocation}
            </Grid>

            <Grid item xs={10} md={10}>
              <span className={styles.subtitles}>
                Address details
              </span>{" "}
              {address?.addressDetails}
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  );
};
export default SavedData;
