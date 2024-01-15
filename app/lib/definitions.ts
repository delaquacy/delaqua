export interface IForm {
  firstAndLast: string;
  phoneNumber: string;
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
