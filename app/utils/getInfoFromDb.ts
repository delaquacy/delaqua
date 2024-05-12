import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/config";
import { InfoData } from "../lib/definitions";

export const getInfoFromDB = async (): Promise<InfoData | null> => {
  try {
    const infoDocRef = doc(db, "info", "30d44uUHRTvcQegp5fcg");
    const infoDocSnapshot = await getDoc(infoDocRef);

    if (infoDocSnapshot.exists()) {
      const infoData = infoDocSnapshot.data();

      const status = infoData.status;
      const enText = infoData.enText;
      const elText = infoData.elText;
      const ruText = infoData.ruText;
      const ukText = infoData.ukText;

      return { status, enText, ruText, ukText, elText };
    } else {
      console.error("Info document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
