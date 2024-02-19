export function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) {
    return "";
  }

  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

  const formattedPhoneNumber = `+${cleanedPhoneNumber.slice(
    0,
    3
  )} ${cleanedPhoneNumber.slice(3, 5)} ${cleanedPhoneNumber.slice(
    5,
    8
  )} ${cleanedPhoneNumber.slice(8)}`;

  return formattedPhoneNumber;
}

export function calculatePrice(
  numOrderedBottles: number,
  numReturnedBottles: number,
  pomp: any
) {
  let pompNumber;
  if (pomp) {
    pompNumber = 10;
  } else {
    pompNumber = 0;
  }
  const basePricePerBottle = 5.5;

  const pricePerBottle =
    numOrderedBottles <= 1
      ? 7
      : numOrderedBottles <= 9
      ? 6
      : basePricePerBottle;

  const depositPerBottle = 7;

  const paymentForWater = numOrderedBottles * pricePerBottle;
  const depositForBottles =
    Math.max(numOrderedBottles - numReturnedBottles, 0) *
    depositPerBottle;
  const totalPayments =
    paymentForWater + depositForBottles + pompNumber;

  return {
    paymentForWater,
    depositForBottles,
    totalPayments,
    pompNumber,
  };
}

export const bottlesCalculate = (
  bottlesToBuy: number,
  bottlesToReturn: number,
  currentBottlesNumber: number
) => {
  return currentBottlesNumber + bottlesToBuy - bottlesToReturn;
};
