import * as yup from "yup";
export const schema = yup.object().shape({
  firstAndLast: yup.string().required("Enter first and last name"),
  phoneNumber: yup.string(),
  postalIndex: yup
    .string()
    .matches(/^\d{4}$/, "Postal Index must contain 4 digits")
    .required("Enter a valid phone number"),
  deliveryAddress: yup.string(),
  addressDetails: yup.string().required("Enter address details"),
  geolocation: yup.string().required("Enter you geolocation"),
  pump: yup.boolean(),
  bottlesNumberToBuy: yup.number().required("Choose bootle number"),
  bottlesNumberToReturn: yup
    .number()
    .required("Choose bootle number"),
  deliveryDate: yup.date().required("Choose delivery date"),
  deliveryTime: yup.string().required("Choose time"),
  paymentMethod: yup.string().required("Choose payment method"),
  comments: yup.string(),
  id: yup.string(),
});
