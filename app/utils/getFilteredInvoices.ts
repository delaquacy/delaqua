import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { FilterItem, Invoices } from "../types";
import { getFormattedDateString } from "./getFormattedDateString";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const getFilteredInvoices = (
  filters: FilterItem[],
  invoices: Invoices[]
): Invoices[] => {
  let filteredInvoices = invoices;

  const filterFunctions: {
    [key: string]: (invoice: Invoices, filter: FilterItem) => boolean;
  } = {
    "Delivery Date": (invoice, filter) => {
      const startDate = dayjs(filter.value1);
      const endDate = dayjs(filter.value2);
      const deliveryDate = dayjs(getFormattedDateString(invoice.deliveryDate));
      return (
        deliveryDate.isSameOrAfter(startDate) &&
        deliveryDate.isSameOrBefore(endDate)
      );
    },
    "Date of order placed": (invoice, filter) => {
      const startDate = dayjs(filter.value1);
      const endDate = dayjs(filter.value2);
      const createdDate = dayjs(getFormattedDateString(invoice.createdAt));
      return (
        createdDate.isSameOrAfter(startDate) &&
        createdDate.isSameOrBefore(endDate)
      );
    },
    "Client ID": (invoice, filter) => +invoice.clientId === +filter.value1,
    "Address Type": (invoice, filter) =>
      invoice?.addressType
        ? invoice?.addressType === filter.value1
        : filter.value1 === "Home",
    "Client name": (invoice, filter) => invoice.clientName === filter.value1,
    "Phone Number": (invoice, filter) => invoice.phoneNumber === filter.value1,
    "Payment Status": (invoice, filter) =>
      invoice.paymentStatus === filter.value1,
  };

  filters.forEach((filter) => {
    const filterFunction = filterFunctions[filter.column];

    if (filterFunction && !!filter.value1) {
      filteredInvoices = filteredInvoices.filter((invoice) =>
        filterFunction(invoice, filter)
      );
    }
  });

  return filteredInvoices;
};
