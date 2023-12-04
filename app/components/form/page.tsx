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

const bottleOptions = [
  {
    value: "1",
    label: "(1 bottle - 7€ — available for the first delivery only)",
  },
  { value: "2", label: "(2 bottles - 6€ each = 12€)" },
  { value: "3", label: "(3 bottles - 6€ each = 18€)" },
  { value: "4", label: "(4 bottles - 6€ each = 24€)" },
  { value: "5", label: "(5 bottles - 6€ each = 30€)" },
  { value: "more", label: "(more - add the number below)" },
];

const MyForm = () => {
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

  const onSubmit = async (data: IForm) => {
    try {
      const response = await axios.post(
        "https://sheet.best/api/sheets/e8712774-a547-4ade-ac6c-1ee093cdfad1",
        data
      );

      console.log(response);
      setData(data);
      setShowWindow(true);
      console.log("Form submitted with data:", JSON.stringify(data));
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <span className={styles.inputName}>
            First and last name
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
            Phone number(Cuprys)
          </span>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Phone number in format 97123456"
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
          <span className={styles.inputName}>Post index</span>
          <Controller
            name="postalIndex"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.postalIndex}
                helperText={errors.postalIndex?.message}
              />
            )}
          />
          <span className={styles.inputName}>Delivery address</span>
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
          <span className={styles.inputName}>Address details</span>
          <Controller
            name="addressDetails"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Appart, flat, code"
                fullWidth
                margin="normal"
                error={!!errors.addressDetails}
                helperText={errors.addressDetails?.message}
              />
            )}
          />
          <span className={styles.inputName}>
            Link to geolocation
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
            * follow the link to{" "}
            <Link
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
              }}
              target="_blank"
              href="https://www.google.com/maps"
            >
              Google Maps
            </Link>
            , and choose your house on the map, and copy the link to
            the field above
          </div>
          <br></br>
          <span className={styles.inputName}>
            Do you need a pump? *
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
                  label="manual pump (10€)"
                />
                <FormControlLabel
                  value="not"
                  control={<Radio />}
                  label="don't need"
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
            Number of bottles you want to buy*
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
          <span className={styles.inputName}>Delivery time</span>
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
                  label="9 - 17 — contactless delivery (we will leave bottles near the door)"
                />
                <FormControlLabel
                  value="before"
                  control={<Radio />}
                  label="9 - 12 — personal delivery"
                />
              </RadioGroup>
            )}
          />
          <div>
            <p className={styles.helperText}>
              {errors.deliveryTime?.message}
            </p>
          </div>
          <span className={styles.inputName}>Payment method *</span>
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
                  label="Cash"
                />
                <FormControlLabel
                  value="PAyment ststem"
                  control={<Radio />}
                  label="Revolut (we will send the link via messenger)"
                />
              </RadioGroup>
            )}
          />
          <div>
            <p className={styles.helperText}>
              {errors.paymentMethod?.message}
            </p>
          </div>
          <div className={styles.inputName}>Delivery date</div>
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

          <span className={styles.inputName}>Comments</span>
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
              Make an order
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
