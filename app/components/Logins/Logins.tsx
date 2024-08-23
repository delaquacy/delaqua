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
import { enqueueSnackbar } from "notistack";
import { app, db } from "../../lib/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import PhoneInput from "react-phone-number-input";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";
import "../../i18n";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import { useToggle } from "@/app/lib/ToggleContext";
import { adminCheck } from "@/app/utils/adminCheck";
import { useUserContext } from "@/app/contexts/UserContext";

interface CustomWindow extends Window {
  recaptchaVerifier?: any;
}
let myWindow: CustomWindow | undefined;
type CustomError = {
  message: string;
  code?: number;
};

if (typeof window !== "undefined") {
  myWindow = window as CustomWindow;
}
export interface LogInProps {
  params: {
    onLogin: () => void;
  };
}

export default function Logins({ params }: LogInProps) {
  const { t } = useTranslation("main");
  const { onLogin } = params;
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [otp, setOtp] = useState<string>("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [phoneNumberEntered, setPhoneNumberEntered] = useState<boolean>(false);
  const { setToggle } = useToggle();
  const messages = {
    otpSent: `${t("OTP_messages_otpSent")}`,
    otpSentError: `${t("OTP_messages_otpSentError")}`,
    wrongOtp: `${t("OTP_messages_wrongOtp")}`,
  };
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const auth = getAuth(app);
  const router = useRouter();
  const { user, setUser } = useUserContext();

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
  }, [auth, myWindow]);

  const handlePhoneNumberChange = (event: string | undefined) => {
    setPhoneNumber(event);
    setPhoneNumberEntered(!!event);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSentOtp = async () => {
    try {
      if (phoneNumber) {
        trackAmplitudeEvent("enterPhone", {
          text: "Enter phone",
        });

        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          myWindow?.recaptchaVerifier
        );

        setConfirmationResult(confirmation);
        enqueueSnackbar(messages.otpSent, { variant: "success" });
        trackAmplitudeEvent("requestOTP", {
          text: "Request OTP",
        });
        setOtpSent(true);
      }
    } catch (error: unknown) {
      const customError = error as CustomError;
      console.error(customError.message);
      if (customError.message.includes("(auth/invalid-phone-number).")) {
        enqueueSnackbar(t("format_number"), { variant: "error" });
      } else {
        enqueueSnackbar(messages.otpSentError, { variant: "error" });
      }
      console.error(error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      trackAmplitudeEvent("enterOTP", {
        text: "Enter OTP",
      });
      await confirmationResult?.confirm(otp);

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        setUser(user);

        if (!userDoc.exists()) {
          const lastUserNumberDocRef = doc(db, "list/5n9NPK8Faw87bjbeenPw");

          const lastUserNumberDoc = await getDoc(lastUserNumberDocRef);
          let lastUserNumber = lastUserNumberDoc.exists()
            ? lastUserNumberDoc.data().lastUserNumber
            : 0;

          const newUserNumber = lastUserNumber + 1;

          await setDoc(userDocRef, {
            phoneNumber: user.phoneNumber,
            generalNumberOfBottles: 0,
            userNumber: newUserNumber,
          });

          await updateDoc(lastUserNumberDocRef, {
            lastUserNumber: newUserNumber,
          });
          trackAmplitudeEvent("newUser", {
            text: "New user",
          });
        }
      }

      const isAdmin = await adminCheck(user?.phoneNumber as string).then(
        (res) => res
      );

      trackAmplitudeEvent("submitOTP", {
        text: "Submit OTP",
      });
      setOtp("");
      // User is an administrator, access to admin section allowed
      isAdmin ? router.push("/admin_dashboard") : router.push("/new_order");
      setToggle(false);
      trackAmplitudeEvent("myAccount", {
        text: "Redirect to my_account",
      });
    } catch (error: unknown) {
      const customError = error as CustomError;
      console.error(customError.message);
      if (customError.message.includes("auth/invalid-verification-code")) {
        enqueueSnackbar(t("wrong_otp"), {
          variant: "error",
        });
      } else if (customError.message.includes("auth/user-disabled")) {
        enqueueSnackbar(t("account_disable"), {
          variant: "error",
        });
      } else {
        enqueueSnackbar(messages.wrongOtp, { variant: "error" });
      }
      console.error(error);
    }
  };

  return (
    <>
      {!user && (
        <Box className={styles.container}>
          <Box className={styles.wrapper}>
            <Box className={styles.closeButton}>
              <CloseIcon onClick={onLogin} />
            </Box>
            <Box className={styles.logoAndTitle}>
              <LockOutlinedIcon fontSize="large" />
              <Typography variant="h4">{t("login_window")}</Typography>
            </Box>
            <div className={styles.inputContainer}>
              <PhoneInput
                type="tel"
                disabled={otpSent}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="357 77 123342"
              />
            </div>
            {!otpSent && (
              <span className={styles.helpMessage}>
                {t("enter_phone_with_code")}
              </span>
            )}

            {phoneNumberEntered && otpSent && (
              <TextField
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className={styles.input}
                placeholder={t("placeholder_OTP")}
              />
            )}
            {!otpSent ? <div id="recaptcha-container"></div> : null}
            <br></br>
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
          </Box>
        </Box>
      )}
    </>
  );
}
