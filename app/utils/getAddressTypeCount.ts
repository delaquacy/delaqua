import { Address } from "../types";

export const getAddressTypeCount = (addresses: Address[]) => {
  return addresses.reduce(
    (acc, { addressType }) => {
      if (addressType === "Business") {
        acc.business += 1;
      } else {
        acc.home += 1;
      }
      return acc;
    },
    {
      home: 0,
      business: 0,
    }
  );
};
