"use client";

import * as React from "react";
import { useState } from "react";
import { TableDetailComponent } from "./data-datatable-detail-popup";
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
  columns: ColumnDef<TData, TValue>[];
  data: any;
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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="rounded-md h-full overflow-y-auto">
      <Table>
        <TableHeader className="bg-gray">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-black">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead className="flex flex-row font-normal items-center justify-center text-black h-11">
                {" "}
                Notes
              </TableHead>
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
                  className={`border-b-${
                    expandedRow?.toString() === row.id ? "2" : "4"
                  } border-gray bg-white`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex flex-row justify-center items-center w-full h-full text-3xl mt-1">
                    <NotesInDataTableIcon
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
                {expandedRow?.toString() === row.id && (
                  <TableRow
                    key={`detail${row.id}`}
                    className="border-b-4 border-t-2 border-gray"
                  >
                    <TableCell className="" colSpan={columns.length}>
                      <div>{getDetailComponent(row, tableStatus)}</div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <ErrorSkeleton />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={tableStatus}
      />
    </div>
  );
}
