import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/config";

const useDatesFromDB = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const datesDocRef = doc(
          db,
          "unableDates",
          "02IFEIwy6AhlfH8Vj1Zo"
        );
        const datesDocSnapshot = await getDoc(datesDocRef);

        if (datesDocSnapshot.exists()) {
          const datesData = datesDocSnapshot.data();
          setDates(datesData.dates || []);
        } else {
          console.error("UnableDates document does not exist");
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();
    return () => {};
  }, []);

  return dates;
};

export default useDatesFromDB;
