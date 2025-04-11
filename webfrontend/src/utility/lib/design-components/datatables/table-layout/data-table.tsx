"use client";

import * as React from "react";
import { useState } from "react";
import { TableDetailComponent } from "./datatable-detail-popup";
import { ErrorSkeleton } from "@/utility/lib/datafetching/loading-skeleton";
import { NotesInDataTableIcon } from "../../../../../../public/images";
import Modal from "@/utility/lib/build-components/pop-ups/modal";
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
  columns: ColumnDef<any, TValue>[];
  data: any;
  currentValue: number;
  expandedRow?: number | null;
  tableStatus?: string;
}

/**
 * The component renders a data table based on the data and columns passed.
 * The basic structure is taken from shadcn/ui.
 * I added the extra feature to expand a detail component of the selected row. This feature is currently just usable for the Crypto/NFT/Derivative data table.
 * @param data
 * @param columns
 * @param expandedRow Optional: takes the expanded row and passed it down to the detail component. This is necessary for the detail component to make the right api call.
 * @param tableStatus Optional: Takes the status of the datatable from the wrapping data handler.
 * @returns The data table.
 */
export function DataTable<TData, TValue>({
  data,
  columns,
  expandedRow,
  tableStatus,
  currentValue,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowName, setRowName] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  /**
   * This function is triggered, when a row is clicked. It`s purpose is to render the related detail component.
   * @param row An object holding all related data for the selected row (made up by tanstack query.)
   * @param tableStatus The status determines which table detail component is rendered.
   * @returns The TableDetailComponent related to the table status.
   */
  const getDetailComponent = (row: any, tableStatus: string | undefined) => {
    if (tableStatus !== "" || undefined) {
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
    <div className="h-2/6 flex flex-col">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 z-10 bg-gray rounded-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
          <div className="overflow-y-auto rounded-md sm:max-h-[66vh] md:max-h-[66vh] lp:max-h-[66vh] lg:max-h-[66vh] lg xl:max-h-[65vh]">
            <Table className="table-fixed w-full">
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
                          <TableCell colSpan={columns.length}>
                            <div>{getDetailComponent(row, tableStatus)}</div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <ErrorSkeleton />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={rowName} />
    </div>
  );
}
