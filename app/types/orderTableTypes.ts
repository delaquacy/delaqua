export interface OrdersData {
  index?: number;
  items?: UserOrderItem[];
  invoiceNumber?: string;
  addressDetails: string;
  bottlesNumberToBuy: number;
  bottlesNumberToReturn: number;
  comments: string;
  createdAt: string;
  completed: boolean;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  depositForBottles: string;
  firstAndLast: string;
  geolocation: string;
  id: string;
  numberOfBottlesAtThisAddress: number;
  paymentMethod: string;
  paymentId: string;
  paymentStatus: string;
  paymentLink?: string;
  phoneNumber: string;
  postalIndex: string;
  priceOfWater: number;
  pump: string;
  pumpPrice: string;
  totalPayments: number;
  userId: number;
  useId?: number;
  expire: boolean;
  canceled: boolean;
}

export interface UserOrderItem {
  id: string;
  itemCode: string;
  name: string;
  sellPrice: string;
  count: string;
  sum: string;
}

export interface FilterItem {
  id: string;
  column: string;
  operator?: string;
  value1: string;
  value2?: string;
}

export interface Invoices {
  id: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  deliveryDate: string;
  invoiceNumber: string;
  netVal: string;
  paymentStatus: string;
  phoneNumber: string;
  totalPayments: string;
  vatVal: string;
}
