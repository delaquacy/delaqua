"use client";

import { useScreenSize } from "@/app/hooks";
import { Box, Tabs } from "@mui/material";

import { useState } from "react";
import { GoodsAvailableTable } from "../GoodsAvailableTable";
import { GoodsIncomingForm } from "../GoodsIncomingForm";
import { GoodsInvoicesTable } from "../GoodsInvoicesTable";
import { AddNewGoodForm } from "../AddNewGoodForm";
import { GoodTab } from "./styled";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
          width: "100%",
          display: "flex",

          "& .MuiTabs-flexContainer": {
            flexDirection: isSmallScreen ? "column" : "row",
            padding: "10px",
          },
        }}
      >
        <GoodTab
          isCurrentTab={value === 0}
          label="Goods available at the warehouse"
          {...a11yProps(0)}
        />

        <GoodTab
          isCurrentTab={value === 1}
          label="Incoming Form"
          {...a11yProps(1)}
        />

        <GoodTab
          isCurrentTab={value === 2}
          label="Goods Invoices List"
          {...a11yProps(2)}
        />

        <GoodTab
          isCurrentTab={value === 3}
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "scroll",
      }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children} </Box>}
    </Box>
  );
}
