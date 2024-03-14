import { IAddress } from "@/app/lib/definitions";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./SavedData.module.css";

interface Props {
  addresses: IAddress[];
  deleteAddress: (addressId: string | undefined) => Promise<void>;
  onAddressClick: (address: IAddress) => void;
  setShowAddresses: any;
}
const SavedData: React.FC<Props> = ({
  addresses,
  deleteAddress,
  onAddressClick,
  setShowAddresses,
}) => {
  const [emptyOrder, setEmptyOrder] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >(undefined);
  const handleAddressClick = (address: IAddress) => {
    setSelectedAddressId(address.id);
    onAddressClick(address);
  };
  useEffect(() => {
    if (addresses && addresses.length === 0) {
      setShowAddresses(false);
    }
  }, [addresses]);

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
          className={`${styles.container} ${
            selectedAddressId === address.id ? styles.selected : ""
          }`}
          onClick={() => emptyOrder && handleAddressClick(address)}
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
                  onClick={() => handleAddressClick(address)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAddress(address?.id);
                }}
              >
                Remove
              </span>
            </Grid>

            <Grid className={styles.displayFlex} item xs={12} md={10}>
              <span className={styles.subtitles}>
                Link to your geolocation
              </span>{" "}
              <a
                className={styles.geolocation}
                href={address?.geolocation}
                target="_blank"
              >
                {" "}
                {address?.geolocation}
              </a>
            </Grid>

            <Grid className={styles.displayFlex} item xs={12} md={10}>
              <span className={styles.subtitles}>
                Address details
              </span>{" "}
              <span className={styles.address}>
                {address?.addressDetails}
              </span>
            </Grid>
          </Grid>
          <Grid container className={styles.mobileButtons}>
            <Grid item xs={6}>
              <span
                className={styles.btns}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAddress(address?.id);
                }}
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
