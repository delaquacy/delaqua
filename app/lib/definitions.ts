export interface IForm {
  firstAndLast: string;
  phoneNumber?: string | undefined;
  postalIndex: string;
  deliveryAddress?: string;
  addressDetails: string;
  geolocation: string;
  pump?: boolean;
  bottlesNumberToBuy: number;
  bottlesNumberToReturn: number;
  deliveryDate: Date;
  deliveryTime: string;
  paymentMethod: string;
  paymentId?: string;
  comments?: string;
  createdAt?: string;
  id?: string;
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
  archived: boolean | undefined;
  numberOfBottles: number | undefined;
  createdAt?: any;
}
