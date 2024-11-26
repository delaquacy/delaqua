"use client";

import { useScreenSize } from "@/app/hooks";
import { Box, Tabs } from "@mui/material";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddNewGoodForm } from "../AddNewGoodForm";
import { GoodsAvailableTable } from "../GoodsAvailableTable";
import { GoodsCalculationTable } from "../GoodsCalculationTable";
import { GoodsIncomingForm } from "../GoodsIncomingForm";
import { GoodsInvoicesTable } from "../GoodsInvoicesTable";
import { WriteOffList } from "../WriteOffList";
import { GoodTab } from "./styled";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const GoodsTabs = () => {
  const [value, setValue] = useState(0);
  const { isSmallScreen } = useScreenSize();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    router.push(`/admin_dashboard/goods?tab=${newValue}`);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && !isNaN(Number(tab))) {
      setValue(Number(tab));
    }
  }, [searchParams]);

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
          is_current_tab={(value === 0).toString()}
          label="Goods available at the warehouse"
          {...a11yProps(0)}
        />

        <GoodTab
          is_current_tab={(value === 1).toString()}
          label="Incoming Form"
          {...a11yProps(1)}
        />

        <GoodTab
          is_current_tab={(value === 2).toString()}
          label="Goods Incoming Invoices List"
          {...a11yProps(2)}
        />
        <GoodTab
          is_current_tab={(value === 3).toString()}
          label="Write Off List"
          {...a11yProps(3)}
        />

        <GoodTab
          is_current_tab={(value === 4).toString()}
          label="Add New Good"
          {...a11yProps(4)}
        />
        <GoodTab
          is_current_tab={(value === 5).toString()}
          label="Goods calculation"
          {...a11yProps(5)}
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
        <WriteOffList />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <AddNewGoodForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <GoodsCalculationTable />
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
