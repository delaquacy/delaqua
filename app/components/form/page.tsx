"use client";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { schema } from "./schema";
import Link from "next/link";
import styles from "./page.module.css";
import AlertDialog from "../alert/AlertDialog";
import { IForm } from "@/app/lib/definitions";
import { useState } from "react";
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

const MyForm = () => {
  const { t } = useTranslation("form");
  const bottleOptions = [
    {
      value: "1",
      label: t("number_to_first_delivery"),
    },
    { value: "2", label: `(2 - 6€ ${t("each")} = 12€)` },
    { value: "3", label: `(3 - 6€ ${t("each")} = 18€)` },
    { value: "4", label: `(4 - 6€ ${t("each")} = 24€)` },
    { value: "5", label: `(5 - 6€ ${t("each")} = 30€)` },
    { value: "more", label: t("number_of_bottles_more") },
  ];

  const [data, setData] = useState<IForm | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const createOrder = async () => {
    try {
      const orderRef = await addDoc(collection(db, "orders"), data);
      const userId = getCurrentUserId();
      if (userId) {
        await updateDoc(doc(db, "users", userId), {
          orders: arrayUnion(orderRef),
        });
      }

      console.log("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  const onSubmit = async (data: IForm) => {
    try {
      const formattedData = formatDataBeforeSubmit(data);

      const docRef = await addDoc(
        collection(db, "new_order"),
        formattedData
      );

      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbyIRDUN_RbC__oKgI6cT6pvh8WKTbZmg9lRn4YBanvry1ULk2nql0znbmp0YRYpyVchPg/exec",
        formattedData
      );
      setData(data);

      setShowWindow(true);
      console.log("Form submitted with data:", JSON.stringify(data));
      reset();
    } catch (error) {
      createOrder();
      console.error("Error submitting form:", error);
    }
  };
  const formatDataBeforeSubmit = (data: IForm) => {
    const date = new Date(data.deliveryDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return {
      ...data,
      deliveryDate: formattedDate,
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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
          <span className={styles.inputName}>
            {t("phone_number")}
          </span>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder={t("phone_number_placeholder")}
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
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
          <br></br>
          <span className={styles.inputName}>
            {t("do_you_need_pump")}
          </span>
          <Controller
            name="pump"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup {...field} aria-label="pump">
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label={t("manual_pump")}
                />
                <FormControlLabel
                  value="not"
                  control={<Radio />}
                  label={t("dont_need")}
                />
              </RadioGroup>
            )}
          />
          <div>
            <p className={styles.helperText}>
              {errors.pump?.message}
            </p>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <span className={styles.inputName}>
            {t("number_of_bottles")}
          </span>
          <Controller
            name="bottlesNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup {...field} aria-label="bottlesNumber">
                {bottleOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <div>
            <p className={styles.helperText}>
              {errors.bottlesNumber?.message}
            </p>
          </div>
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
                row
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
          <span className={styles.inputName}>
            {t("payment_method")}
          </span>
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
          <div className={styles.inputName}>{t("delivery_date")}</div>
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
          <Box className={styles.button}>
            <Button type="submit" variant="outlined">
              {t("submit_button")}
            </Button>
          </Box>
        </Grid>
        {showWindow && (
          <AlertDialog
            data={data}
            showWindow={showWindow}
            setShowWindow={setShowWindow}
          />
        )}
      </Grid>
    </form>
  );
};

export default MyForm;
