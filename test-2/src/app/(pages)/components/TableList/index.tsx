"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterHeader from "@/app/(pages)/components/FilterHeader";

export interface TUser {
  id: string;
  name: string;
  balance: number;
  email: string;
  registerAt: Date;
  active: boolean;
}

// Use ChatGPT to generate 100 sample data
const data: TUser[] = Array.from({ length: 100 }, (_, i) => {
  const id = (i + 1).toString();
  const names = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Diana",
    "Edward",
    "Fiona",
    "George",
    "Helen",
  ];
  const lastNames = [
    "Doe",
    "Smith",
    "Johnson",
    "Brown",
    "Wilson",
    "Miller",
    "Davis",
    "Clark",
    "White",
    "Turner",
  ];
  const name = `${names[i % 10]} ${lastNames[i % 10]}`;
  const balance = Math.floor(Math.random() * 10000);
  const email = `${name.toLowerCase().replace(" ", ".")}${i + 1}@example.com`;
  const registerAt = new Date(2025, 0, i + 1);
  const active = Math.random() > 0.3;

  return {
    id,
    name,
    balance,
    email,
    registerAt,
    active,
  };
});
//*************************** */
// MY CODE WITH CURSOR SUPPORTED
//*************************** */

// I. Define columns for the table using tanstack/react-table.
// Each column will have column.toggleSorting(column.getIsSorted() === "asc") to sort the column.
export const columns: ColumnDef<TUser>[] = [
  // 1. Checkbox column: Define select column
  {
    id: "select",
    // 1.1 Allow to select all rows with table.toggleAllPageRowsSelected(!!value)
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    // 1.2 Allow to select a single row with row.toggleSelected(!!value)
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // 2. Name column: Define name column
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // 3. Email column: Define email column
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // 3.1 Allow to click on the email to open the email client
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue("email")}`}
        className="text-primary hover:underline"
      >
        {row.getValue("email")}
      </a>
    ),
  },
  // 4. Balance column: Define balance column
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // 4.1 Format the balance to USD
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  // 5. Registration Date: Define registration date column
  {
    accessorKey: "registerAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // 5.1 Format to show correct date and time
    cell: ({ row }) => {
      const date = row.getValue("registerAt") as Date;
      return (
        <div className="group relative">
          <span>{date.toLocaleDateString()}</span>
          <div className="bg-popover absolute top-full left-0 z-10 hidden rounded-md p-2 text-sm group-hover:block">
            {date.toLocaleString()}
          </div>
        </div>
      );
    },
  },
  // 6. Status column: Define status column
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <div
          className={cn(
            "capitalize",
            active ? "text-green-600" : "text-red-600",
          )}
        >
          {active ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  // 7. Actions column: Define actions column (Notice: No handling for actions yet)
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// II. Define the table component
export function TableList() {
  // 1. Define states for sorting, filtering, toggle infinite scroll and pagination mode, row selection
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [filters, setFilters] = React.useState<{
    balanceMin?: number;
    balanceMax?: number;
    registrationDateRange?: DateRange;
    status?: "active" | "inactive" | "all";
  }>({});
  const [isInfiniteScroll, setIsInfiniteScroll] = React.useState(false);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [hasAppliedFilters, setHasAppliedFilters] = React.useState(false);

  // 2. FilterdData is used for rendering the data table.
  // I apply React.useMemo to avoid unnecessary re-renders, only re-render when the filters are applied.
  const filteredData = React.useMemo(() => {
    // If no filters have been applied yet, return all data
    if (!hasAppliedFilters) {
      return data;
    }

    return data.filter((user) => {
      // Balance filter: Filter price in range
      if (
        filters.balanceMin !== undefined &&
        user.balance < filters.balanceMin
      ) {
        return false;
      }
      if (
        filters.balanceMax !== undefined &&
        user.balance > filters.balanceMax
      ) {
        return false;
      }

      // Registration date range filter: Filter date in range
      if (filters.registrationDateRange) {
        const userDate = new Date(user.registerAt);
        if (
          filters.registrationDateRange.from &&
          userDate < filters.registrationDateRange.from
        ) {
          return false;
        }
        if (filters.registrationDateRange.to) {
          const endOfDay = new Date(filters.registrationDateRange.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (userDate > endOfDay) {
            return false;
          }
        }
      }

      // Status filter: Filter by single status
      if (filters.status && filters.status !== "all") {
        if (filters.status === "active" && !user.active) {
          return false;
        }
        if (filters.status === "inactive" && user.active) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters, hasAppliedFilters]);

  // 3. Handle filter function for price, date and status
  const handleFilterChange = (newFilters: {
    balanceMin?: number;
    balanceMax?: number;
    registrationDateRange?: DateRange;
    status?: "active" | "inactive" | "all";
  }) => {
    setFilters(newFilters);
    setColumnFilters([]);
    setHasAppliedFilters(true);
  };

  // 4. Handle view mode change for infinite scroll and pagination mode
  const handleViewModeChange = (newIsInfiniteScroll: boolean) => {
    setIsInfiniteScroll(newIsInfiniteScroll);
    setPageIndex(0);
  };

  // 5. Define the table using tanstack/react-table
  // I use https://tanstack.com/table/latest to help with the setup
  const table = useReactTable({
    // 5.1 Define the data and columns
    data: filteredData,
    columns,
    // 5.2 Define the sorting, filtering, pagination and row selection
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isInfiniteScroll
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // 5.3 Handle pagination change
    onPaginationChange: (updater) => {
      if (isInfiniteScroll) return;
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    // 5.4 Define the state for sorting, filtering, pagination and row selection to make table re-render when the state changes
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: isInfiniteScroll ? 0 : pageIndex,
        pageSize: isInfiniteScroll ? filteredData.length : pageSize,
      },
    },
    enableSorting: true,
  });

  // 6. Custom render table rows
  const renderTableRows = () => {
    // 6.1 If no data, return no results
    if (!filteredData || filteredData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      );
    }

    // 6.2 Get sorted and filtered data based on the view mode
    const sortedData = isInfiniteScroll
      ? table.getSortedRowModel().rows.map((row) => row.original)
      : table.getRowModel().rows.map((row) => row.original);

    // 6.3 Render the table rows
    return sortedData.map((rowData) => {
      const row = table
        .getRowModel()
        .rows.find((r) => r.original.id === rowData.id);
      const isSelected = row ? row.getIsSelected() : false;

      return (
        <TableRow key={rowData.id} data-state={isSelected ? "selected" : ""}>
          <TableCell>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (row) {
                  row.toggleSelected(!!checked);
                } else {
                  // For infinite scroll mode, manually handle selection
                  const newSelection = { ...rowSelection };
                  if (checked) {
                    newSelection[rowData.id] = true;
                  } else {
                    delete newSelection[rowData.id];
                  }
                  setRowSelection(newSelection);
                }
              }}
              aria-label="Select row"
            />
          </TableCell>
          <TableCell>{rowData.name}</TableCell>
          <TableCell>
            <a
              href={`mailto:${rowData.email}`}
              className="text-primary hover:underline"
            >
              {rowData.email}
            </a>
          </TableCell>
          <TableCell>
            <div className="text-right font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(rowData.balance)}
            </div>
          </TableCell>
          <TableCell>
            <div className="group relative">
              <span>{new Date(rowData.registerAt).toLocaleDateString()}</span>
              <div className="bg-popover absolute top-full left-0 z-10 hidden rounded-md p-2 text-sm group-hover:block">
                {new Date(rowData.registerAt).toLocaleString()}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div
              className={cn(
                "capitalize",
                rowData.active ? "text-green-600" : "text-red-600",
              )}
            >
              {rowData.active ? "Active" : "Inactive"}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  // 7. Render the pagination buttons
  const renderPaginationButtons = () => {
    if (isInfiniteScroll) return null;

    const currentPage = pageIndex + 1;
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const delta = 2; // Number of pages to show before and after current page
    let pages: (number | string)[] = [];

    // Always add first page
    pages.push(1);

    // Calculate range around current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Always add last page if it exists
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    // Add ellipsis where needed
    pages = pages
      .filter((p, i, arr) => arr.indexOf(p) === i) // Remove duplicates
      .sort((a, b) => Number(a) - Number(b)) // Sort numerically
      .reduce((acc: (number | string)[], curr, i, arr) => {
        if (i > 0) {
          if (Number(curr) - Number(arr[i - 1]) > 1) {
            acc.push("...");
          }
        }
        acc.push(curr);
        return acc;
      }, []);

    return pages.map((page, i) =>
      page === "..." ? (
        <span key={`ellipsis-${i}`} className="px-2">
          ...
        </span>
      ) : (
        <Button
          key={`page-${page}`}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => {
            if (typeof page === "number") {
              setPageIndex(page - 1);
            }
          }}
        >
          {page}
        </Button>
      ),
    );
  };

  // 8. Render the table
  return (
    <div className="w-full">
      {/* 8.1 Render the filter header */}
      <FilterHeader
        onFilterChange={handleFilterChange}
        onViewModeChange={handleViewModeChange}
        isInfiniteScroll={isInfiniteScroll}
      />
      {/* 8.2 Render table */}
      <div
        className={cn(
          "rounded-md border",
          isInfiniteScroll && "max-h-[600px] overflow-y-auto",
        )}
      >
        <Table>
          {/* 8.2.1 Render the table header */}
          <TableHeader
            className={
              isInfiniteScroll ? "bg-background sticky top-0 z-10" : ""
            }
          >
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                />
              </TableHead>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers
                    .filter((header) => header.id !== "select")
                    .map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )),
                )}
            </TableRow>
          </TableHeader>
          {/* 8.2.2 Render the table body */}
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>
      {/* 8.3 Render the pagination buttons */}
      {isInfiniteScroll ? (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-sm">
              {Object.keys(rowSelection).length} of {filteredData.length} row(s)
              selected.
            </div>
            {Object.keys(rowSelection).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRowSelection({});
                }}
              >
                Deselect All
              </Button>
            )}
          </div>
          <div className="text-muted-foreground text-sm">
            Showing all {filteredData.length} records
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.toggleAllRowsSelected(false);
                }}
              >
                Deselect All
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            {renderPaginationButtons()}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableList;
