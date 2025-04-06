"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon, ListIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface TableHeaderProps {
  onFilterChange: (filters: {
    balanceMin?: number;
    balanceMax?: number;
    registrationDateRange?: DateRange;
    status?: "active" | "inactive" | "all";
  }) => void;
  onViewModeChange?: (isInfiniteScroll: boolean) => void;
  isInfiniteScroll?: boolean;
}

const FilterHeader = ({
  onFilterChange,
  onViewModeChange,
  isInfiniteScroll = false,
}: TableHeaderProps) => {
  const [balanceMin, setBalanceMin] = useState<string>("");
  const [balanceMax, setBalanceMax] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [status, setStatus] = useState<"active" | "inactive" | "all">("all");
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      balanceMin: balanceMin ? parseFloat(balanceMin) : undefined,
      balanceMax: balanceMax ? parseFloat(balanceMax) : undefined,
      registrationDateRange: dateRange,
      status: status !== "all" ? status : undefined,
    });
    setHasAppliedFilters(true);
  };

  const handleResetFilters = () => {
    setBalanceMin("");
    setBalanceMax("");
    setDateRange(undefined);
    setStatus("all");
    onFilterChange({});
    setHasAppliedFilters(false);
  };

  const toggleViewMode = () => {
    console.log("Toggle view mode clicked, current state:", isInfiniteScroll);
    if (onViewModeChange) {
      onViewModeChange(!isInfiniteScroll);
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="flex items-center gap-2"
          type="button"
        >
          {isInfiniteScroll ? (
            <>
              <ListIcon className="h-4 w-4" />
              <span>Switch to Pagination</span>
            </>
          ) : (
            <>
              <Loader2Icon className="h-4 w-4" />
              <span>Switch to Infinite Scroll</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Balance Range</label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={balanceMin}
              onChange={(e) => setBalanceMin(e.target.value)}
            />
            <Input
              placeholder="Max"
              type="number"
              value={balanceMax}
              onChange={(e) => setBalanceMax(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Registration Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={status}
            onValueChange={(value: "active" | "inactive" | "all") =>
              setStatus(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleResetFilters}>
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterHeader;
