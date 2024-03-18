"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  ConfirmationResult,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { app, db } from "../../lib/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./page.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface CustomWindow extends Window {
  recaptchaVerifier?: any;
}
let myWindow: CustomWindow | undefined;

if (typeof window !== "undefined") {
  myWindow = window as CustomWindow;
}
export interface LogInProps {
  params: {
    onLogin: () => void;
  };
}

export default function Login({ params }: LogInProps) {
  const { t } = useTranslation("main");
  const { onLogin } = params;
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [phoneNumberEntered, setPhoneNumberEntered] =
    useState<boolean>(false);
  const messages = {
    otpSent: `${t("OTP_messages_otpSent")}`,
    otpSentError: `${t("OTP_messages_otpSentError")}`,
    wrongOtp: `${t("OTP_messages_wrongOtp")}`,
  };
  const auth = getAuth(app);
  const router = useRouter();
  useEffect(() => {
    if (myWindow) {
      myWindow.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: (response: string) => {},
          "expired-callback": () => {},
        }
      );
    }
  }, [auth]);

  const handlePhoneNumberChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(e.target.value);
    setPhoneNumberEntered(!!e.target.value);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  const handleSentOtp = async () => {
    try {
      const formatterPhoneNumber = `+${phoneNumber.replace(
        /\D/g,
        ""
      )}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formatterPhoneNumber,
        myWindow?.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      enqueueSnackbar(messages.otpSent, { variant: "success" });
      setOtpSent(true);
    } catch (error) {
      enqueueSnackbar(messages.otpSentError, {
        variant: "error",
      });
      console.error(error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      await confirmationResult?.confirm(otp);

      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            phoneNumber: user.phoneNumber,
            numberOfBottles: 0,
          });
        }
      }

      setOtp("");
      localStorage.setItem("isLoggedIn", "true");
      router.push("/my_account");
    } catch (error) {
      enqueueSnackbar(messages.wrongOtp, { variant: "error" });
      console.error(error);
    }
  };
  return (
    <SnackbarProvider>
      <Box className={styles.container}>
        <Box className={styles.wrapper}>
          <Box className={styles.closeButton}>
            <CloseIcon onClick={onLogin} />
          </Box>
          <Box className={styles.logoAndTitle}>
            <LockOutlinedIcon fontSize="large" />
            <Typography variant="h4">{t("login_window")}</Typography>
          </Box>
          <TextField
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className={styles.input}
            placeholder={t("placeholder_phone")}
          />
          {phoneNumberEntered && otpSent && (
            <TextField
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className={styles.input}
              placeholder={t("placeholder_OTP")}
            />
          )}
          <Button
            variant="contained"
            onClick={
              phoneNumberEntered
                ? otpSent
                  ? handleOtpSubmit
                  : handleSentOtp
                : undefined
            }
          >
            {otpSent
              ? `${t("button_submit_OTP")}`
              : `${t("button_sent_OTP")}`}
          </Button>
          {!otpSent ? <div id="recaptcha-container"></div> : null}
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
