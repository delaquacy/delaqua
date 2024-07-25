import { getAuth, signInWithPhoneNumber } from "firebase/auth";

const phoneNumber = getPhoneNumberFromUserInput();
const appVerifier = window.recaptchaVerifier;

const auth = getAuth();
signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  .then((confirmationResult) => {
    window.confirmationResult = confirmationResult;
  })
  .catch((error) => {
    grecaptcha.reset(window.recaptchaWidgetId);
  });
