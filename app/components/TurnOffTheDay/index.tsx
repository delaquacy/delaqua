"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { AddDatesTab, ManageDisabledDatesTab } from "./components";

import { InfoManagementService } from "@/app/lib/InfoManagementService";
import { Tab, Tabs } from "@mui/material";
import {
  StyledTabPanel,
  StyledTabsContainer,
  StyledTitle,
  TurnOffTheDayWrapper,
} from "./styled";

export const TurnOffTheDay = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const unsubscribe = InfoManagementService.getAllDisabledDates((dates) => {
      setDisabledDates(dates);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TurnOffTheDayWrapper>
        <StyledTitle>Manage Delivery Dates</StyledTitle>

        <StyledTabsContainer>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              marginBottom: "30px",
            }}
          >
            <Tab label="Add Dates" />
            <Tab label="Manage Disabled Dates" />
          </Tabs>

          <StyledTabPanel hidden={selectedTab !== 0}>
            <AddDatesTab disabledDates={disabledDates} />
          </StyledTabPanel>

          <StyledTabPanel hidden={selectedTab !== 1}>
            <ManageDisabledDatesTab disabledDates={disabledDates} />
          </StyledTabPanel>
        </StyledTabsContainer>
      </TurnOffTheDayWrapper>
    </LocalizationProvider>
  );
};
