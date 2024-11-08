"use client";

import { useToast } from "@/app/hooks";
import { InfoManagementService } from "@/app/lib/InfoManagementService";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Loader } from "../Loader";
import { EditMode } from "./components/EditMode";
import { ViewMode } from "./components/ViewMode";
import { AnnouncementManagementWrapper } from "./styled";

export interface Texts {
  en: string;
  uk: string;
  ru: string;
  gr: string;
}

export interface Settings {
  isPopupEnabled: boolean;
  isWidgetEnabled: boolean;
  popupTexts: Texts;
  widgetTexts: Texts;
}

export const emptyTexts = { en: "", uk: "", ru: "", gr: "" };

export const AnnouncementManagement = () => {
  const { showSuccessToast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    isPopupEnabled: false,
    isWidgetEnabled: false,
    popupTexts: emptyTexts,
    widgetTexts: emptyTexts,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSetSettings = (settings: Settings) => {
    setSettings(settings);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe =
      InfoManagementService.getAnnouncementManagementSettings(
        handleSetSettings
      );
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSave = async () => {
    try {
      await InfoManagementService.saveSettings(settings);
      showSuccessToast("Settings saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AnnouncementManagementWrapper>
      <Typography variant="h5" gutterBottom>
        Manage Popup and Widget
      </Typography>

      {isEditing ? (
        <EditMode
          settings={settings}
          setSettings={setSettings}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ViewMode
          settings={settings}
          onEdit={() => setIsEditing(true)}
          emptyTexts={emptyTexts}
        />
      )}
    </AnnouncementManagementWrapper>
  );
};
