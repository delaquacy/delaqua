import { FirebaseService } from "../FirebaseServices";

export const AddressesService = {
  async addNewAddress(userId: string, addressData: any) {
    const docId = await FirebaseService.addDocument(
      `users/${userId}/addresses`,
      addressData
    );

    return docId;
  },

  async updateAddress(userId: string, addressId: string, data: any) {
    await FirebaseService.updateDocument(
      `users/${userId}/addresses`,
      addressId,
      data
    );
  },

  async transferBottles(
    userId: string,
    newAddressId: string,
    newNumberOfBottles: string
  ) {
    const newAddressData = await FirebaseService.getDocument(
      `users/${userId}/addresses`,
      newAddressId
    );

    const currentNumberOfBottles = +newAddressData.numberOfBottles || 0;
    const updatedNumberOfBottles = currentNumberOfBottles + +newNumberOfBottles;

    await this.updateAddress(userId, newAddressId, {
      numberOfBottles: updatedNumberOfBottles.toString(),
    });
  },
};
