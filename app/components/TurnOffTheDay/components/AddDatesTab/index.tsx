import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";

import { SharedButton } from "@/app/components/shared";
import { useToast } from "@/app/hooks";
import { InfoManagementService } from "@/app/lib/InfoManagementService";
import { shouldDisableDate } from "@/app/utils";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import { DateList } from "../DateList";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Nicosia");

export const AddDatesTab = ({ disabledDates }: { disabledDates: string[] }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const { showSuccessToast } = useToast();

  const isPastDate = selectedDate?.isSameOrBefore(dayjs(), "day");

  const addDateToList = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.format("DD-MM-YYYY");
      if (!dates.includes(formattedDate)) {
        setDates((prevDates) => [...prevDates, formattedDate]);
      }
    }
  };

  const removeDateFromList = (dateToRemove: string) => {
    setDates((prevDates) => prevDates.filter((date) => date !== dateToRemove));
  };

  const handleClearAllDates = () => {
    setDates([]);
  };

  const handleSubmit = async () => {
    try {
      await InfoManagementService.addNewDates(dates);
      showSuccessToast("Dates successfully submitted!");
      handleClearAllDates();
    } catch (error) {
      console.error("Error submitting dates:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <DatePicker
          label={"Select Date"}
          format="DD-MM-YYYY"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          disablePast
          shouldDisableDate={(date: Dayjs) =>
            shouldDisableDate(date, disabledDates)
          }
          sx={{ width: "250px" }}
        />

        <SharedButton
          text="Add date"
          onClick={addDateToList}
          variantType="success"
          disabled={isPastDate}
          width="100px"
        />
      </Box>

      {dates.length > 0 && (
        <DateList
          dates={dates}
          tooltipMessage="Remove this date"
          onDelete={removeDateFromList}
        />
      )}
      {dates.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <SharedButton
            text="Submit Dates"
            onClick={handleSubmit}
            variantType="success"
            width="110px"
          />
          <SharedButton
            text="Clear Dates"
            onClick={handleClearAllDates}
            variantType="error"
            width="100px"
          />
        </Box>
      )}
    </Box>
  );
};
