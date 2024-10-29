"use client";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FilterItem, OrdersData } from "../types";
import {
  getComparator,
  getFilteredOrders,
  getOrdersArray,
  stableSort,
} from "../utils";

dayjs.extend(customParseFormat);

type Order = "asc" | "desc";

interface TodayFilter {
  isToday: boolean;
  day: string;
}
interface TomorrowFilter {
  isTomorrow: boolean;
  day: string;
}

interface OrdersTableContextType {
  selected: string[];
  tableRef: MutableRefObject<any> | null;
  visibleRows: any[];
  emptyRows: number;
  loading: boolean;
  filteredRows: OrdersData[];
  rows: OrdersData[];
  rowsPerPage: number;
  page: number;
  filters: FilterItem[];
  todayFilter: TodayFilter;
  tomorrowFilter: TomorrowFilter;
  orderBy: keyof OrdersData;
  order: Order;
  editOrderMode: boolean;
  editRowId: string;
  toggleEditMode: (id: string) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  setFilters: Dispatch<SetStateAction<FilterItem[]>>;
  setSelected: Dispatch<SetStateAction<string[]>>;
  handleClearFilters: () => void;
  handleApplyTodayFilter: () => void;
  handleApplyTomorrowFilter: () => void;
  handleApplyFilters: () => void;
  handleSelectAllClick: () => void;
  handleRequestSort: (
    event: MouseEvent<unknown>,
    property: keyof OrdersData
  ) => void;
  handleClick: (id: string) => void;
  setEditOrderMode: Dispatch<SetStateAction<boolean>>;
}

export const OrdersTableContext = createContext<OrdersTableContextType>({
  selected: [],
  tableRef: null,
  visibleRows: [],
  emptyRows: 0,
  loading: false,
  filteredRows: [],
  rows: [],
  rowsPerPage: 25,
  page: 0,
  filters: [],
  todayFilter: {
    isToday: true,
    day: dayjs().format("dddd, DD.MM.YYYY"),
  },
  tomorrowFilter: {
    isTomorrow: false,
    day: dayjs().add(1, "day").format("dddd, DD.MM.YYYY"),
  },
  orderBy: "deliveryDate",
  order: "asc",
  editOrderMode: false,
  editRowId: "",
  toggleEditMode: () => {},
  handleChangePage: () => {},
  handleChangeRowsPerPage: () => {},
  setFilters: () => {},
  setSelected: () => {},
  handleClearFilters: () => {},
  handleApplyTodayFilter: () => {},
  handleApplyTomorrowFilter: () => {},
  handleApplyFilters: () => {},
  handleRequestSort: () => {},
  handleSelectAllClick: () => {},
  handleClick: () => {},
  setEditOrderMode: () => {},
});

type OrdersTableProviderProps = {
  children: ReactNode;
};
export const OrdersTableProvider = ({ children }: OrdersTableProviderProps) => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof OrdersData>("createdAt");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<OrdersData[]>([]);
  const [filteredRows, setFilteredRows] = useState<OrdersData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [applyFilters, setApplyFilters] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [editOrderMode, setEditOrderMode] = useState(false);
  const [editRowId, setEditRowId] = useState("");
  const [filters, setFilters] = useState<FilterItem[]>([
    {
      id: "1",
      column: "Delivery Date",
      operator: "",
      value1: dayjs() as any,
      value2: dayjs() as any,
    },
  ]);
  const [todayFilter, setTodayFilter] = useState({
    isToday: true,
    day: dayjs().format("dddd, DD.MM.YYYY"),
  });

  const [tomorrowFilter, setTomorrowFilter] = useState({
    isTomorrow: false,
    day: dayjs().add(1, "day").format("dddd, DD.MM.YYYY"),
  });

  const tableRef = useRef<any | null>(null);

  const handleApplyFilters = () => {
    setApplyFilters(true);
    setPage(0);
  };

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof OrdersData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (id: string) => {
    if (editOrderMode) return;

    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const toggleEditMode = (id: string) => {
    if (editRowId === id) {
      setEditRowId("");
      setEditOrderMode(false);
      return;
    }
    setEditRowId(id);
    setEditOrderMode(true);
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (tableRef.current) {
      tableRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows as any, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const handleSelectAllClick = () => {
    if (selected.length < visibleRows.length) {
      const newSelected = visibleRows.map((n) => n.id) as string[];
      setSelected((prev) => [...prev, ...newSelected]);
      return;
    }

    setSelected([]);
  };

  const handleClearFilters = () => {
    setFilteredRows(rows);
    setFilters([]);
    setTodayFilter((prev) => ({ ...prev, isToday: false }));
  };

  const handleApplyDateFilter = (
    dayOffset: number,
    isToday: boolean,
    isTomorrow: boolean
  ) => {
    let selectedDay = dayjs().add(dayOffset, "day");

    if (selectedDay.day() === 0) {
      selectedDay = selectedDay.add(1, "day");
    }

    setFilters([
      {
        id: "1",
        column: "Delivery Date",
        operator: "",
        value1: selectedDay as any,
        value2: selectedDay as any,
      },
    ]);

    setTodayFilter((prev) => ({ ...prev, isToday }));
    setTomorrowFilter((prev) => ({ ...prev, isTomorrow }));
    setApplyFilters(true);
  };

  const handleApplyTodayFilter = () => {
    handleApplyDateFilter(0, true, false);
  };
  const handleApplyTomorrowFilter = () => {
    handleApplyDateFilter(1, false, true);
  };

  useEffect(() => {
    const unsubscribe = getOrdersArray((data) => {
      const sorted = stableSort(data as any, getComparator(order, orderBy));
      setRows(sorted as any);
      filters.length ? setApplyFilters(true) : setFilteredRows(sorted as any);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (!rows.length || !applyFilters) {
      return;
    }

    const filteredOrders = getFilteredOrders(filters, rows);
    setFilteredRows(filteredOrders);
    setApplyFilters(false);

    const dateFilter = filters.find(
      (filter) => filter.column === "Delivery Date"
    );

    const isToday = (date: any) =>
      dayjs().startOf("day").isSame(dayjs(date).startOf("day"));

    if (
      dateFilter &&
      isToday(dateFilter.value1) &&
      isToday(dateFilter?.value2)
    ) {
      setTodayFilter((prev) => ({ ...prev, isToday: true }));
    } else {
      setTodayFilter((prev) => ({ ...prev, isToday: false }));
    }
  }, [rows, filters, applyFilters]);

  return (
    <OrdersTableContext.Provider
      value={{
        selected,
        tableRef,
        visibleRows,
        emptyRows,
        loading,
        filteredRows,
        rows,
        rowsPerPage,
        page,
        filters,
        todayFilter,
        tomorrowFilter,
        orderBy,
        order,
        editOrderMode,
        editRowId,
        toggleEditMode,
        handleChangePage,
        handleChangeRowsPerPage,
        setFilters,
        setSelected,
        handleClearFilters,
        handleApplyTodayFilter,
        handleApplyTomorrowFilter,
        handleApplyFilters,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        setEditOrderMode,
      }}
    >
      {children}
    </OrdersTableContext.Provider>
  );
};

export const useOrdersTableContext = () => useContext(OrdersTableContext);
