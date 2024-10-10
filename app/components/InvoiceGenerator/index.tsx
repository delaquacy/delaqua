import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { OrdersData } from "@/app/types";
import { addInvoiceNumberToOldOrder, getDateFromTimestamp } from "@/app/utils";
import { Download } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import jsPDF from "jspdf";

import { useUserContext } from "@/app/contexts/UserContext";
import { generateInvoiceTableRows } from "@/app/utils/generateInvoiceTableRows";
import autoTable, { applyPlugin } from "jspdf-autotable";
import "./jsPDF_fonts/OpenSans-Bold-normal";
import "./jsPDF_fonts/OpenSans-Medium-normal";

applyPlugin(jsPDF);

interface InvoiceGeneratorProps {
  order: OrdersData;
}

const InvoiceGenerator = ({ order }: InvoiceGeneratorProps) => {
  const { goods, userData } = useOrderDetailsContext();
  const { setOrders } = useUserContext();

  const address =
    (order.deliveryAddressObj?.postalIndex || order.postalIndex) +
    `, ${order.deliveryAddressObj?.addressDetails || order.addressDetails}` +
    `, ${order.deliveryAddressObj?.deliveryAddress || order.deliveryAddress}`;

  const { bodyRows, calculation } = generateInvoiceTableRows(order, goods);
  const hasVatNum = !!order.deliveryAddressObj?.VAT_Num;

  const generatePDF = async () => {
    let invoiceNumber = order.invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = await addInvoiceNumberToOldOrder(
        order,
        order.idDb,
        userData.userId
      );

      setOrders((prev) =>
        prev.map((settledOrder) =>
          settledOrder.id === order.id
            ? { ...settledOrder, invoiceNumber }
            : settledOrder
        )
      );
    }

    const doc = new jsPDF();
    const wrappedAddress = doc.splitTextToSize(address, 165);

    const setFont = (
      font: string,
      size: number,
      color: number[] = [0, 0, 0]
    ) => {
      doc.setFont(font);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
    };

    const drawRectangle = (
      leftPosition: number,
      topPosition: number,
      height: number,
      borderColors: number[] = [0, 0, 0]
    ) => {
      const width = 180;
      const borderWidth = 0.1;

      doc.setDrawColor(borderColors[0], borderColors[1], borderColors[2]);
      doc.setLineWidth(borderWidth);
      doc.rect(leftPosition, topPosition, width, height);
    };

    const leftPadding = 15;
    const topLogoPadding = 28;
    const titlePaddingLeft = 130;

    // logo
    const logoText = "Online order at ";
    const logoTextLink = "delaqua.cy";
    const imgUrl = "/logo.png";
    const logoTextLeftPadding = doc.getTextWidth(logoText) + 5;

    setFont("OpenSans-Medium", 10);

    doc.addImage(imgUrl, "PNG", leftPadding, 10, 66, 15);
    doc.text(logoText, leftPadding, topLogoPadding);

    doc.setTextColor(0, 0, 255);
    doc.textWithLink(logoTextLink, logoTextLeftPadding, topLogoPadding, {
      url: "https://delaqua.cy",
    });

    // Title

    setFont("OpenSans-Bold", 16);

    doc.text("Sales Invoice", titlePaddingLeft, 15);

    setFont("OpenSans-Bold", 14);

    doc.text(invoiceNumber || "INV-1", titlePaddingLeft, 22);

    setFont("OpenSans-Medium", 11, [128, 128, 128]);

    doc.text(
      `Issued on: ${
        typeof order.createdAt === "string"
          ? order.createdAt
          : getDateFromTimestamp(order.createdAt as any)
      }`,
      titlePaddingLeft,
      28
    );

    // billed border
    doc.setTextColor(0, 0, 0);
    const y = 40;

    drawRectangle(leftPadding, 40, hasVatNum ? 37 : 32, [0, 0, 0]);

    // info
    setFont("OpenSans-Bold", 12);

    doc.text("Billed to", leftPadding + 2, y + 6);

    setFont("OpenSans-Medium", 10);

    doc.text(order.firstAndLast, leftPadding + 2, y + 12);
    doc.text(order.phoneNumber, leftPadding + 2, y + 18);
    doc.text(wrappedAddress, leftPadding + 2, y + 24, {
      lineHeightFactor: 1.7,
    });

    hasVatNum &&
      doc.text(
        `VAT Number: ${order.deliveryAddressObj?.VAT_Num}` || "",
        leftPadding + 2,
        y + 36
      );

    setFont("OpenSans-Bold", 12);

    doc.text("From", titlePaddingLeft, y + 6);

    setFont("OpenSans-Medium", 10);

    doc.text("Aquadel LTD", titlePaddingLeft, y + 12);
    doc.text("Amathountos, 106, SUN SEA COURT 1", titlePaddingLeft, y + 18);
    doc.text("4532, Agios Tychon, Cyprus", titlePaddingLeft, y + 24);
    doc.text("VAT Number: 60049220W", titlePaddingLeft, y + 30);

    doc.text(
      `Date of supply: ${order.deliveryDate}`,
      leftPadding,
      hasVatNum ? 82 : 77
    );

    setFont("OpenSans-Bold", 12);

    doc.text("Order details:", leftPadding, hasVatNum ? 94 : 90);

    setFont("OpenSans-Medium", 12);

    // Order Table
    autoTable(doc, {
      startY: hasVatNum ? 98 : 95,
      head: [
        [
          "Item code",
          "Name / description",
          "Qty",
          "Price",
          "Tax rate",
          "Net worth",
          "Amount",
        ],
      ],
      body: [
        ...(bodyRows as any[]),
        [
          "",
          "",
          "",
          "",
          {
            content: "Total:",
            styles: {
              fontStyle: "bold",
              textColor: "black",
              fontSize: 11,
              font: "OpenSans-Bold",
            },
          },
          "",
          {
            content: `€${(+order.totalPayments).toFixed(2)}`,
            styles: {
              fontStyle: "bold",
              textColor: "black",
              fontSize: 11,
              font: "OpenSans-Bold",
            },
          },
        ],
      ],

      theme: "striped",
      headStyles: {
        font: "OpenSans-Bold",
        fillColor: [255, 255, 255],
        textColor: "black",
        fontSize: 11,
      },
      styles: { fontSize: 10, cellPadding: 2, font: "OpenSans-Medium" },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
    });

    // VAT analysis
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);

    const xAnalysis = leftPadding;
    const yAnalysis = finalY + 10;
    const heightAnalysis = 28;

    drawRectangle(leftPadding, finalY + 10, 28, [0, 0, 0]);

    const middleX = 120;

    doc.setDrawColor(128, 128, 128);
    doc.setLineWidth(0.1);
    doc.line(middleX, yAnalysis, middleX, yAnalysis + heightAnalysis);

    setFont("OpenSans-Bold", 11, [128, 128, 128]);

    doc.text("VAT analysis", xAnalysis + 2, yAnalysis + 5);
    doc.text("Invoice summary", middleX + 2, yAnalysis + 5);

    doc.setTextColor(0, 0, 0);

    doc.text("% VAT", leftPadding + 2, yAnalysis + 12);
    doc.text(" Net worth €", leftPadding + 25, yAnalysis + 12);
    doc.text("Amount of VAT €", leftPadding + 62, yAnalysis + 12);

    setFont("OpenSans-Medium", 11, [128, 128, 128]);

    doc.text("5", leftPadding + 7, yAnalysis + 20);
    doc.text("19", leftPadding + 7, yAnalysis + 26);

    doc.setTextColor(0, 0, 0);

    doc.text(
      `${calculation.net5Sum.toFixed(2)}`,
      leftPadding + 35,
      yAnalysis + 20
    );
    doc.text(
      `${calculation.net19Sum.toFixed(2)}`,
      leftPadding + 35,
      yAnalysis + 26
    );

    doc.text(
      `${calculation.vat5.toFixed(2)}`,
      leftPadding + 75,
      yAnalysis + 20
    );
    doc.text(
      `${calculation.vat19.toFixed(2)}`,
      leftPadding + 75,
      yAnalysis + 26
    );

    doc.setTextColor(128, 128, 128);

    doc.text("Net value €", middleX + 2, yAnalysis + 12);
    doc.text("VAT amount €", middleX + 2, yAnalysis + 19);
    doc.text("Total value €", middleX + 2, yAnalysis + 26);

    doc.setTextColor(0, 0, 0);

    doc.text(`${calculation.netVal.toFixed(2)}`, middleX + 40, yAnalysis + 12);
    doc.text(`${calculation.vatVal.toFixed(2)}`, middleX + 40, yAnalysis + 19);
    doc.text(`${order.totalPayments.toFixed(2)}`, middleX + 40, yAnalysis + 26);

    const yBank = yAnalysis + 35;

    drawRectangle(leftPadding, yBank, 25, [0, 0, 0]);

    // Bank details
    setFont("OpenSans-Bold", 11, [128, 128, 128]);

    doc.text("Bank details", leftPadding + 2, yBank + 5);
    setFont("OpenSans-Medium", 11, [128, 128, 128]);

    doc.text("Recipient: Aquadel LTD", leftPadding + 2, yBank + 11);
    doc.text("IBAN: LT04 3250 0151 0995 4807", leftPadding + 2, yBank + 17);
    doc.text("BIC: REVOLT21", leftPadding + 2, yBank + 23);

    doc.save(`${invoiceNumber}.pdf`);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
  };

  return (
    <Box>
      <Tooltip title="open and save invoice">
        <IconButton
          onClick={generatePDF}
          sx={{
            border: "1px solid rgba(25, 118, 210, 0.2)",
          }}
        >
          <Download
            sx={{
              color: "rgba(25, 118, 210, 0.7)",
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default InvoiceGenerator;
