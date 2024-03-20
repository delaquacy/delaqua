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
  Skeleton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { schema } from "./schema";
import Link from "next/link";
import styles from "./page.module.css";
import AlertDialog from "../alert/AlertDialog";
import { AddressKey, IForm } from "@/app/lib/definitions";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, getCurrentUserId } from "@/app/lib/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  bottlesCalculate,
  calculatePrice,
  formatPhoneNumber,
  formattedDateTime,
} from "@/app/utils/formUtils";
import { v4 as uuidv4 } from "uuid";
import SavedData from "../savedData/SavedData";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import {
  getNumberOfBottlesFromDB,
  updateNumberOfBottlesInDB,
} from "@/app/utils/getBottlesNumber";
import {
  requestToReturnFailStatus,
  requestToReturnSuccessStatus,
} from "@/app/utils/webhoooks";
import dayjs, { Dayjs } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { fetchAddresses, fetchOrders } from "@/app/utils/addressApi";
import BasicModal from "../OrderCreated/OrderCreated";

const MyForm = () => {
  const { t } = useTranslation("form");
  // show orders history
  const [showWindow, setShowWindow] = useState<boolean>(false);
  // phone with spacing
  const [formattedUserPhone, setFormattedUserPhone] = useState<
    string | null
  >(null);
  // phone without spacing
  const [userPhone, setUserPhone] = useState<string | null>(null);
  // submit form
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  // loading number from db to render him
  const [loadingNumber, setLoadingNumber] = useState<boolean>(true);
  // address array
  const [addresses, setAddresses] = useState<any>([]);
  // show saved addresses or show inputs
  const [showAddresses, setShowAddresses] = useState<boolean>(false);
  // remove address from addresses array
  const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
  // wait orders loading
  const [ordersLoaded, setOrdersLoaded] = useState<boolean>(true);
  const [orders, setOrders] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfBottlesInStock, setNumberOfBottlesInStock] =
    useState<number>(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const phoneNumber = user.phoneNumber;
        setUserPhone(phoneNumber);
        setFormattedUserPhone(formatPhoneNumber(phoneNumber!));
        setLoadingNumber(false);
        try {
          const userId = await getCurrentUserId();

          if (userId) {
            const addressesData = await fetchAddresses(userId);
            const ordersData = await fetchOrders(userId);

            setOrders(ordersData);
            setAddresses(addressesData);
            setOrdersLoaded(false);
            setIsLoading(false);
            setShowAddresses(addressesData.length >= 1);
          } else {
            console.error("User not authenticated!");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [removeTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getCurrentUserId();
        if (userId) {
          const numberOfBottlesFromDB =
            await getNumberOfBottlesFromDB(userId);
          setNumberOfBottlesInStock(numberOfBottlesFromDB);
        } else {
          console.error("User not authenticated!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userPhone]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (orders) {
      setValue("bottlesNumberToBuy", orders.length > 0 ? 2 : 2);
      setValue("pump", orders.length > 0 ? false : true);
    }
  }, [orders, ordersLoaded]);

  const bottlesToBuy = watch("bottlesNumberToBuy") || 0;
  const notSelectAddress = watch("deliveryAddress");
  const pompStatus = watch(["pump"]);
  const addressFields = watch([
    "firstAndLast",
    "postalIndex",
    "deliveryAddress",
    "geolocation",
    "addressDetails",
  ]);
  const allFieldsFilled = addressFields.every(
    (field) => field !== ""
  );

  const addressObject: Record<
    AddressKey,
    string | boolean | undefined
  > = addressFields.reduce((acc, field, index) => {
    const keys: AddressKey[] = [
      "firstAndLast",
      "postalIndex",
      "deliveryAddress",
      "geolocation",
      "addressDetails",
    ];
    const fieldKey = keys[index];
    acc[fieldKey] = field;
    return acc;
  }, {} as Record<AddressKey, string | boolean | undefined>);

  const pompValue = pompStatus[0];

  const [pomp, setPomp] = useState<any>("");
  const [paymentForWater, setPaymentForWater] = useState(0);
  const [depositForBottles, setDepositForBottles] = useState(0);
  const [totalPayments, setTotalPayments] = useState<any>(0);
  const [pompNumber, setPompNumber] = useState(0);
  const [priceForDifferentBottles, setPriceForDifferentBottles] =
    useState(0);
  const [paymentText, setPaymentText] = useState(
    `${t("price_for_one_bottle")}`
  );
  useEffect(() => {
    const bottlesNumberToReturn = watch("bottlesNumberToReturn") || 0;
    setPomp(pompValue);

    const {
      paymentForWater,
      depositForBottles,
      totalPayments,
      pompNumber,
    } = calculatePrice(
      bottlesToBuy,
      bottlesNumberToReturn,
      pompValue
    );

    setPaymentForWater(paymentForWater);
    setDepositForBottles(depositForBottles);
    setTotalPayments(totalPayments);
    setPompNumber(pompNumber);

    let newPaymentText = `${t("price_for_one_bottle")}`;
    let newPaymentPrice = 0;
    if (bottlesToBuy === 1) {
      newPaymentText = `${t("price_for_one_bottle")}`;
      newPaymentPrice = 7;
    } else if (bottlesToBuy >= 2 && bottlesToBuy <= 9) {
      newPaymentText = `${t("price_for_bottles", {
        count: bottlesToBuy,
      })}`;
      newPaymentPrice = 6;
    } else if (bottlesToBuy >= 10) {
      newPaymentText = `${t("price_for_bottles", {
        count: bottlesToBuy,
      })}`;
      newPaymentPrice = 5.5;
    }
    setPriceForDifferentBottles(newPaymentPrice);
    setPaymentText(newPaymentText);
  }, [bottlesToBuy, watch, addressFields, pomp, addresses]);
  const [cashPaymentTrigger, setCashPaymentTrigger] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<any>();

  const onSubmit = async (data: IForm) => {
    setLoadingForm(true);
    try {
      const formatDataBeforeSubmit = (data: IForm) => {
        const date = data.deliveryDate;
        const deliveryDate = new Date(date);
        const formattedDate = `${deliveryDate.getDate()}.${
          deliveryDate.getMonth() + 1
        }.${deliveryDate.getFullYear()}`;
        return {
          ...data,
          deliveryDate: formattedDate,
          phoneNumber: userPhone,
          pump: data.pump ? "yes" : "no",
          id: uuidv4(),
          createdAt: serverTimestamp(),
        };
      };
      setDeliveryDate(data.deliveryDate);
      const formattedData = formatDataBeforeSubmit(data);
      const userId = getCurrentUserId();

      const orderRef = await addDoc(
        collection(db, `users/${userId}/orders`),
        formattedData
      );

      let currentOrderId = orderRef.id;

      bottlesCalculate(
        data.bottlesNumberToBuy,
        data.bottlesNumberToReturn,
        numberOfBottlesInStock
      );
      updateNumberOfBottlesInDB(
        bottlesCalculate(
          data.bottlesNumberToBuy,
          data.bottlesNumberToReturn,
          numberOfBottlesInStock
        )
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
      const formatPhoneNumber = userPhone?.replace(/\+/g, "");
      if (data.paymentMethod === "Online") {
        await handleSubmited(
          totalPayments,
          formatPhoneNumber,
          formattedDateTime,
          currentOrderId
        );
      }
      if (data.paymentMethod === "Cash") {
        setCashPaymentTrigger(true);
      }
      setLoadingForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const [createAddressSuccess, setCreateAddressSuccess] =
    useState(false);
  const createAddress = async (addressObject: any) => {
    try {
      const userId = getCurrentUserId();

      if (userId) {
        await addDoc(
          collection(db, `users/${userId}/addresses`),
          addressObject
        );
        setCreateAddressSuccess(true);
        setValue("deliveryAddress", "");
        setValue("postalIndex", "");
        setValue("addressDetails", "");
        setValue("geolocation", "");
        setValue("firstAndLast", "");
      } else {
        console.error("User not authenticated!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deleteAddress = async (addressId: string | undefined) => {
    try {
      const userId = getCurrentUserId();

      if (userId) {
        const addressRef = doc(
          db,
          `users/${userId}/addresses/${addressId}`
        );
        await deleteDoc(addressRef);
        setRemoveTrigger(true);
        enqueueSnackbar(`${t("address_delete_successfully")}`, {
          variant: "info",
        });
      } else {
        console.error("User not authenticated!");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleAddressClick = (address: any) => {
    setValue("deliveryAddress", address.deliveryAddress);
    setValue("postalIndex", address.postalIndex);
    setValue("addressDetails", address.addressDetails);
    setValue("geolocation", address.geolocation);
    setValue("firstAndLast", address.firstAndLast);
  };
  const [onlinePaymentTrigger, setOnlinePaymentTrigger] =
    useState(false);

  const [url, setUrl] = useState<string | undefined>("");
  const handleSubmited = async (
    amount: number,
    phoneNumber: string | undefined,
    dataAndTime: string,
    orderIdFromDB: string
  ) => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "EUR",
          description: `${phoneNumber} ${dataAndTime}`,
        }),
      });
      const data = await response.json();
      const formatPhoneNumber = userPhone?.replace(/\+/g, "");
      await axios.post(
        "https://script.google.com/macros/s/AKfycbz2IdNKqrkMPE9c7SFnBRp4A-rqP2MLIlaHqjabq_yf_1muCtol5nzWLtKSj6MmdNddjQ/exec",
        {
          userPhone: formatPhoneNumber,
          amount: amount,
          orderId: data.id,
          description: phoneNumber + dataAndTime,
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      const userId = getCurrentUserId();
      const orderRef = doc(
        db,
        `users/${userId}/orders/${orderIdFromDB}`
      );
      await updateDoc(orderRef, { paymentId: data.id });

      const paymentRef = doc(db, `payments/${data.id}`);
      await setDoc(paymentRef, {
        userId: userId,
        number: phoneNumber,
        amount: amount,
      });

      setUrl(data.checkout_url);
      setOnlinePaymentTrigger(true);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
    }
  };

  useEffect(() => {
    requestToReturnSuccessStatus();
    requestToReturnFailStatus();
  }, []);
  // const result = async (orderId: string) => {
  //   try {
  //     const response = await fetch(`/api/back/${orderId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const nest = await response.json();
  //     console.log("Back", nest);
  //   } catch (error) {
  //     console.error("Ошибка при получении данных о заказе:", error);
  //   }
  // };
  // datepicker settings (hide saturday, week starts from monday)
  const selectedDate = watch("deliveryDate");
  const showMessage = useMemo(() => {
    if (!selectedDate) {
      return false;
    }

    const now = dayjs();
    const noon = now.startOf("day").add(12, "hours");
    const watchedDate = dayjs(selectedDate);

    return now.isSame(watchedDate, "day") && now.isAfter(noon);
  }, [selectedDate]);

  const isWeekend = (date: Dayjs) => {
    const day = date.day();
    return day === 0;
  };
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });
  const dayOfWeekFormatter = (dayOfWeek: string, date: Date) => {
    const formattedDay = dayjs(date).format("dd");
    return formattedDay.toUpperCase();
  };

  useEffect(() => {
    if (!addresses) {
      setShowAddresses(false);
    }
  }, [deleteAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getCurrentUserId();
        if (userId) {
          const addressesData = await fetchAddresses(userId);
          setAddresses(addressesData);
          if (addressesData) {
            setShowAddresses(true);
          }
        } else {
          console.error("User not authenticated!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [createAddressSuccess]);
  const addNewAddress = () => {
    setCreateAddressSuccess(false);
    createAddress(addressObject);
  };
  const emptyAddress = () => {
    if (!notSelectAddress) {
      enqueueSnackbar(`${t("select_address")}`, {
        variant: "error",
      });
    }
  };
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      autoHideDuration={1500}
    >
      {onlinePaymentTrigger && (
        <Box className={styles.displayNone}>
          <BasicModal
            method="online"
            url={url}
            bottlesNumber={bottlesToBuy}
            deliveryDate={deliveryDate}
            isOpen={onlinePaymentTrigger}
            onClose={() => setOnlinePaymentTrigger(false)}
          />
        </Box>
      )}
      {cashPaymentTrigger && (
        <Box className={styles.displayNone}>
          <BasicModal
            method="cash"
            amount={totalPayments}
            bottlesNumber={bottlesToBuy}
            deliveryDate={deliveryDate}
            isOpen={cashPaymentTrigger}
            onClose={() => setCashPaymentTrigger(false)}
          />
        </Box>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.phoneNumber}>
          {t("order_for")}{" "}
          {loadingNumber ? (
            <span className={styles.skeletonText}>
              <Skeleton
                style={{ transformOrigin: "0 0" }}
                variant="text"
                animation="wave"
                width={220}
                height={45}
              />
            </span>
          ) : (
            formattedUserPhone
          )}
        </h1>
        <h6 className={styles.titles}>{""}</h6>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <div className={styles.marginTopBot}>
              {t("number_of_bottles_to_buy")}
            </div>

            <Controller
              name="bottlesNumberToBuy"
              control={control}
              render={({ field }) => (
                <div className={styles.bottlesButtons}>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(
                        field.value - 1,
                        orders.length > 0 ? 2 : 1
                      );
                      field.onChange(newValue);
                    }}
                  >
                    -
                  </button>
                  {ordersLoaded ? (
                    <div className={styles.skeletonBottles}>
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={35}
                        height={25}
                      />
                    </div>
                  ) : (
                    <TextField
                      {...field}
                      type="number"
                      InputProps={{
                        readOnly: true,
                      }}
                      error={!!errors.bottlesNumberToBuy}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(
                        field.value + 1,
                        orders.length > 0 ? 2 : 1
                      );
                      field.onChange(newValue);
                    }}
                  >
                    +
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
              defaultValue={0}
              render={({ field }) => (
                <div className={styles.bottlesButtons}>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(field.value - 1, 0);
                      field.onChange(newValue);
                    }}
                  >
                    -
                  </button>
                  {ordersLoaded ? (
                    <div className={styles.skeletonBottles}>
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={35}
                        height={25}
                      />
                    </div>
                  ) : (
                    <TextField
                      {...field}
                      type="number"
                      InputProps={{
                        readOnly: true,
                        inputProps: {
                          min: 0,
                          max:
                            numberOfBottlesInStock > 0
                              ? numberOfBottlesInStock
                              : 10,
                        },
                      }}
                      error={!!errors.bottlesNumberToReturn}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.min(
                        field.value + 1,
                        numberOfBottlesInStock > 0
                          ? numberOfBottlesInStock
                          : 0
                      );
                      field.onChange(newValue);
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            />
            <span className={styles.inputErrors}>
              {errors.bottlesNumberToReturn?.message}
            </span>
            <div className={styles.marginTopBot}>
              <Controller
                name="pump"
                control={control}
                render={({ field }) => (
                  <>
                    {ordersLoaded ? (
                      <span className={styles.skeletonText}>
                        <Skeleton
                          style={{ transformOrigin: "0 0" }}
                          variant="text"
                          animation="wave"
                          width={35}
                          height={30}
                        />
                      </span>
                    ) : (
                      <Switch
                        {...field}
                        color="primary"
                        checked={field.value || false}
                      />
                    )}
                  </>
                )}
              />
              <span className={styles.inputName}>
                {t("do_you_need_pump")}
              </span>
              <div>
                <p className={styles.helperText}>
                  {errors.pump?.message}
                </p>
              </div>
            </div>
          </Grid>
          {ordersLoaded ? (
            <Grid item xs={12} md={4}>
              <Skeleton
                style={{ transformOrigin: "0 0" }}
                width={350}
                height="20em"
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <div className={styles.blueContainer}>
                <p className={styles.marginsTotal}>
                  {t("total_payments")}
                </p>
                <div className={styles.marginsTotal}>
                  {totalPayments} €
                </div>
                <br></br>
                <p className={styles.margins}>
                  {" "}
                  {paymentText} {priceForDifferentBottles} € :{" "}
                  {paymentForWater} €{" "}
                </p>

                <p className={styles.margins}>
                  {t("deposit_for_bottles")} {depositForBottles} €
                </p>

                <p className={styles.margins}>
                  {t("pump")} {pompNumber} €
                </p>
              </div>
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <div className={styles.ordersHistory}>
              <RestoreTwoToneIcon />
              <ButtonBase onClick={() => setShowWindow(true)}>
                {" "}
                {t("orders_history")}
              </ButtonBase>
            </div>
          </Grid>
        </Grid>

        <Typography variant="h6" className={styles.titles}>
          {" "}
          {t("delivery_date_and_time")}
        </Typography>

        <Grid
          container
          spacing={2}
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid xs={12} md={4} item>
            <Box>
              <div className={styles.inputName}>
                {t("delivery_date")}{" "}
                <span className={styles.redStar}>*</span>
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
                        disablePast
                        dayOfWeekFormatter={dayOfWeekFormatter}
                        //@ts-ignore
                        shouldDisableDate={(date: Dayjs) =>
                          isWeekend(date)
                        }
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </div>
              <div>
                {showMessage && (
                  <p className={styles.helperText}>
                    {t("delivery_soonest_day", {
                      day: dayjs().add(1, "day").format("dddd"),
                    })}
                    , {t("delivery_please_change_day")}
                  </p>
                )}
                <p className={styles.helperText}>
                  {errors.deliveryDate?.message}
                </p>
              </div>
            </Box>
          </Grid>
          <Grid xs={12} md={6} item>
            <Box>
              <span className={styles.inputName}>
                {t("delivery_time")}{" "}
                <span className={styles.redStar}>*</span>
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
                      value="9-17"
                      control={<Radio />}
                      label={t("delivery_time_9_17")}
                    />
                    <FormControlLabel
                      value="9-12"
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
          {t("delivery_details")}
        </Typography>
        {isLoading ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Skeleton variant="text" width="100%" height={200} />
            </Grid>
          </Grid>
        ) : !showAddresses ? (
          <Grid container spacing={2}>
            <Grid xs={12} md={4} item>
              <span className={styles.inputName}>
                {t("first_and_last")}{" "}
                <span className={styles.redStar}>*</span>
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
                    placeholder="John Smith"
                    error={!!errors.firstAndLast}
                    helperText={errors.firstAndLast?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} md={4} item>
              <span className={styles.inputName}>
                {t("post_index")}{" "}
                <span className={styles.redStar}>*</span>
              </span>
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
                {t("delivery_address")}{" "}
                <span className={styles.redStar}>*</span>
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
                    placeholder={t("delivery_address_placeholder")}
                    error={!!errors.deliveryAddress}
                    helperText={errors.deliveryAddress?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} md={4} item>
              <span className={styles.inputName}>
                {t("geolocation_link")}{" "}
                <span className={styles.redStar}>*</span>
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
                    placeholder="https://maps.app.goo.gl/example"
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
                {t("address_details")}{" "}
                <span className={styles.redStar}>*</span>
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
              <span className={styles.inputName}>
                {t("comments")}
              </span>
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
                    placeholder={t("comments_placeholder")}
                    variant="outlined"
                    margin="normal"
                    error={!!errors.comments}
                    helperText={errors.comments?.message}
                  />
                )}
              />
              {allFieldsFilled && (
                <Button variant="contained" onClick={addNewAddress}>
                  {t("save_address_details")}
                </Button>
              )}
            </Grid>
          </Grid>
        ) : (
          <>
            <SavedData
              addresses={addresses}
              setShowAddresses={setShowAddresses}
              deleteAddress={deleteAddress}
              onAddressClick={handleAddressClick}
              setAddresses={setAddresses}
            />
            <Box className={styles.addNewAddress}>
              <a onClick={() => setShowAddresses(false)}>
                {t("add_new_address")}
              </a>
            </Box>

            <Grid container>
              <Grid xs={12} md={4} item>
                <span className={styles.inputName}>
                  {t("comments")}
                </span>
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
                      placeholder={t("comments_placeholder")}
                      variant="outlined"
                      margin="normal"
                      error={!!errors.comments}
                      helperText={errors.comments?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </>
        )}

        <Typography variant="h6" className={styles.titles}>
          {t("payment_method")}
        </Typography>

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
                value="Online"
                control={<Radio />}
                label={t("online")}
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
            <Button
              onClick={emptyAddress}
              type="submit"
              variant="contained"
            >
              {t("submit_order")}
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
    </SnackbarProvider>
  );
};

export default MyForm;
