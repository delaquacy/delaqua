"use client";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import WrapperFooter from "../WrapperFooter/WrapperFooter";
import WrapperHeader from "../WrapperHeader/WrapperHeader";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        justifyContent: pathname.includes("/admin_dashboard")
          ? ""
          : "space-between",
      }}
    >
      <WrapperHeader />
      {children}
      <WrapperFooter />
    </Box>
  );
};

export default LayoutContent;
