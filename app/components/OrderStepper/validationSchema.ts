import * as yup from "yup";

export const validationSchema = yup.object().shape({
  firstAndLast: yup.string().required("First and Last is required"),
  postalIndex: yup.string().required("Postal Index is required"),
  deliveryAddress: yup.string().required("Delivery Address is required"),
  geolocation: yup.string().required("Geolocation is required"),
  addressDetails: yup.string().required("Address Details is required"),
});
