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
  console.log(addresses);
  return (
    <>
      {addresses.map((address) => (
        <Box
          key={address?.id}
          className={styles.container}
          onClick={() => emptyOrder && onAddressClick(address)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <span className={styles.subtitles}>
                First and last name *
              </span>{" "}
              {address?.firstAndLast}
            </Grid>

            <Grid item xs={12} md={9} sm={8}>
              <span className={styles.subtitles}>Post index</span>{" "}
              {address?.postalIndex}
            </Grid>
            {!emptyOrder && (
              <Grid
                className={styles.hideToMobile}
                item
                xs={4}
                sm={4}
                md={3}
              >
                <span
                  className={styles.btns}
                  onClick={() => onAddressClick(address)}
                >
                  Order to this address
                </span>
              </Grid>
            )}

            <Grid item xs={12} md={9} sm={8}>
              <span className={styles.subtitles}>
                Delivery address
              </span>{" "}
              {address?.deliveryAddress}
            </Grid>
            <Grid
              className={styles.hideToMobile}
              item
              xs={2}
              sm={3}
              md={3}
            >
              <span
                className={styles.btns}
                onClick={() => deleteAddress(address?.id)}
              >
                Remove
              </span>
            </Grid>

            <Grid className={styles.displayFlex} item xs={12} md={10}>
              <span className={styles.subtitles}>
                Link to your geolocation
              </span>{" "}
              <a href={address?.geolocation} target="_blank">
                {" "}
                <span className={styles.cutString}>
                  {address?.geolocation &&
                  address.geolocation.length > 10
                    ? `${address.geolocation.substring(0, 14)}...`
                    : address.geolocation}
                </span>
                <span className={styles.fullString}>
                  {address?.geolocation}
                </span>
              </a>
            </Grid>

            <Grid className={styles.displayFlex} item xs={12} md={10}>
              <span className={styles.subtitles}>
                Address details
              </span>{" "}
              <span className={styles.cutString}>
                {address?.addressDetails &&
                address.addressDetails.length > 10
                  ? `${address.addressDetails.substring(0, 14)}...`
                  : address.addressDetails}
              </span>
              <span className={styles.fullString}>
                {address?.addressDetails}
              </span>
            </Grid>
          </Grid>
          <Grid container className={styles.mobileButtons}>
            <Grid item xs={6}>
              <span
                className={styles.btns}
                onClick={() => deleteAddress(address?.id)}
              >
                Remove
              </span>
            </Grid>
            {!emptyOrder && (
              <Grid item xs={6}>
                <span
                  className={styles.btns}
                  onClick={() => onAddressClick(address)}
                >
                  Order to this address
                </span>
              </Grid>
            )}
          </Grid>
        </Box>
      ))}
    </>
  );
};
export default SavedData;
