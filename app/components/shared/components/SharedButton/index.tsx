import { useScreenSize } from "@/app/hooks";
import { Button, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface SharedButtonProps {
  onClick: () => void;
  size?: "small" | "medium" | "large";
  text: string;
  icon?: ReactNode;
  variantType?: "primary" | "success" | "error" | "warning";
  fontSize?: string;
  loading?: boolean;
  disabled?: boolean;
  width?: string;
}

export const SharedButton = ({
  onClick,
  size = "medium",
  text,
  icon,
  variantType = "primary",
  fontSize = "12px",
  disabled = false,
  loading = false,
  width,
}: SharedButtonProps) => {
  const { background, hoverBackground } = getButtonStyles(variantType);
  const { isSmallScreen } = useScreenSize();

  return (
    <Button
      variant="contained"
      size={size}
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: "capitalize",
        fontSize: fontSize ? fontSize : isSmallScreen ? "10px" : "12px",
        background: background,
        ":hover": {
          background: hoverBackground,
        },
        display: "flex",
        alignItems: "center",
        width: width || "",
      }}
    >
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <>
          {icon && (
            <span
              style={{
                marginRight: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </span>
          )}
          {text}
        </>
      )}
    </Button>
  );
};

const getButtonStyles = (variantType: string) => {
  switch (variantType) {
    case "primary":
      return {
        background: "#1976d2",
        hoverBackground: "#115293",
      };
    case "success":
      return {
        background: "#478547",
        hoverBackground: "#356435",
      };
    case "error":
      return {
        background: "#B43636",
        hoverBackground: "#7D2525",
      };
    case "warning":
      return {
        background: "#FFC107",
        hoverBackground: "#FFA000",
      };
    default:
      return {
        background: "#1976d2",
        hoverBackground: "#115293",
      };
  }
};
