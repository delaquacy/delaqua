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
  Tooltip,
} from "@mui/material";
import Alert from "@mui/material/Alert";
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
  doc,
  getDoc,
  increment,
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
  getNumberOfBottlesFromDBAddresses,
  updateNumberOfBottlesInDB,
} from "@/app/utils/getBottlesNumber";
import { requestGeneral } from "@/app/utils/webhoooks";
import dayjs, { Dayjs } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import {
  fetchAddresses,
  fetchOrders,
  fetchUserNumber,
} from "@/app/utils/addressApi";
import CloseIcon from "@mui/icons-material/Close";
import { ModalRemoveAddress } from "../ModalRemoveAddress/ModalRemoveAddress";
import { RegisterButton } from "../registerComponent/RegisterButton";
import BasicModal from "../OrderCreated/OrderCreated";
import "dayjs/locale/uk";
import "dayjs/locale/el";
import "dayjs/locale/ru";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import useDatesFromDB from "@/app/utils/getUnableDates";

const MyForm = () => {
  const { t, i18n } = useTranslation("form");

  // show orders history
  const [showWindow, setShowWindow] = useState<boolean>(false);
  // phone with spacing
  const [formattedUserPhone, setFormattedUserPhone] = useState<string | null>(
    null
  );
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
  const [userUniqId, setUserUniqId] = useState(null);
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const disabledDates = useDatesFromDB();

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
            const userUniqId = await fetchUserNumber(userId);

            setOrders(ordersData);
            setAddresses(addressesData);
            setUserUniqId(userUniqId);
            setOrdersLoaded(false);
            setIsLoading(false);
            setShowAddresses(addressesData.length >= 1);
          } else {
            console.error("");
          }
        } catch (error) {
          console.error("Error fetching:", error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [removeTrigger]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      const sortedOrders = orders.sort(
        (a: { createdAt: any }, b: { createdAt: any }) =>
          a.createdAt - b.createdAt
      );

      const lastOrder = sortedOrders[orders.length - 1];
      const defaultBottlesToBuy =
        lastOrder.bottlesNumberToBuy === undefined ||
        lastOrder.bottlesNumberToBuy < 2
          ? 2
          : lastOrder.bottlesNumberToBuy;

      setValue("bottlesNumberToBuy", defaultBottlesToBuy);
      setValue("bottlesNumberToReturn", lastOrder.bottlesNumberToReturn || 0);
      setValue("pump", false);
    } else {
      setValue("bottlesNumberToBuy", 2);
      setValue("bottlesNumberToReturn", 0);
      setValue("pump", true);
    }
  }, [orders, ordersLoaded]);

  const bottlesToBuy = watch("bottlesNumberToBuy") || 0;
  const notSelectAddress = watch("addressDetails");
  const notSelectName = watch("firstAndLast");
  const pompStatus = watch(["pump"]);
  const addressFields = watch([
    "firstAndLast",
    "postalIndex",
    "deliveryAddress",
    "geolocation",

    "addressDetails",
  ]);
  const allFieldsFilled = addressFields.every((field) => field !== "");

  const addressObject: Record<AddressKey, string | boolean | undefined> =
    addressFields.reduce((acc, field, index) => {
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
  const [priceForDifferentBottles, setPriceForDifferentBottles] = useState(0);
  const [paymentText, setPaymentText] = useState(
    `${t("price_for_one_bottle")}`
  );

  const paymentMethod = watch("paymentMethod");
  const [usedBottlesMessage, setUsedBottlesMessage] = useState(false);
  const firstBottlesReturn = watch("bottlesNumberToReturn");
  useEffect(() => {
    if (orders.length === 0 && firstBottlesReturn !== 0) {
      setUsedBottlesMessage(true);
    } else {
      setUsedBottlesMessage(false);
    }
  }, [firstBottlesReturn, orders]);

  useEffect(() => {
    const bottlesNumberToReturn = watch("bottlesNumberToReturn") || 0;

    setPomp(pompValue);

    const { paymentForWater, depositForBottles, totalPayments, pompNumber } =
      calculatePrice(bottlesToBuy, bottlesNumberToReturn, pompValue);

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
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const onSubmit = async (data: IForm) => {
    setLoadingForm(true);
    trackAmplitudeEvent("submitOrder", {
      text: "On submit click",
    });
    try {
      setSubmitAttempted(false);
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
          bottlesNumberToReturn:
            data.bottlesNumberToReturn == 0 ? "0" : data.bottlesNumberToReturn,
          pump: data.pump ? "yes" : "no",
          id: uuidv4(),
          createdAt: serverTimestamp(),
          useId: userUniqId,
          priceOfWater: paymentForWater,
          depositForBottles: depositForBottles == 0 ? "0" : depositForBottles,
          totalPayments: totalPayments,
          pumpPrice: data.pump == false ? "0" : "10",
          numberOfBottlesAtThisAddress:
            numberOfBottlesInStock !== undefined && numberOfBottlesInStock != 0
              ? numberOfBottlesInStock
              : "0",
        };
      };

      setDeliveryDate(data.deliveryDate);
      const formattedData = formatDataBeforeSubmit(data);
      const userId = getCurrentUserId();

      const orderRef = await addDoc(
        collection(db, `users/${userId}/orders`),
        formattedData
      );
      if (data.paymentMethod === "Cash") {
        setCashPaymentTrigger(true);
        setLoadingForm(false);
      }

      let currentOrderId = orderRef.id;
      const bottleNumber = bottlesCalculate(
        data.bottlesNumberToBuy,
        data.bottlesNumberToReturn,
        numberOfBottlesInStock
      );
      if (
        (!orders || orders.length === 0) &&
        (!addresses || addresses.length === 0)
      ) {
        const enrichedAddressObject = {
          ...addressObject,
          numberOfBottles: data.bottlesNumberToBuy,
        };

        createAddress(enrichedAddressObject);
      }
      if (addresses.length > 1 && !showAddresses && allFieldsFilled) {
        const enrichedAddressObject = {
          ...addressObject,
          numberOfBottles: data.bottlesNumberToBuy,
        };

        createAddress(enrichedAddressObject);
      }

      if (numberOfBottlesInStock === 0 || numberOfBottlesInStock == undefined) {
        updateNumberOfBottlesInDB(data.bottlesNumberToBuy, addressId);
      } else {
        updateNumberOfBottlesInDB(bottleNumber, addressId);
      }
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ORDERS_SHEET_LINK as string,
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
      setLoadingForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleError = () => {
    setSubmitAttempted(true);
  };

  const [createAddressSuccess, setCreateAddressSuccess] = useState(false);

  const [addressId, setAddressId] = useState<string>("");

  const createAddress = async (addressObject: any) => {
    try {
      const userId = getCurrentUserId();

      if (userId) {
        const userDocRef = doc(db, `users/${userId}`);
        const userDocSnapshot = await getDoc(userDocRef);

        let generalNumberOfBottles = 0;
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          generalNumberOfBottles = userData.generalNumberOfBottles || 0;
        }
        let updatedAddressObject;
        if (
          (!orders || orders.length === 0) &&
          (!addresses || addresses.length === 0)
        ) {
          updatedAddressObject = {
            ...addressObject,
            archived: false,
            createdAt: serverTimestamp(),
          };
        } else {
          updatedAddressObject = {
            ...addressObject,
            archived: false,
            createdAt: serverTimestamp(),
            numberOfBottles: generalNumberOfBottles,
          };
        }
        if (addresses.length > 1 && !showAddresses && allFieldsFilled) {
          updatedAddressObject = {
            ...addressObject,
            archived: false,
            createdAt: serverTimestamp(),
          };
        }

        if (addresses.length > 1 && !showAddresses) {
          updatedAddressObject = {
            ...addressObject,
            archived: false,
            createdAt: serverTimestamp(),
            numberOfBottles: generalNumberOfBottles,
          };
        }

        await addDoc(
          collection(db, `users/${userId}/addresses`),
          updatedAddressObject
        );

        if (generalNumberOfBottles > 0) {
          await updateDoc(userDocRef, {
            generalNumberOfBottles: 0,
          });
        }

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);
  const askUserAboutTransfer = (addressId: string) => {
    setCurrentAddressId(addressId);
    setIsModalOpen(true);
  };
  const handleConfirm = async () => {
    if (!currentAddressId) return;

    setIsModalOpen(false);
    await transferBottlesToLastAddress(currentAddressId);
    const userId = await getCurrentUserId();
    if (userId) {
      const addressesData = await fetchAddresses(userId);
      setAddresses(addressesData);
    }
    setCurrentAddressId(null);
  };
  const handleDecline = async () => {
    if (!currentAddressId) return;

    setIsModalOpen(false);
    await deleteAddressAndMoveBottles(currentAddressId);

    setCurrentAddressId(null);
  };
  const deleteAddress = async (addressId: any) => {
    if (addresses.length > 1) {
      askUserAboutTransfer(addressId);
    } else {
      await deleteAddressAndMoveBottles(addressId);
    }
  };
  const deleteAddressAndMoveBottles = async (addressId: string | undefined) => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const addressRef = doc(db, `users/${userId}/addresses/${addressId}`);
    const addressDoc = await getDoc(addressRef);
    if (!addressDoc.exists()) return;

    const addressData = addressDoc.data();
    const numberOfBottles = addressData.numberOfBottles || 0;

    const userDocRef = doc(db, `users/${userId}`);
    await updateDoc(userDocRef, {
      generalNumberOfBottles: increment(numberOfBottles),
    });
    await updateDoc(addressRef, {
      archived: true,
      numberOfBottles: 0,
    });
    setRemoveTrigger(true);
    enqueueSnackbar(`${t("address_delete_successfully")}`, {
      variant: "info",
    });
  };

  const transferBottlesToLastAddress = async (
    sourceAddressId: string | undefined
  ) => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const sortedAddresses = addresses.sort(
      (a: { createdAt: number }, b: { createdAt: number }) =>
        b.createdAt - a.createdAt
    );
    const lastAddress = sortedAddresses.find(
      (address: { id: string | undefined }) => address.id !== sourceAddressId
    );
    if (!lastAddress) return;

    const sourceAddressRef = doc(
      db,
      `users/${userId}/addresses/${sourceAddressId}`
    );
    const sourceAddressDoc = await getDoc(sourceAddressRef);
    if (!sourceAddressDoc.exists()) return;
    const sourceAddressData = sourceAddressDoc.data();

    const targetAddressRef = doc(
      db,
      `users/${userId}/addresses/${lastAddress.id}`
    );
    await updateDoc(targetAddressRef, {
      numberOfBottles: increment(sourceAddressData.numberOfBottles || 0),
    });

    await updateDoc(sourceAddressRef, {
      archived: true,
      numberOfBottles: 0,
    });
  };

  const handleAddressClick = (address: any) => {
    setAddressId(address.id);
    setValue("deliveryAddress", address.deliveryAddress);
    setValue("postalIndex", address.postalIndex);
    setValue("addressDetails", address.addressDetails);
    setValue("geolocation", address.geolocation);
    setValue("firstAndLast", address.firstAndLast);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getCurrentUserId();
        if (userId && addressId.trim() !== "") {
          const numberOfBottlesFromDB = await getNumberOfBottlesFromDBAddresses(
            userId,
            addressId
          );
          setNumberOfBottlesInStock(numberOfBottlesFromDB);
        } else {
          console.error("User not authenticated!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [addressId]);

  const [onlinePaymentTrigger, setOnlinePaymentTrigger] = useState(false);

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
          description: `Delaqua Water delivery for ${phoneNumber}, ordered on ${dataAndTime}`,
        }),
      });
      const data = await response.json();

      const formatPhoneNumber = userPhone?.replace(/\+/g, "");
      const resp = await axios.post(
        process.env.NEXT_PUBLIC_PAYMENT_SHEET_LINK as string,
        {
          userPhone: formatPhoneNumber,
          amount: `${amount}€`,
          orderId: data.id,
          description: `date:${dataAndTime}, number: ${phoneNumber}`,
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      const userId = getCurrentUserId();
      const orderRef = doc(db, `users/${userId}/orders/${orderIdFromDB}`);
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
    requestGeneral();
  }, []);
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

  let nextDay = dayjs().add(1, "day").format("dddd");
  if (
    dayjs().day() === 6 &&
    dayjs().isAfter(dayjs().startOf("day").add(12, "hours"))
  ) {
    nextDay = dayjs().add(2, "day").format("dddd");
  }

  const isWeekend = (date: Dayjs) => {
    const day = date.day();
    return day === 0;
  };
  const shouldDisableDate = (date: Dayjs) => {
    return (
      isWeekend(date) ||
      //@ts-ignore
      disabledDates.includes(date.format("DD-MM-YYYY"))
    );
  };

  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });
  const validateDate = (date: Dayjs | null) => {
    if (!date) {
      return false;
    }
    if (shouldDisableDate(date)) {
      setError("deliveryDate", {
        type: "manual",
        message:
          "Sunday is the only non-delivery day for us 🙌   You can place your order for Monday-Saturday",
      });
      setSubmitAttempted(true);
      return false;
    }
    clearErrors("deliveryDate");
    setSubmitAttempted(false);
    return true;
  };

  const dayOfWeekFormatter = (dayOfWeek: string, date: Date) => {
    const formattedDay = dayjs(date).format("dd");
    return formattedDay.toUpperCase();
  };

  useEffect(() => {
    if (!addresses) {
      setShowAddresses(false);
    }
  }, [deleteAddress]);
  const showOrdersHistory = () => {
    setShowWindow(true);
    trackAmplitudeEvent("myHistory", {
      text: "My history",
    });
  };

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
    trackAmplitudeEvent("addNewAddress", {
      text: "Add new address",
    });
  };

  const emptyAddress = () => {
    if ((!notSelectAddress || !notSelectName) && addresses.length > 0) {
      enqueueSnackbar(`${t("select_address")}`, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(true);
  const [isDecreasingFromTwo, setIsDecreasingFromTwo] = useState(false);
  useEffect(() => {
    setIsFirstOrder(orders.length === 0);
  }, [orders]);
  return (
    <>
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

        <form onSubmit={handleSubmit(onSubmit, handleError)}>
          <h1 className={styles.phoneNumber}>
            {userPhone === "+380639496331" && <RegisterButton />}
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
          {usedBottlesMessage && (
            <Alert style={{ marginTop: "15px" }} severity="info">
              {t("check_bottles_to_condition")}
            </Alert>
          )}
          <Grid item xs={12} md={4} className={styles.ordersHistoryMobile}>
            <div className={styles.ordersHistory}>
              <RestoreTwoToneIcon />
              <ButtonBase onClick={showOrdersHistory}>
                {" "}
                {t("orders_history")}
              </ButtonBase>
            </div>
          </Grid>

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
                    <Tooltip
                      title={t("info_message_more_one_bottle")}
                      arrow
                      open={isDecreasingFromTwo}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (!isFirstOrder && field.value === 2) {
                            setIsDecreasingFromTwo(true);
                          } else {
                            setIsDecreasingFromTwo(false);
                          }
                          const newValue = Math.max(
                            field.value - 1,
                            isFirstOrder ? 1 : 2
                          );
                          field.onChange(newValue);
                        }}
                      >
                        -
                      </button>
                    </Tooltip>
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
                        setIsDecreasingFromTwo(false);
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
                            max: 1000,
                          },
                        }}
                        error={!!errors.bottlesNumberToReturn}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.min(field.value + 1);
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
              </div>
              <div>
                <p className={styles.helperText}>{errors.pump?.message}</p>
              </div>
              {pomp && (
                <div
                  onClick={() => setIsImageOpen(true)}
                  className={styles.pumpInstruction}
                >
                  {t("pump_installation")}
                </div>
              )}
              {isImageOpen && (
                <div className={styles.instructionImagesContainer}>
                  <span
                    className={styles.instructionImagesClose}
                    onClick={() => setIsImageOpen(false)}
                  >
                    <CloseIcon />
                  </span>
                  <div className={styles.instructionImages}>
                    <img src="/fullInstruction.jpeg" />
                  </div>
                </div>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Box>
                <div className={styles.inputName}>
                  {t("delivery_date")} <span className={styles.redStar}>*</span>
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
                            shouldDisableDate(date)
                          }
                          format="DD-MM-YYYY"
                          onChange={(date) => {
                            const dayjsDate = date ? dayjs(date) : null;
                            field.onChange(dayjsDate);
                            validateDate(dayjsDate);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              onBlur: (e) => {
                                validateDate(
                                  dayjs(e.target.value, "DD-MM-YYYY")
                                );
                              },
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
                      {t("delivery_soonest_day")} {nextDay},{" "}
                      {t("delivery_please_change_day")}
                    </p>
                  )}
                  <p className={styles.helperText}>
                    {errors.deliveryDate?.message}
                  </p>
                </div>
              </Box>

              <Box>
                <div className={styles.inputNameTime}>
                  {t("delivery_time")} <span className={styles.redStar}>*</span>
                </div>
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

            <Grid item xs={12} md={4} className={styles.ordersHistoryDesktop}>
              <div className={styles.ordersHistory}>
                <RestoreTwoToneIcon />
                <ButtonBase onClick={showOrdersHistory}>
                  {" "}
                  {t("orders_history")}
                </ButtonBase>
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={styles.titles}>
            {t("delivery_details")}
          </Typography>
          {isLoading ? (
            <Skeleton
              variant="text"
              width="100%"
              height={200}
              style={{
                top: "-35px",
                marginBottom: "-35px",
                position: "relative",
              }}
            />
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
                  {t("post_index")} <span className={styles.redStar}>*</span>
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
              <ModalRemoveAddress
                isOpen={isModalOpen}
                onClose={handleDecline}
                onConfirm={handleConfirm}
              />
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
          {ordersLoaded ? (
            <Grid item xs={12} md={4}>
              <Skeleton
                style={{ transformOrigin: "0 0" }}
                width={350}
                height="15em"
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={12}>
              <div className={styles.blueContainer}>
                <p className={styles.margins}>
                  {" "}
                  {paymentText} {priceForDifferentBottles} € : {paymentForWater}{" "}
                  €{" "}
                </p>

                <p className={styles.margins}>
                  {t("deposit_for_bottles")} {depositForBottles} €{" "}
                  {usedBottlesMessage && (
                    <span>({t("deposit_may_be_changed")})</span>
                  )}
                </p>

                <p className={styles.margins}>
                  {t("pump")} {pompNumber} €
                </p>
                <br></br>
                <p className={styles.marginsTotal}>{t("total_payments")}</p>
                <div className={styles.marginsTotal}>{totalPayments} €</div>
              </div>
            </Grid>
          )}

          <Controller
            name="paymentMethod"
            control={control}
            defaultValue=""
            render={({ field: { onChange, ...field } }) => (
              <RadioGroup
                {...field}
                row
                aria-label="paymentMethod"
                defaultValue=""
                onChange={(e) => {
                  onChange(e);
                  const paymentMethod = e.target.value;
                  if (paymentMethod === "Cash") {
                    trackAmplitudeEvent("payCash", {
                      text: "Payment by cash selected",
                    });
                  } else if (paymentMethod === "Online") {
                    trackAmplitudeEvent("payOnline", {
                      text: "Payment online selected",
                    });
                  }
                }}
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
            <p className={styles.helperText}>{errors.paymentMethod?.message}</p>
          </div>
          {loadingForm && (
            <div className={styles.button}>
              {paymentMethod == "Online" && (
                <span> {t("loading_paymentLink")}</span>
              )}
              <CircularProgress />
            </div>
          )}
          {submitAttempted && Object.keys(errors).length > 0 && (
            <div className={styles.helperTextFinalError}>
              {t("fill_all_fields")}
            </div>
          )}
          {showMessage && (
            <p className={styles.helperTextFinalError}>{t("change_day")}</p>
          )}
          {!loadingForm && (
            <Box className={styles.button}>
              <Button
                onClick={emptyAddress}
                type="submit"
                disabled={showMessage || submitAttempted}
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
    </>
  );
};

export default MyForm;
