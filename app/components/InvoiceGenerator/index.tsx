import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { OrdersData } from "@/app/types";
import { getDateFromTimestamp } from "@/app/utils";
import { Download } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import jsPDF from "jspdf";

import autoTable, { applyPlugin } from "jspdf-autotable";
import "./jsPDF_fonts/OpenSans-Bold-normal";
import "./jsPDF_fonts/OpenSans-Medium-normal";

applyPlugin(jsPDF);

interface InvoiceGeneratorProps {
  order: OrdersData;
}

const InvoiceGenerator = ({ order }: InvoiceGeneratorProps) => {
  const { goods } = useOrderDetailsContext();

  const hasInvoiceNumber = !!order?.invoiceNumber;

  console.log(hasInvoiceNumber, "hasInvoiceNumber");

  const address =
    (order.deliveryAddressObj?.postalIndex || order.postalIndex) +
    `, ${order.deliveryAddressObj?.addressDetails || order.addressDetails}` +
    `, ${order.deliveryAddressObj?.deliveryAddress || order.deliveryAddress}`;

  const calculation = {
    net5Sum: 0,
    net19Sum: 0,
    vat5: 0,
    vat19: 0,
    netVal: 0,
    vatVal: 0,
  };

  const bodyRows = order.items?.map((item) => {
    const good = goods.find((good) => +good.itemCode === +item.itemCode);

    if (good && +good.taxRate === 5) {
      calculation.net5Sum += +item.count * +good?.netSaleWorth;
      calculation.vat5 += +item.count * +good.sellPriceVAT;
      calculation.vatVal += +item.count * +good.sellPriceVAT;
    }

    if (good && +good.taxRate === 19) {
      calculation.net19Sum += +item.count * +good?.netSaleWorth;
      calculation.vat19 += +item.count * +good.sellPriceVAT;
      calculation.vatVal += +item.count * +good.sellPriceVAT;
    }

    calculation.netVal += (good && +item.count * +good?.netSaleWorth) || 0;

    return (
      good && [
        item.itemCode,
        item.name,
        `${item.count}`,
        `€${(+item.sellPrice).toFixed(2)}`,
        `${good?.taxRate}%`,
        `€${(+good?.netSaleWorth).toFixed(2)}`,
        `€${(+item?.sum).toFixed(2)}`,
      ]
    );
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    const wrappedAddress = doc.splitTextToSize(address, 165);

    const regularFont = () => doc.setFont("OpenSans-Medium");
    const boldFont = () => doc.setFont("OpenSans-Bold");

    const leftPadding = 15;

    // logo
    const logoText = "Online order at ";
    const logoTextLink = "delaqua.cy";
    const imgUrl = "/logo.png";

    doc.addImage(imgUrl, "PNG", leftPadding, 10, 66, 15);
    regularFont();
    doc.setFontSize(10);
    doc.text(logoText, leftPadding, 28);

    const textX = doc.getTextWidth(logoText) + leftPadding;
    const textY = 28;
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(logoTextLink, textX, textY, {
      url: "https://delaqua.cy",
    });

    // Title
    const titlePaddingLeft = 130;

    doc.setTextColor(0, 0, 0);
    boldFont();
    doc.setFontSize(16);
    doc.text("Sales Invoice", titlePaddingLeft, 15);
    doc.setFontSize(14);

    doc.text(order.invoiceNumber || "INV-24-1", titlePaddingLeft, 22);
    regularFont();

    doc.setTextColor(128, 128, 128);
    doc.setFontSize(11);
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

    const x = leftPadding;
    const y = 40;
    const width = 180;
    const height = 32;
    const borderColor = [0, 0, 0];
    const borderWidth = 0.1;

    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(borderWidth);
    doc.rect(x, y, width, height);

    // info
    doc.setTextColor(0, 0, 0);

    boldFont();
    doc.setFontSize(12);

    doc.text("Billed to", leftPadding + 2, y + 6);

    regularFont();
    doc.setFontSize(10);

    doc.text(order.firstAndLast, leftPadding + 2, y + 12);
    doc.text(order.phoneNumber, leftPadding + 2, y + 18);
    doc.text(wrappedAddress, leftPadding + 2, y + 24, {
      lineHeightFactor: 1.7,
    });

    boldFont();
    doc.setFontSize(12);
    doc.text("From", titlePaddingLeft, y + 6);
    regularFont();
    doc.setFontSize(10);

    doc.text("Aquadel LTD", titlePaddingLeft, y + 12);
    doc.text("Amathountos, 106, SUN SEA COURT 1", titlePaddingLeft, y + 18);
    doc.text("4532, Agios Tychon, Cyprus", titlePaddingLeft, y + 24);
    doc.text("VAT Number: 60049220W", titlePaddingLeft, y + 30);

    doc.text(`Date of supply: ${order.deliveryDate}`, leftPadding, 77);

    boldFont();
    doc.setFontSize(12);

    doc.text("Order details:", leftPadding, 90);
    regularFont();

    // Order Table
    autoTable(doc, {
      startY: 95,
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
    const widthAnalysis = 180;
    const heightAnalysis = 28;

    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(borderWidth);
    doc.rect(xAnalysis, yAnalysis, widthAnalysis, heightAnalysis);

    const middleX = 120;

    doc.setDrawColor(128, 128, 128);
    doc.setLineWidth(0.1);
    doc.line(middleX, yAnalysis, middleX, yAnalysis + heightAnalysis);

    boldFont();
    doc.setFontSize(11);
    doc.setTextColor(128, 128, 128);

    doc.text("VAT analysis", xAnalysis + 2, yAnalysis + 5);
    doc.text("Invoice summary", middleX + 2, yAnalysis + 5);

    doc.setTextColor(0, 0, 0);

    doc.text("% VAT", leftPadding + 2, yAnalysis + 12);
    doc.text(" Net worth €", leftPadding + 25, yAnalysis + 12);
    doc.text("Amount of VAT €", leftPadding + 62, yAnalysis + 12);

    regularFont();
    doc.setTextColor(128, 128, 128);

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

    const xBank = leftPadding;
    const yBank = yAnalysis + 35;
    const widthBank = 180;
    const heightBank = 25;

    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(borderWidth);
    doc.rect(xBank, yBank, widthBank, heightBank);

    // Bank details
    boldFont();
    doc.setFontSize(11);
    doc.setTextColor(128, 128, 128);

    doc.text("Bank details", leftPadding + 2, yBank + 5);
    regularFont();

    doc.text("Recipient: Aquadel LTD", leftPadding + 2, yBank + 11);
    doc.text("IBAN: LT04 3250 0151 0995 4807", leftPadding + 2, yBank + 17);
    doc.text("BIC: REVOLT21", leftPadding + 2, yBank + 23);

    doc.save(`${order.invoiceNumber}.pdf`);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
  };

  return (
    <Box>
      <Tooltip title="open and save invoice">
        <IconButton onClick={generatePDF}>
          <Download />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default InvoiceGenerator;
