import * as yup from "yup";
import dayjs from "dayjs";

// Define your tomorrow variable if needed
const tomorrow = dayjs().add(1, "day").toDate();

export const validationSchema = yup.object().shape({
  date: yup
    .mixed<dayjs.Dayjs>()
    .required("Invoice date is required")
    .nullable()
    .test(
      "is-before-tomorrow",
      "Invoice date cannot be in the future",
      (value) => {
        if (value) {
          return dayjs(value).isBefore(tomorrow);
        }
        return true;
      }
    ),
  invoiceNumber: yup.string().required("Invoice number is required"),
  total: yup.string().required("Total is required"),
  netBuyWorth: yup.string().required("Net Buy Worth is required"),
  buyPriceVAT: yup.string().required("Buy Price VAT is required"),
  items: yup.array().of(
    yup.object().shape({
      itemName: yup.string().required("Item name is required"),
      quantity: yup.string().required("Quantity is required"),
    })
  ),
});
