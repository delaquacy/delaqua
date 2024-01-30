export interface IForm {
  firstAndLast: string;
  phoneNumber?: string | undefined;
  postalIndex: string;
  deliveryAddress: string;
  addressDetails: string;
  geolocation: string;
  pump?: boolean;
  bottlesNumberToBuy: string;
  bottlesNumberToReturn: string;
  deliveryDate: Date;
  deliveryTime: string;
  paymentMethod: string;
  comments?: string;
  id?: string;
}

export interface IOrders {
  id: number;
  date: string;
  quantity: number;
  paymentMethod: string;
}
export type AddressKey =
  | "firstAndLast"
  | "postalIndex"
  | "deliveryAddress"
  | "geolocation"
  | "addressDetails"
  | "id";
export interface IAddress {
  firstAndLast: string | undefined;
  postalIndex: string | undefined;
  deliveryAddress: string | undefined;
  addressDetails: string | undefined;
  geolocation: string | undefined;
  id: string | undefined;
}
