import { SharedButton } from "@/app/components/shared";
import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { useScreenSize, useToast } from "@/app/hooks";
import { getFormattedDataForCVS, updateOrderStatus } from "@/app/utils";
import {
  AddCircleOutline,
  DeleteOutline,
  FileDownloadOutlined,
  FilterList,
  TaskAlt,
} from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { AddCommentModal } from "../AddCommentModal";
import { OrdersTableFilter } from "../OrdersTableFilter";
import {
  FilterButtonsWrapper,
  SelectedMenuWrapper,
  StyledToolbar,
  Title,
  TitleButtonsWrapper,
} from "./styled";

export function OrdersTableToolbar() {
  const {
    selected,
    filters,
    filteredRows,
    todayFilter,
    tomorrowFilter,
    setFilters,
    setSelected,
    handleClearFilters,
    handleApplyTodayFilter,
    handleApplyTomorrowFilter,
    handleApplyFilters,
  } = useOrdersTableContext();

  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast } = useToast();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dataForCVS, setDataForCVS] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const numSelected = selected.length;
  const open = Boolean(anchorEl);

  const handleAddFilter = () => {
    const newFilter = {
      id: `${Date.now()}`,
      column: "",
      operator: "",
      value1: "",
    };
    setFilters((prev) => [...prev, newFilter]);
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

  const handleChangeStatus = async () => {
    if (!paymentStatus && !orderStatus) return;

    await updateOrderStatus(selected, paymentStatus, orderStatus);
    showSuccessToast("Status successfully changed");
    setSelected([]);
    setOrderStatus("");
    setPaymentStatus("");
  };

  const handleCancelChange = () => {
    setSelected([]);
    setOrderStatus("");
    setPaymentStatus("");
  };

  const handleClearAllFilters = () => {
    handleClearFilters();
    handleAddFilter();
    handleClose();
  };

  useEffect(() => {
    const formatted = getFormattedDataForCVS(filteredRows);
    setDataForCVS(formatted);
  }, [filteredRows]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledToolbar show_bg={numSelected > 0 ? "show" : ""}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Title variant="h6" id="tableTitle">
            Orders {todayFilter.isToday && `for today (${todayFilter.day})`}
            {tomorrowFilter.isTomorrow &&
              `for tomorrow (${tomorrowFilter.day})`}
          </Title>
        )}
        {numSelected > 0 ? (
          <SelectedMenuWrapper>
            <SharedButton
              onClick={() => setOpenCommentModal(true)}
              width={isSmallScreen ? "100%" : "130px"}
              text="Add comment"
            />

            <Select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                width: isSmallScreen ? "100%" : "201px",
              }}
            >
              <MenuItem value="" disabled>
                Change Order Status
              </MenuItem>
              <MenuItem value="In delivery">In delivery</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled (admin)">{`Cancelled (admin)`}</MenuItem>
            </Select>

            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                width: isSmallScreen ? "100%" : "223px",
              }}
            >
              <MenuItem value="" disabled>
                Change Payment Status
              </MenuItem>
              <MenuItem value="Paid Cash">Paid Cash</MenuItem>
              <MenuItem value="Paid Other">Paid Other</MenuItem>
            </Select>

            <SharedButton
              onClick={handleChangeStatus}
              disabled={!orderStatus && !paymentStatus}
              text="Apply"
            />

            <SharedButton
              onClick={handleCancelChange}
              variantType="error"
              text="Cancel"
            />
          </SelectedMenuWrapper>
        ) : (
          <TitleButtonsWrapper>
            <SharedButton
              onClick={handleApplyTodayFilter}
              text="Today"
              width="140px"
            />
            <SharedButton
              onClick={handleApplyTomorrowFilter}
              text="Tomorrow"
              width="140px"
            />

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
                onFilterChange={setFilters}
              />
              <FilterButtonsWrapper>
                <SharedButton
                  onClick={handleAddFilter}
                  size={isSmallScreen ? "small" : "medium"}
                  text=" Add filter"
                  width="130px"
                  icon={
                    <AddCircleOutline
                      fontSize="small"
                      sx={{
                        marginRight: 1,
                      }}
                    />
                  }
                />

                <SharedButton
                  onClick={() => {
                    handleApplyFilters();
                    handleClose();
                  }}
                  size={isSmallScreen ? "small" : "medium"}
                  text=" Apply filters"
                  variantType="success"
                  width="140px"
                  icon={
                    <TaskAlt
                      fontSize="small"
                      sx={{
                        marginRight: 1,
                      }}
                    />
                  }
                />

                <SharedButton
                  onClick={handleClearAllFilters}
                  size={isSmallScreen ? "small" : "medium"}
                  text=" Clear filters"
                  width="140px"
                  variantType="error"
                  icon={
                    <DeleteOutline
                      fontSize="small"
                      sx={{
                        marginRight: 1,
                      }}
                    />
                  }
                />
              </FilterButtonsWrapper>
            </Menu>
          </TitleButtonsWrapper>
        )}
      </StyledToolbar>

      <AddCommentModal
        open={openCommentModal}
        onClose={() => setOpenCommentModal(false)}
        selected={selected}
        setSelected={setSelected}
      />
    </LocalizationProvider>
  );
}
