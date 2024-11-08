import { SharedButton } from "@/app/components/shared";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Settings } from "../../index";
import { LanguageTextList } from "../LanguageTextList";

interface EditModeProps {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  onSave: () => void;
  onCancel: () => void;
}

export const EditMode = ({
  settings,
  setSettings,
  onSave,
  onCancel,
}: EditModeProps) => {
  const handlePopupTextChange = (lang: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      popupTexts: {
        ...prev.popupTexts,
        [lang]: value,
      },
    }));
  };

  const handleWidgetTextChange = (lang: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      widgetTexts: {
        ...prev.widgetTexts,
        [lang]: value,
      },
    }));
  };

  return (
    <Box>
      <Box sx={{ padding: "20px", display: "flex", gap: "10px" }}>
        <Box flex={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.isPopupEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, isPopupEnabled: e.target.checked })
                }
              />
            }
            label="Enable Popup"
          />

          <Box
            sx={{
              marginTop: "10px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography>Popup Texts</Typography>
            <LanguageTextList
              texts={settings.popupTexts}
              isEditing={true}
              onChange={handlePopupTextChange}
            />
          </Box>
        </Box>

        <Box flex={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.isWidgetEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    isWidgetEnabled: e.target.checked,
                  })
                }
              />
            }
            label="Enable Widget"
          />

          <Box
            sx={{
              marginTop: "10px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography>Widget Texts</Typography>
            <LanguageTextList
              texts={settings.widgetTexts}
              isEditing={true}
              onChange={handleWidgetTextChange}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <SharedButton text="Save" onClick={onSave} variantType="success" />
        <SharedButton text="Cancel" onClick={onCancel} variantType="error" />
      </Box>
    </Box>
  );
};
