import { Invoices } from "../types";

export const getFormattedInvoiceForCVS = (invoices: Invoices[]) => {
  return invoices.map((invoice) => {
    const {
      clientId,
      clientName,
      phoneNumber,
      deliveryDate,
      createdAt,
      invoiceNumber,
      netVal,
      vatVal,
      totalPayments,
      paymentStatus,
    } = invoice;

    return {
      "Client ID": clientId,
      "Client Name": clientName,
      "Client Phone": phoneNumber,
      Date: deliveryDate,
      "Date of order placed": createdAt,
      "Invoice number": invoiceNumber,
      "Net value €": netVal,
      "Amount of VAT €": vatVal,
      "Total value €": totalPayments,
      "Payment status": paymentStatus,
    };
  });
};
