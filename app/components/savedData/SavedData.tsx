import { IAddress } from "@/app/lib/definitions";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./SavedData.module.css";

interface Props {
  addresses: IAddress[];
  deleteAddress: (addressId: string | undefined) => Promise<void>;
  onAddressClick: (address: IAddress) => void;
  setShowAddresses: any;
  setAddresses: (updatedAddresses: IAddress[]) => void;
}
const SavedData: React.FC<Props> = ({
  addresses,
  deleteAddress,
  onAddressClick,
  setShowAddresses,
  setAddresses,
}) => {
  const [emptyOrder, setEmptyOrder] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >(undefined);

  const handleAddressClick = (address: IAddress) => {
    setSelectedAddressId(address.id);

    onAddressClick(address);
  };
  const handleDeleteAddress = async (
    addressId: string | undefined
  ) => {
    await deleteAddress(addressId);

    const updatedAddresses = addresses.filter(
      (address) => address.id !== addressId
    );
    setAddresses(updatedAddresses);
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
          <Grid container>
            <Grid item xs={12} sm={9} md={3}>
              <Box>
                <span className={styles.subtitles}>
                  First and last name:
                </span>{" "}
                {address?.firstAndLast}
              </Box>
              <Box>
                <span className={styles.subtitles}>Post index:</span>{" "}
                {address?.postalIndex}
              </Box>
            </Grid>
            <Grid item xs={12} sm={9} md={6}>
              <Box>
                <span className={styles.subtitles}>
                  Delivery address:
                </span>{" "}
                {address?.deliveryAddress}
              </Box>
              <Box>
                <span className={styles.subtitles}>
                  Address details:
                </span>{" "}
                <span className={styles.address}>
                  {address?.addressDetails}
                </span>
              </Box>
              <Box>
                <span className={styles.subtitles}>
                  Link to your geolocation:
                </span>{" "}
                <a
                  className={styles.geolocation}
                  href={address?.geolocation}
                  target="_blank"
                >
                  {" "}
                  {address?.geolocation}
                </a>
              </Box>
            </Grid>
            <Grid
              item
              sm={12}
              xs={12}
              md={3}
              className={styles.buttonsContainer}
            >
              <Box className={styles.hideToMobile}>
                <p
                  className={styles.btns}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.id);
                  }}
                >
                  Remove
                </p>

                {!emptyOrder && (
                  <p
                    className={`${styles.btns} ${
                      selectedAddressId === address.id
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleAddressClick(address)}
                  >
                    Order to this address
                  </p>
                )}
              </Box>
              <Box className={styles.mobileButtons}>
                <span
                  className={styles.btns}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.id);
                  }}
                >
                  Remove
                </span>

                {!emptyOrder && (
                  <span
                    className={`${styles.btns} ${
                      selectedAddressId === address.id
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleAddressClick(address)}
                  >
                    Order to this address
                  </span>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  );
};
export default SavedData;
