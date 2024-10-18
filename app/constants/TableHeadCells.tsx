import { ContentCopy, Edit } from "@mui/icons-material";
import Image from "next/image";
import TenL from "../../public/10l.svg";
import FifteenL from "../../public/15L.svg";
import Address from "../../public/address.png";
import Bage from "../../public/bage.png";
import PaymentsTotal from "../../public/billEuro.png";
import CreatedAt from "../../public/calendar.png";
import Comments from "../../public/comments.png";
import CompletedStatus from "../../public/completedStatus.png";
import DeliveryDate from "../../public/deliveryDate.png";
import DeliveryTime from "../../public/deliveryTime.png";
import EmptyBottle from "../../public/emptyBottle.png";
import FullBottle from "../../public/fullBottle.png";
import PaymentsStatus from "../../public/paymentStatus.png";
import Phone from "../../public/phoneNumber.png";
import Pump from "../../public/pump.png";
import { OrdersData } from "../types";

interface HeadCell {
  disablePadding: boolean;
  id:
    | keyof OrdersData
    | "15LbottlesNumberToBuy"
    | "10LbottlesNumberToBuy"
    | "copy"
    | "edit";
  label: string;
  numeric: boolean;
  sortable: boolean;
  image?: any;
  columns?: string;
}

export const TableHeadCells: readonly HeadCell[] = [
  {
    id: "index",
    numeric: false,
    disablePadding: true,
    sortable: false,
    columns: "Client ID",
    label: "tableHeadCells.clientId",
  },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: true,
    label: "tableHeadCells.contact",
    sortable: false,
    columns: "Phone Number",
    image: <Image src={Phone} alt="Phone number" width={30} />,
  },
  {
    id: "firstAndLast",
    numeric: false,
    disablePadding: true,
    label: "tableHeadCells.name",
    sortable: false,
    image: <Image src={Bage} alt="Bage" width={30} />,
  },
  {
    id: "bottlesNumberToBuy",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.buy",
    sortable: false,
    image: <Image src={FullBottle} alt="Bottles Number To Buy" width={30} />,
  },
  {
    id: "bottlesNumberToReturn",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.return",
    sortable: false,
    image: (
      <Image src={EmptyBottle} alt="Bottles Number To Return" width={30} />
    ),
  },
  {
    id: "15LbottlesNumberToBuy",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.buy",
    sortable: false,
    image: <Image src={FifteenL} alt="FifteenL" width={22} />,
  },
  {
    id: "10LbottlesNumberToBuy",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.buy",
    sortable: false,
    image: <Image src={TenL} alt="TenL" width={22} />,
  },
  {
    id: "pump",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.pump",
    sortable: false,
    image: <Image src={Pump} alt="Pump To Buy" width={23} />,
  },
  {
    id: "deliveryAddress",
    numeric: false,
    disablePadding: false,
    label: "tableHeadCells.address",
    sortable: false,
    image: <Image src={Address} alt="Delivery Address" width={30} />,
  },

  {
    id: "deliveryDate",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.date",
    sortable: true,
    columns: "Delivery Date",
    image: <Image src={DeliveryDate} alt="DeliveryDate" width={30} />,
  },
  {
    id: "deliveryTime",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.time",
    sortable: true,
    columns: "Delivery Time",
    image: <Image src={DeliveryTime} alt="DeliveryTime" width={30} />,
  },
  {
    id: "totalPayments",
    numeric: true,
    disablePadding: false,
    label: "tableHeadCells.total",
    sortable: false,
    image: <Image src={PaymentsTotal} alt="PaymentsTotal" width={30} />,
  },

  {
    id: "paymentStatus",
    numeric: false,
    disablePadding: true,
    label: "tableHeadCells.payStatus",
    sortable: true,
    columns: "Payment Status",
    image: <Image src={PaymentsStatus} alt="PaymentsStatus" width={30} />,
  },
  {
    id: "comments",
    numeric: false,
    disablePadding: true,
    label: "tableHeadCells.comments",
    sortable: false,
    image: <Image src={Comments} alt="Comments" width={30} />,
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "tableHeadCells.created",
    sortable: true,
    image: <Image src={CreatedAt} alt="CreatedAt" width={30} />,
  },
  {
    id: "completed",
    numeric: false,
    disablePadding: true,
    label: "tableHeadCells.orderStatus",
    sortable: true,
    columns: "Order Status",
    image: <Image src={CompletedStatus} alt="CompletedStatus" width={30} />,
  },
  {
    id: "courierComment",
    numeric: false,
    disablePadding: true,
    label: "Courier Comment",
    sortable: false,
    image: (
      <ContentCopy
        sx={{
          color: "#4788C7",
          width: "30px",
          height: "30px",
        }}
      />
    ),
  },
  {
    id: "copy",
    numeric: false,
    disablePadding: true,
    label: "copy",
    sortable: false,
    image: (
      <ContentCopy
        sx={{
          color: "#4788C7",
          width: "30px",
          height: "30px",
        }}
      />
    ),
  },

  {
    id: "edit",
    numeric: false,
    disablePadding: true,
    label: "edit",
    sortable: false,
    image: (
      <Edit
        sx={{
          color: "#4788C7",
          width: "30px",
          height: "30px",
        }}
      />
    ),
  },
];
