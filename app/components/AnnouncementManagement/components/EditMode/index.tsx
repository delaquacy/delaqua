import { SharedButton } from "@/app/components/shared";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Settings } from "../../index";
import { LanguageTextList } from "../LanguageTextList";
import {
  ButtonBox,
  LanguageTextWrapper,
  ListBox,
  ListsWrapper,
} from "./styled";

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
      <ListsWrapper>
        <ListBox>
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

          <LanguageTextWrapper>
            <Typography>Popup Texts</Typography>
            <LanguageTextList
              texts={settings.popupTexts}
              isEditing={true}
              onChange={handlePopupTextChange}
            />
          </LanguageTextWrapper>
        </ListBox>

        <ListBox>
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

          <LanguageTextWrapper>
            <Typography>Widget Texts</Typography>
            <LanguageTextList
              texts={settings.widgetTexts}
              isEditing={true}
              onChange={handleWidgetTextChange}
            />
          </LanguageTextWrapper>
        </ListBox>
      </ListsWrapper>

      <ButtonBox>
        <SharedButton text="Save" onClick={onSave} variantType="success" />
        <SharedButton text="Cancel" onClick={onCancel} variantType="error" />
      </ButtonBox>
    </Box>
  );
};
