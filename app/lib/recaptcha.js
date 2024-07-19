import { getAuth, RecaptchaVerifier } from "firebase/auth";

const auth = getAuth();
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "sign-in-button",
  {
    size: "invisible",
    callback: (response) => {
      onSignInSubmit();
    },
  }
);
