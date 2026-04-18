import {
  SortingDataTableIcon,
  CustomHoldingIcon,
} from "../../../../../public/images/icons";
import { formatCurrency, formatValue } from "../../helpers";
import { icongray } from "../../helpers/helper-config/colors";
import {
  headerdesign,
  sortingicondesgin,
  firstcelldesign,
  celldesign,
} from "../../helpers/helper-config/colors";
import { Row, Column } from "@tanstack/react-table";
import { DistributionHolding } from "../../types/data-fetching-types";

export const dataColsHoldings = [
  {
    accessorKey: "holdingname",
    header: () => (
      <div className="flex flex-row justify-start items-center text-black h-11 w-full">
        Holding
      </div>
    ),
    cell: ({ row }: { row: Row<DistributionHolding> }) => {
      const name = row.original.holdingname;
      const symbol = row.original.symbol;
      const customHolding = row.original.custom;

      const color =
        row.original.color === undefined ? icongray : row.original.color;

      return (
        <div className={` ${firstcelldesign}`}>
          <div
            style={{ backgroundColor: color }}
            className="flex items-center justify-center w-4 h-4 rounded-sm mx-3"
          ></div>
          <div>
            {" "}
            {customHolding === false ? (
              <p className="flex flex-row justify-center items-center w-7 h-7 bg-gray rounded-sm text-center align-middle">
                {" "}
                {symbol}
              </p>
            ) : (
              <div className="w-7 h-7">
                <CustomHoldingIcon />
              </div>
            )}
          </div>
          <div className="flex flex-row justify-start items-baseline w-8/12 pl-2">
            <p>{name}</p>
            <p className="text-icongray ml-1">
              {" "}
              {customHolding === false ? null : "(Custom)"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "assetcount",
    header: ({ column }: { column: Column<DistributionHolding, unknown> }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign} pr-1`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          Asset-Count
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionHolding> }) => {
      const amount = row.original.assetcount;
      return (
        <div className={` flex flex-col justify-end items-end`}>
          <p> {amount} </p>
        </div>
      );
    },
  },
  {
    accessorKey: "distribution",
    header: ({ column }: { column: Column<DistributionHolding, unknown> }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign}`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          Percentage
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionHolding> }) => {
      const percentage = row.original.distribution;

      return (
        <div className={`${celldesign}`}>
          <div
            className={`flex flex-row w-32 items-end justify-end rounded-md`}
          >
            <p>{formatValue(percentage)} %</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "holdingchange24h",
    header: ({ column }: { column: Column<DistributionHolding, unknown> }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign}`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          Change 24h
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionHolding> }) => {
      const percentage = row.original.holdingchange24h;
      const percentagecolor =
        percentage < 0 ? " text-red rounded-md" : " text-green rounded-md";

      return (
        <div className={`${celldesign}`}>
          <div
            className={`${percentagecolor} flex flex-row w-32 items-end justify-end rounded-md`}
          >
            <p>
              {formatValue(
                percentage < 0
                  ? Number(percentage.toString().replace("-", ""))
                  : percentage
              )}{" "}
              %
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "profitloss",
    header: ({ column }: { column: Column<DistributionHolding, unknown> }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign} pr-1`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          P/L
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionHolding> }) => {
      const profitloss = row.original.profitloss;
      const profitLossChange = row.original.profitlosschange;
      const renderProfitCell = () => {
        return (
          <div className={"flex flex-col justify-end items-end font-medium"}>
            <p className={`${profitloss < 0 ? " text-red" : "text-green"}`}>
              {formatCurrency(
                profitloss < 0
                  ? Number(profitloss.toString().replace("-", ""))
                  : profitloss
              )}
            </p>
            <p
              className={`${
                profitloss < 0
                  ? " text-red font-normal "
                  : "text-green font-normal"
              }`}
            >
              (
              {formatValue(
                profitLossChange < 0
                  ? Number(profitLossChange.toString().replace("-", ""))
                  : profitLossChange
              )}
              %)
            </p>
          </div>
        );
      };
      return renderProfitCell();
    },
  },
];
