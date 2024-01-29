"use client";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RestoreTwoToneIcon from "@mui/icons-material/RestoreTwoTone";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Box,
  Switch,
  Typography,
  CircularProgress,
  ButtonBase,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { schema } from "./schema";
import Link from "next/link";
import styles from "./page.module.css";
import AlertDialog from "../alert/AlertDialog";
import { IForm } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, getCurrentUserId } from "@/app/lib/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  calculatePrice,
  formatPhoneNumber,
} from "@/app/utils/formUtils";
import useUserOrders from "@/app/utils/getOrdersfromDb";
import { v4 as uuidv4 } from "uuid";
import SavedData from "../savedData/SavedData";

const MyForm = () => {
  const { t } = useTranslation("form");
  const { userOrders } = useUserOrders();
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [formattedUserPhone, setFormattedUserPhone] = useState<
    string | null
  >(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [loadingNumber, setLoadingNumber] = useState<boolean>(true);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const phoneNumber = user.phoneNumber;
        setUserPhone(phoneNumber);
        setFormattedUserPhone(formatPhoneNumber(phoneNumber!));
        setLoadingNumber(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const bottlesToBuy = parseInt(watch("bottlesNumberToBuy"), 10) || 0;
  const bottlesToReturn =
    parseInt(watch("bottlesNumberToReturn"), 10) || 0;

  const { paymentForWater, depositForBottles, totalPayments } =
    calculatePrice(bottlesToBuy, bottlesToReturn);
  let paymentText = "Price for 1 bottle";
  let paymentPrice = 0;

  if (bottlesToBuy === 1) {
    paymentText = "Price for 1 bottle";
    paymentPrice = 7;
  } else if (bottlesToBuy >= 2 && bottlesToBuy <= 9) {
    paymentText = `Price for ${bottlesToBuy} bottles`;
    paymentPrice = 6;
  } else if (bottlesToBuy >= 10) {
    paymentText = `Price for ${bottlesToBuy} bottles`;
    paymentPrice = 5.5;
  }
  const onSubmit = async (data: IForm) => {
    setLoadingForm(true);
    try {
      const formatDataBeforeSubmit = (data: IForm) => {
        const date = new Date(data.deliveryDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        return {
          ...data,
          deliveryDate: formattedDate,
          phoneNumber: userPhone,
          pump: data.pump ? "yes" : "no",
          id: uuidv4(),
        };
      };
      const formattedData = formatDataBeforeSubmit(data);
      const userId = getCurrentUserId();

      const orderRef = await addDoc(
        collection(db, "orders"),
        formattedData
      );

      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbyIRDUN_RbC__oKgI6cT6pvh8WKTbZmg9lRn4YBanvry1ULk2nql0znbmp0YRYpyVchPg/exec",
        formattedData,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      if (userId) {
        await updateDoc(doc(db, "users", userId), {
          orders: arrayUnion(orderRef),
        });
      }
      setLoadingForm(false);
      alert("Order created successfully!");
      console.log("Form submitted with data:", JSON.stringify(data));
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4">
        Order for{" "}
        {loadingNumber ? (
          <CircularProgress size={20} />
        ) : (
          formattedUserPhone
        )}
      </Typography>
      <Typography variant="h6" className={styles.titles}>
        Order
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <div className={styles.marginTopBot}>
            {t("number_of_bottles_to_buy")}
          </div>
          <Controller
            name="bottlesNumberToBuy"
            control={control}
            defaultValue="2"
            render={({ field }) => (
              <div className={styles.bottlesButtons}>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = parseInt(field.value) + 1;
                    field.onChange(newValue);
                  }}
                >
                  +
                </button>

                <TextField
                  {...field}
                  type="number"
                  inputProps={{ min: 0 }}
                  error={!!errors.bottlesNumberToBuy}
                />

                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.max(
                      parseInt(field.value) - 1,
                      0
                    );
                    field.onChange(newValue);
                  }}
                >
                  -
                </button>
              </div>
            )}
          />
          <span className={styles.inputErrors}>
            {errors.bottlesNumberToBuy?.message}
          </span>
          <div className={styles.marginTopBot}>
            {t("number_of_bottles_to_return")}
          </div>
          <Controller
            name="bottlesNumberToReturn"
            control={control}
            defaultValue="0"
            render={({ field }) => (
              <div className={styles.bottlesButtons}>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = parseInt(field.value) + 1;
                    field.onChange(newValue);
                  }}
                >
                  +
                </button>

                <TextField
                  {...field}
                  type="number"
                  inputProps={{ min: 0 }}
                  error={!!errors.bottlesNumberToReturn}
                />

                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.max(
                      parseInt(field.value) - 1,
                      0
                    );
                    field.onChange(newValue);
                  }}
                >
                  -
                </button>
              </div>
            )}
          />
          <span className={styles.inputErrors}>
            {errors.bottlesNumberToReturn?.message}
          </span>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className={styles.blueContainer}>
            <p className={styles.marginsTotal}>Total payments</p>
            <div className={styles.marginsTotal}>
              {totalPayments}$
            </div>
            <p className={styles.margins}>
              {" "}
              {paymentText} {paymentPrice}$
            </p>
            <div className={styles.margins}>{paymentForWater}$</div>
            <p className={styles.margins}>Deposite for bottles</p>
            <div className={styles.margins}>{depositForBottles}$</div>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className={styles.ordersHistory}>
            <RestoreTwoToneIcon />
            <ButtonBase onClick={() => setShowWindow(true)}>
              {" "}
              My orders history
            </ButtonBase>
          </div>
        </Grid>
      </Grid>
      <div className={styles.marginTopBot}>
        <Controller
          name="pump"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch {...field} color="primary" />
          )}
        />
        <span className={styles.inputName}>
          {t("do_you_need_pump")}
        </span>
        <div>
          <p className={styles.helperText}>{errors.pump?.message}</p>
        </div>
      </div>
      <Typography variant="h6" className={styles.titles}>
        {" "}
        Delivery date and time
      </Typography>

      <Grid container spacing={2}>
        <Grid
          style={{ display: "flex", justifyContent: "space-between" }}
          item
          xs={12}
        >
          <Box>
            <div className={styles.inputName}>
              {t("delivery_date")}
            </div>
            <div className={styles.datePicker}>
              <Controller
                name="deliveryDate"
                control={control}
                defaultValue={undefined}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
            <div>
              <p className={styles.helperText}>
                {errors.deliveryDate?.message}
              </p>
            </div>
          </Box>
          <Box>
            <span className={styles.inputName}>
              {t("delivery_time")}
            </span>
            <Controller
              name="deliveryTime"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  aria-label="deliveryTime"
                  defaultValue=""
                >
                  <FormControlLabel
                    value="after"
                    control={<Radio />}
                    label={t("delivery_time_9_17")}
                  />
                  <FormControlLabel
                    value="before"
                    control={<Radio />}
                    label={t("delivery_time_9_12")}
                  />
                </RadioGroup>
              )}
            />
            <div>
              <p className={styles.helperText}>
                {errors.deliveryTime?.message}
              </p>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h6" className={styles.titles}>
        Delivery details
      </Typography>
      <SavedData />

      <Grid container spacing={2}>
        <Grid xs={12} md={4} item>
          <span className={styles.inputName}>
            {t("first_and_last")}
          </span>
          <Controller
            name="firstAndLast"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.firstAndLast}
                helperText={errors.firstAndLast?.message}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <span className={styles.inputName}>{t("post_index")}</span>
          <Controller
            name="postalIndex"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                placeholder={t("post_index_placeholder")}
                error={!!errors.postalIndex}
                helperText={errors.postalIndex?.message}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <span className={styles.inputName}>
            {t("delivery_address")}
          </span>
          <Controller
            name="deliveryAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.deliveryAddress}
                helperText={errors.deliveryAddress?.message}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <span className={styles.inputName}>
            {t("geolocation_link")}
          </span>
          <Controller
            name="geolocation"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.geolocation}
                helperText={errors.geolocation?.message}
              />
            )}
          />
          <div>
            {t("follow_the_link")}{" "}
            <Link
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
              }}
              target="_blank"
              href="https://www.google.com/maps"
            >
              {t("google_maps")}
            </Link>
            {t("and_choose")}
          </div>
        </Grid>
        <Grid xs={12} md={4} item>
          <span className={styles.inputName}>
            {t("address_details")}
          </span>
          <Controller
            name="addressDetails"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                placeholder={t("address_placeholder")}
                fullWidth
                margin="normal"
                error={!!errors.addressDetails}
                helperText={errors.addressDetails?.message}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <span className={styles.inputName}>{t("comments")}</span>
          <Controller
            name="comments"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors.comments}
                helperText={errors.comments?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <Typography variant="h6" className={styles.titles}>
        Payment details
      </Typography>
      <span className={styles.inputName}>{t("payment_method")}</span>
      <Controller
        name="paymentMethod"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <RadioGroup
            {...field}
            row
            aria-label="paymentMethod"
            defaultValue=""
          >
            <FormControlLabel
              value="Cash"
              control={<Radio />}
              label={t("cash")}
            />
            <FormControlLabel
              value="PAyment ststem"
              control={<Radio />}
              label={t("revolut")}
            />
          </RadioGroup>
        )}
      />
      <div>
        <p className={styles.helperText}>
          {errors.paymentMethod?.message}
        </p>
      </div>
      {loadingForm && (
        <div className={styles.button}>
          <CircularProgress />
        </div>
      )}
      {!loadingForm && (
        <Box className={styles.button}>
          <Button type="submit" variant="outlined">
            Submit
          </Button>
        </Box>
      )}
      {showWindow && (
        <AlertDialog
          showWindow={showWindow}
          setShowWindow={setShowWindow}
        />
      )}
    </form>
  );
};

export default MyForm;
