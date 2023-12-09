"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  ConfirmationResult,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../lib/config";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styles from "./page.module.css";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

interface CustomWindow extends Window {
  recaptchaVerifier?: any;
}
const myWindow = window as CustomWindow;
const messages = {
  otpSent: "OTP code already send to your number",
  otpSentError: "Something went wrong, reload page or try later",
  wrongOtp: "Write incorect OTP code",
};
export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    myWindow.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: (response: any) => {
          console.log(response, "response");
        },
        "expired-callback": () => {},
      }
    );
  }, [auth]);

  const handlePhoneNumberChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(e.target.value);
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
        myWindow.recaptchaVerifier
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
      setOtp("");
      router.push("/my_account");
    } catch (error) {
      enqueueSnackbar(messages.wrongOtp, { variant: "error" });
      console.error(error);
    }
  };
  return (
    <SnackbarProvider>
      <Box className={styles.container}>
        <Box className={styles.logoAndTitle}>
          <LockOutlinedIcon fontSize="large" />
          <Typography variant="h4">Log in</Typography>
        </Box>
        <TextField
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className={styles.input}
          placeholder="Please enter phone number"
        />
        <TextField
          type="text"
          value={otp}
          onChange={handleOtpChange}
          className={styles.input}
          disabled={!otpSent}
          placeholder="Please enter OTP code from sms"
        />
        <Button
          variant="outlined"
          onClick={otpSent ? handleOtpSubmit : handleSentOtp}
        >
          {otpSent ? "Submit Otp" : "Sent OTP"}
        </Button>
        {!otpSent ? <div id="recaptcha-container"></div> : null}
      </Box>
    </SnackbarProvider>
  );
}
