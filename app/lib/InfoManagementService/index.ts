import { collection, doc, onSnapshot } from "firebase/firestore";
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

    return unsubscribe;
  },

  async deleteDisabledDate(date: string) {
    await FirebaseService.deleteDocument(`disabledDeliveryDates`, date);
  },

  async saveSettings(settings: any) {
    await FirebaseService.setDocument(
      "announcementManagement",
      "settings",
      settings
    );
  },

  getAnnouncementManagementSettings(
    callback: (settings: any) => void
  ): () => void {
    const settingsRef = doc(db, "announcementManagement", "settings");

    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback({
          isPopupEnabled: false,
          isWidgetEnabled: false,
          popupTexts: { en: "", ua: "", ru: "", gr: "" },
          widgetTexts: { en: "", ua: "", ru: "", gr: "" },
        });
      }
    });

    return unsubscribe;
  },
};
