import { collection, onSnapshot } from "firebase/firestore";
import { FirebaseService } from "../FirebaseServices";
import { db } from "../config";

interface Date {
  id: string;
}

export const InfoManagementService = {
  async addNewDates(dates: string[]) {
    const promises = dates.map((date) =>
      FirebaseService.setDocument(`disabledDeliveryDates`, date, {
        date,
      })
    );

    await Promise.all(promises);
    return dates;
  },

  getAllDisabledDates(callback: (dates: string[]) => void): () => void {
    const ref = collection(db, `disabledDeliveryDates`);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const dates = snapshot.docs.map((doc) => doc.id);
      callback(dates);
    });

    return unsubscribe; // Повертаємо функцію для відписки
  },

  async deleteDisabledDate(date: string) {
    await FirebaseService.deleteDocument(`disabledDeliveryDates`, date);
  },
};
