"use client";

import { useScreenSize } from "@/app/hooks";
import { Box, Tab, Tabs } from "@mui/material";

import { useState } from "react";
import { GoodsAvailableTable } from "../GoodsAvailableTable";
import { GoodsIncomingForm } from "../GoodsIncomingForm";
import { GoodsInvoicesTable } from "../GoodsInvoicesTable";
import { AddNewGoodForm } from "../AddNewGoodForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children} </Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const GoodsTabs = () => {
  const [value, setValue] = useState(0);
  const { isSmallScreen } = useScreenSize();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
        sx={{
          width: "100vw",
          display: "flex",

          "& .MuiTabs-flexContainer": {
            flexDirection: isSmallScreen ? "column" : "row",
            padding: "10px",
          },
        }}
      >
        <Tab
          sx={{
            flex: 1,
            maxWidth: "100%",
            borderRadius: "10px",
            transition: "all 0.3s",
            background: value === 0 ? "#F1F1F1" : "",
            ":hover": {
              background: "#F1F1F1",
            },
          }}
          label="Goods available at the warehouse"
          {...a11yProps(0)}
        />

        <Tab
          sx={{
            flex: 1,
            maxWidth: "100%",
            transition: "all 0.3s",
            borderRadius: "10px",
            background: value === 1 ? "#F1F1F1" : "",
            ":hover": {
              background: "#F1F1F1",
            },
          }}
          label="Incoming Form"
          {...a11yProps(1)}
        />

        <Tab
          sx={{
            flex: 1,
            maxWidth: "100%",
            transition: "all 0.3s",
            borderRadius: "10px",
            background: value === 2 ? "#F1F1F1" : "",
            ":hover": {
              background: "#F1F1F1",
            },
          }}
          label="Goods Invoices List"
          {...a11yProps(2)}
        />

        <Tab
          sx={{
            flex: 1,
            maxWidth: "100%",
            transition: "all 0.3s",
            ":hover": {
              background: "#F1F1F1",
              borderRadius: "10px",
            },
          }}
          label="Add New Good"
          {...a11yProps(3)}
        />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <GoodsAvailableTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GoodsIncomingForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <GoodsInvoicesTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <AddNewGoodForm />
      </CustomTabPanel>
    </Box>
  );
};
