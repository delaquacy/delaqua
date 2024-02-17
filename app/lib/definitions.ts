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

export type AddressKey =
  | "firstAndLast"
  | "postalIndex"
  | "deliveryAddress"
  | "geolocation"
  | "addressDetails"
  | "pump"
  | "id";
export interface IAddress {
  firstAndLast: string | undefined;
  postalIndex: string | undefined;
  deliveryAddress: string | undefined;
  addressDetails: string | undefined;
  geolocation: string | undefined;
  pump: boolean;
  id: string | undefined;
}
