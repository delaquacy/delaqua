import * as yup from "yup";

export const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  itemCode: yup.string().required("Code is required"),
  quantity: yup.string().required("Quantity is required"),
  unitPrice: yup.string().required("Unit Price is required"),
  buyPrice: yup.string().required("buyPrice is required"),
  buyPriceVAT: yup.string().required("buyPriceVAT is required"),
  netBuyWorth: yup.string().required("netBuyWorth is required"),
  netSaleWorth: yup.string().required("netSaleWorth is required"),
  sellPrice: yup.string().required("sellPrice is required"),
  sellPriceVAT: yup.string().required("sellPriceVAT is required"),
  taxRate: yup.string().required("taxRate is required"),
  picture: yup.string().required("Picture link is required"),
});

// lastInvoiceDate: string;
// lastInvoiceNumber: string;
