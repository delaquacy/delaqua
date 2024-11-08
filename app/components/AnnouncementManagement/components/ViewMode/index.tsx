import { SharedButton } from "@/app/components/shared";
import { Box, Chip, Typography } from "@mui/material";

import { Settings, Texts } from "../../index";
import { LanguageTextList } from "../LanguageTextList";

interface ViewModeProps {
  settings: Settings;
  onEdit: () => void;
  emptyTexts: Texts;
}

export const ViewMode = ({ settings, onEdit, emptyTexts }: ViewModeProps) => {
  return (
    <Box>
      <Box sx={{ padding: "20px", display: "flex", gap: "30px" }}>
        <Box flex={1}>
          <Chip
            label={settings.isPopupEnabled ? "Visible" : "Hidden"}
            color={settings.isPopupEnabled ? "success" : "error"}
            sx={{ marginBottom: "10px" }}
          />
          <Typography variant="h6">Popup Texts</Typography>
          <LanguageTextList
            texts={settings.isPopupEnabled ? settings.popupTexts : emptyTexts}
            isEditing={false}
          />
        </Box>

        <Box flex={1}>
          <Chip
            label={settings.isWidgetEnabled ? "Visible" : "Hidden"}
            color={settings.isWidgetEnabled ? "success" : "error"}
            sx={{ marginBottom: "10px" }}
          />
          <Typography variant="h6">Widget Texts</Typography>
          <LanguageTextList
            texts={settings.isWidgetEnabled ? settings.widgetTexts : emptyTexts}
            isEditing={false}
          />
        </Box>
      </Box>

      <SharedButton
        text="Edit Settings"
        variantType="primary"
        onClick={onEdit}
        width="120px"
      />
    </Box>
  );
};
