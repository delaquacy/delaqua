import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AddCircleOutline,
  CancelOutlined,
  DeleteOutline,
  FileDownloadOutlined,
  TaskAlt,
  FilterList,
  CheckCircle,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { updateOrderStatus, getFormattedDataForCVS } from "@/app/utils";
import { OrdersTableFilter } from "../OrdersTableFilter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CSVLink } from "react-csv";
import { FilterItem, OrdersData } from "@/app/types";
import { useScreenSize } from "@/app/hooks";
import dayjs from "dayjs";

interface OrdersTableToolbarProps {
  selected: string[];
  filters: FilterItem[];
  filteredRows: OrdersData[];
  onStatusUpdate: () => void;
  onFiltersClear: () => void;
  onFilterChange: Dispatch<SetStateAction<FilterItem[]>>;
  onFiltersApply: () => void;
}

export function OrdersTableToolbar(props: OrdersTableToolbarProps) {
  const {
    selected,
    filters,
    filteredRows,
    onStatusUpdate,
    onFilterChange,
    onFiltersApply,
    onFiltersClear,
  } = props;

  const { isSmallScreen } = useScreenSize();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dataForCVS, setDataForCVS] = useState<any[]>([]);

  const numSelected = selected.length;
  const open = Boolean(anchorEl);

  const handleAddFilter = () => {
    const newFilter = {
      id: `${Date.now()}`,
      column: "",
      operator: "",
      value1: "",
    };
    onFilterChange((prev) => [...prev, newFilter]);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (filters.length === 0) {
      handleAddFilter();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCompleted = async () => {
    await updateOrderStatus(selected, "completed");
    onStatusUpdate();
  };

  const handleCanceled = async () => {
    await updateOrderStatus(selected, "canceled");
    onStatusUpdate();
  };

  const handleClearAllFilters = () => {
    onFiltersClear();
    handleAddFilter();
    handleClose();
  };

  useEffect(() => {
    const formatted = getFormattedDataForCVS(filteredRows);
    setDataForCVS(formatted);
  }, [filteredRows]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toolbar
        sx={{
          boxShadow: "0px 4px 7px -3px rgba(66, 68, 90, 1)",
          marginBottom: "5px",
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: "#D1E3F6",
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
            fontSize={isSmallScreen ? "24px" : "30px"}
            fontWeight="bold"
          >
            Orders
          </Typography>
        )}
        {numSelected > 0 ? (
          <>
            <Tooltip title="Mark as Completed" onClick={handleCompleted}>
              <IconButton>
                <CheckCircle />
              </IconButton>
            </Tooltip>

            <Tooltip title="Mark as Canceled" onClick={handleCanceled}>
              <IconButton>
                <CancelOutlined />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Box display="flex" flexDirection="row">
            {dataForCVS.length > 0 && (
              <CSVLink
                data={dataForCVS}
                filename={`Orders_Report_${dayjs().format("DD-MM-YYYY")}.csv`}
              >
                <Tooltip title="Download CSV">
                  <IconButton id="download-button" size="large">
                    <FileDownloadOutlined fontSize="large" />
                  </IconButton>
                </Tooltip>
              </CSVLink>
            )}
            <Tooltip title="Filter list">
              <IconButton
                size="large"
                id="filter-button"
                aria-controls={open ? "filter-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <FilterList fontSize="large" />
              </IconButton>
            </Tooltip>
            <Menu
              id="filter-menu"
              sx={
                isSmallScreen
                  ? {
                      "& .MuiPaper-root": {
                        maxWidth: "98%",
                        left: "4px !important",
                      },
                    }
                  : {}
              }
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "filter-button",
              }}
            >
              <OrdersTableFilter
                filters={filters}
                onFilterChange={onFilterChange}
              />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                paddingInline={3}
              >
                <Button
                  variant="contained"
                  onClick={handleAddFilter}
                  size={isSmallScreen ? "small" : "medium"}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: isSmallScreen ? "10px" : "12px",
                  }}
                >
                  <AddCircleOutline
                    fontSize="small"
                    sx={{
                      marginRight: 1,
                    }}
                  />
                  Add filter
                </Button>
                <Button
                  variant="contained"
                  size={isSmallScreen ? "small" : "medium"}
                  onClick={() => {
                    onFiltersApply();
                    handleClose();
                  }}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: isSmallScreen ? "10px" : "12px",
                    background: "#478547",
                    ":hover": {
                      background: "#356435",
                    },
                  }}
                >
                  <TaskAlt
                    fontSize="small"
                    sx={{
                      marginRight: 1,
                    }}
                  />
                  Apply filters
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilters}
                  size={isSmallScreen ? "small" : "medium"}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: isSmallScreen ? "10px" : "12px",
                    background: "#B43636",
                    ":hover": { background: "#7D2525" },
                  }}
                >
                  <DeleteOutline
                    fontSize="small"
                    sx={{
                      marginRight: 1,
                    }}
                  />
                  Clear filters
                </Button>
              </Box>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </LocalizationProvider>
  );
}
