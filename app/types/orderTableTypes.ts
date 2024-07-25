export interface OrdersData {
  index?: number;
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

export interface FilterItem {
  id: string;
  column: string;
  operator?: string;
  value1: string;
  value2?: string;
}
