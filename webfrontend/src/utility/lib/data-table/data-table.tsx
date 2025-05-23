"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TableDetailComponent } from "../data-table";
import { SmallErrorSkeleton, prefetchDetailComponent } from "../data-fetching";

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { ShowDetailIcon } from "../../../../public/images/icons";
import { DataTableProps } from "./types";

/**
 * `DataTable` is a reusable, generic table component built on top of `@tanstack/react-table`
 * and customized with ShadCN UI primitives. It renders sortable tabular data and supports
 * row expansion to reveal a detail component specific to the selected row.
 *
 * ### Props
 * @template TData, TValue
 * @param data - The array of data records to display in the table.
 * @param columns - Column definitions for the table.
 * @param tableStatus - (Optional) Indicates the type/status of the table (e.g., "cryptocurrency", "nft", "derivative").
 *                                 This controls which detail component is rendered.
 * @param currentValue - (Optional) A numeric value passed to the detail component (e.g., current market value).
 * @param expandedRow- (Optional) ID of the currently expanded row; used to determine which row detail to show.
 * @param setExpandedRow - (Optional) Function to toggle row expansion, managed by the parent.
 *
 * ### Internal State
 * - `sorting: SortingState` - Tracks the current sorting configuration of the table.
 * - `rowName: string` - Tracks the name of the currently hovered or selected row (can be used for future enhancements or analytics).
 *
 * ### Behavior
 * - Sorts data using TanStack React Table's sorting model.
 * - Resets sorting state when `tableStatus` changes.
 * - Prefetches detail component data on row hover using `prefetchDetailComponent`.
 * - Renders a detail component inline beneath a selected row if it is expanded.
 *
 * ### Detail Expansion
 * Uses a helper function `getDetailComponent` to dynamically render a `<TableDetailComponent />`
 * based on the selected row and `tableStatus`. This includes pre-calculated props like:
 * - `assetName`, `assetId`, `assetUrl`, and `totalAssetAmount`.
 *
 * ### Return
 * @returns A fully interactive data table with sortable headers and expandable row details.
 */
export function DataTable<TData, TValue>({
  data,
  columns,
  detail,
  tableStatus,
  currentValue,
  expandedRow,
  setExpandedRow,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowName, setRowName] = useState<string>("");

  const toggleExpandedRow = (rowId: number) => {
    setExpandedRow((prevExpandedRow: number | null) =>
      prevExpandedRow === rowId ? null : rowId
    );
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    setSorting([]);
  }, [tableStatus]);

  /**
   * This function is triggered, when a row is clicked. It`s purpose is to render the related detail component.
   * @param row An object holding all related data for the selected row (made up by tanstack query.)
   * @param tableStatus The status determines which table detail component is rendered.
   * @returns The TableDetailComponent related to the table status.
   */
  const getDetailComponent = (row: any, tableStatus: string | undefined) => {
    const assetName =
      tableStatus === "cryptocurrency"
        ? data[row.id].assetabbreviation
        : `${data[row.id].leverage}X${data[row.id].assetname}`;

    return (
      <TableDetailComponent
        tableStatus={tableStatus}
        currentValue={currentValue}
        assetName={assetName}
        assetId={data[row.id].assetid}
        assetUrl={data[row.id].symbol}
        totalAssetAmount={data[row.id].assetamount}
      />
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="h-2/6 flex flex-col  mb-10">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 z-10 bg-gray rounded-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead className="w-6 pl-3"></TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-black">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
          <div className="overflow-y-auto rounded-md max-h-[60vh]">
            <Table className="table-fixed w-full ">
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={`border-b-${
                          expandedRow?.toString() === row.id ? "2" : "4"
                        } border-gray bg-white`}
                      >
                        {!detail ? null : (
                          <TableCell
                            className="w-6 pl-3"
                            onClick={() => {
                              toggleExpandedRow(Number(row.id));
                            }}
                            onMouseEnter={() => {
                              prefetchDetailComponent(
                                row.original.assettype,
                                row.original.assetid,
                                queryClient
                              );
                            }}
                          >
                            <ShowDetailIcon
                              rowId={Number(row.id)}
                              expandedRow={expandedRow}
                            />
                          </TableCell>
                        )}
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {expandedRow?.toString() === row.id && (
                        <TableRow
                          key={`detail${row.id}`}
                          className="border-b-4 border-t-2 border-gray"
                        >
                          <TableCell
                            colSpan={columns.length + 1}
                            className="w-full"
                          >
                            <div>{getDetailComponent(row, tableStatus)}</div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      <SmallErrorSkeleton />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
