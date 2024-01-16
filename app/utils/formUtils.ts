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
  numReturnedBottles: number
) {
  const basePricePerBottle = 5.5;

  const pricePerBottle =
    numOrderedBottles <= 1
      ? 7
      : numOrderedBottles <= 9
      ? 6
      : basePricePerBottle;

  const depositPerBottle = 10;

  const paymentForWater = numOrderedBottles * pricePerBottle;
  const depositForBottles =
    Math.max(numOrderedBottles - numReturnedBottles, 0) *
    depositPerBottle;
  const totalPayments = paymentForWater + depositForBottles;

  return {
    paymentForWater,
    depositForBottles,
    totalPayments,
  };
}
