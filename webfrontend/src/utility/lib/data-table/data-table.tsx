"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TableDetailComponent } from "../data-table";
import { SmallErrorSkeleton, prefetchDetailComponent } from "../data-fetching";
import logger from "../logging/logger";

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  ShowDetailIcon,
  ReloadSingleHoldingIcon,
} from "../../../../public/images/icons";
import { DataTableProps } from "./types";
import { syncSingleHolding } from "../stores";
import { SyncStatusItem } from "../stores/clear-cache";

// Define interface for row data to improve type safety
interface RowData {
  holdingid?: number;
  assettype?: string;
  assetid?: number;
  assetabbreviation?: string;
  leverage?: number;
  assetname?: string;
  symbol?: string;
  assetamount?: number;
}

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
  const queryClient = useQueryClient();

  const setSyncStatus = syncSingleHolding((state) => state.setSyncStatus);
  const syncStatus = syncSingleHolding((state) => state.syncStatus);

  // Memoize handleSync to prevent unnecessary recreations
  const handleSync = useCallback(
    (row: Row<TData>) => {
      const holdingId = (row.original as RowData).holdingid;
      if (!holdingId) {
        logger.error({ row: row.original }, "Missing holdingId in row");
        return;
      }

      const currentHolding = syncStatus.find(
        (holdingSync) => holdingSync.holdingId === holdingId
      );

      if (!currentHolding) {
        logger.warn({ holdingId }, "No sync status found for holding");
        return;
      }

      let updatedStatus: SyncStatusItem["status"];
      const currentStatus = currentHolding.status;

      if (currentStatus === "noSync" || currentStatus === "synced") {
        updatedStatus = "syncing";
      } else if (currentStatus === "syncing" || currentStatus === "error") {
        updatedStatus = "noSync";
      } else {
        updatedStatus = "noSync";
      }

      // Avoid updating if status hasn't changed
      if (currentStatus === updatedStatus) {
        return;
      }

      // Use functional update to ensure latest state
      setSyncStatus((prev: SyncStatusItem[]) =>
        prev.map((item) =>
          item.holdingId === holdingId
            ? { ...item, status: updatedStatus }
            : item
        )
      );

      logger.info({ holdingId, updatedStatus }, "Sync status updated");
    },
    [syncStatus, setSyncStatus]
  );

  // Reset sorting when tableStatus changes
  useEffect(() => {
    setSorting([]);
  }, [tableStatus]);

  // Memoize getDetailComponent to avoid unnecessary recreations
  const getDetailComponent = useCallback(
    (row: Row<TData>, tableStatus: string | undefined) => {
      const rowData = (data[Number(row.id)] as RowData) || {};
      const assetName =
        tableStatus === "cryptocurrency"
          ? rowData.assetabbreviation || "Unknown"
          : `${rowData.leverage || 1}X${rowData.assetname || "Unknown"}`;

      return (
        <TableDetailComponent
          tableStatus={tableStatus}
          currentValue={currentValue}
          assetName={assetName}
          assetId={rowData.assetid ?? 0}
          assetUrl={rowData.symbol ?? ""}
          totalAssetAmount={rowData.assetamount ?? 0}
        />
      );
    },
    [data, currentValue]
  );

  const table = useReactTable({
    data: data ?? [], // Fallback to empty array
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // Validate tableStatus
  const validTableStatus = [
    "cryptocurrency",
    "nft",
    "derivative",
    "holdings",
  ].includes(tableStatus ?? "")
    ? tableStatus
    : undefined;

  return (
    <div className="h-2/6 flex flex-col mb-10">
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
          <div className="overflow-y-auto rounded-md max-h-[50vh]">
            <Table className="table-fixed w-full">
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className={`border-b-${
                          expandedRow?.toString() === row.id ? "1" : "2"
                        } border-gray bg-white`}
                      >
                        {(detail || validTableStatus === "holdings") && (
                          <TableCell
                            className="w-6 pl-3"
                            onClick={() => {
                              if (detail) {
                                logger.info({ rowId: row.id }, "ShowDetailIcon clicked");
                                setExpandedRow?.((prev: number | null) =>
                                  prev === Number(row.id)
                                    ? null
                                    : Number(row.id)
                                );
                              } else if (validTableStatus === "holdings") {
                                handleSync(row);
                              }
                            }}
                            onMouseEnter={() => {
                              const orig = row.original as RowData;
                              if (
                                detail &&
                                orig.assettype &&
                                orig.assetid
                              ) {
                                logger.debug(
                                  { assettype: orig.assettype, assetid: orig.assetid },
                                  "Prefetching detail"
                                );
                                prefetchDetailComponent(
                                  orig.assettype,
                                  orig.assetid,
                                  queryClient
                                );
                              }
                            }}
                          >
                            {detail ? (
                              <ShowDetailIcon
                                rowId={Number(row.id)}
                                expandedRow={expandedRow}
                              />
                            ) : validTableStatus === "holdings" &&
                              (row.original as RowData).holdingid ? (
                              <ReloadSingleHoldingIcon
                                rowId={Number((row.original as RowData).holdingid)}
                                index={index}
                              />
                            ) : null}
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

                      {expandedRow?.toString() === row.id && detail && (
                        <TableRow
                          key={`detail${row.id}`}
                          className="border-b-4 border-t-2 border-gray"
                        >
                          <TableCell
                            colSpan={
                              columns.length +
                              (detail || validTableStatus === "holdings"
                                ? 1
                                : 0)
                            }
                            className="w-full"
                          >
                            <div>
                              {getDetailComponent(row, validTableStatus)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length +
                        (detail || validTableStatus === "holdings" ? 1 : 0)
                      }
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
