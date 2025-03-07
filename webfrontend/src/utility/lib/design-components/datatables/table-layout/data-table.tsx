"use client";

import * as React from "react";

import { TableDetailComponent } from "./data-datatable-detail-popup";

import {
  ColumnDef,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any;
  expandedRow: number | null;
  tableStatus?: string;
}
export function DataTable<TData, TValue>({
  data,
  columns,
  expandedRow,
  tableStatus,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getDetailComponent = (row: any, tableStatus: string | undefined) => {
    if (tableStatus !== "") {
      const assetName =
        tableStatus === "cryptocurrency"
          ? data[row.id].assetabbreviation
          : `${data[row.id].leverage}X${data[row.id].derivativename}`;
      return (
        <TableDetailComponent
          tableStatus={tableStatus}
          assetName={assetName}
          assetId={data[row.id].assetid}
        />
      );
    } else {
      return null;
    }
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
    <div className="rounded-md">
      <Table>
        <TableHeader className="bg-gray">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border"
                >
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
                  <TableRow key={`detail${row.id}`}>
                    <TableCell className="border" colSpan={columns.length}>
                      <div>{getDetailComponent(row, tableStatus)}</div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
