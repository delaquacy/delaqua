import { useToast } from "@/app/hooks";
import { InfoManagementService } from "@/app/lib/InfoManagementService";
import { Box } from "@mui/material";
import { DateList } from "../DateList";
import { StyledDescription } from "./styled";

export const ManageDisabledDatesTab = ({
  disabledDates,
}: {
  disabledDates: string[];
}) => {
  const { showSuccessToast } = useToast();

  const removeDateFromList = async (dateToRemove: string) => {
    try {
      await InfoManagementService.deleteDisabledDate(dateToRemove);
      showSuccessToast(`Date ${dateToRemove} removed successfully`);
    } catch (error) {
      console.error("Error deleting date:", error);
    }
  };

  return (
    <Box>
      <StyledDescription>
        Here you can view and delete the dates that are disabled for order
        deliveries. To remove a date, simply click the trash icon.
      </StyledDescription>

      <DateList
        dates={disabledDates}
        tooltipMessage="Delete this date from Firebase"
        onDelete={removeDateFromList}
      />
    </Box>
  );
};
