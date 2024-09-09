import { Invoices } from "../types";

export const getClipboardInvoiceRowData = (row: Invoices) =>
  `${row.clientId}\t ${row.clientName}\t  ${row.phoneNumber}\t ${row.deliveryDate}\t ${row.createdAt}\t ${row.invoiceNumber}\t ${row.netVal}\t ${row.vatVal}\t ${row.totalPayments}\t ${row.paymentStatus}
`;
