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
