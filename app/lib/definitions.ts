export interface IForm {
  firstAndLast: string;
  phoneNumber: string;
  postalIndex: string;
  deliveryAddress: string;
  addressDetails: string;
  geolocation: string;
  pump: string;
  bottlesNumber: string;
  deliveryDate: Date;
  deliveryTime: string;
  paymentMethod: string;
  comments?: string;
}

export interface IOrders {
  id: number;
  date: string;
  quantity: number;
  paymentMethod: string;
}
