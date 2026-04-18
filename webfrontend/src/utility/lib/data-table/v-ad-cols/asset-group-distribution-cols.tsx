import { SortingDataTableIcon } from "../../../../../public/images/icons";
import { formatCurrency, formatValue } from "../../helpers";
import { icongray } from "../../helpers/helper-config/colors";
import {
  headerdesign,
  sortingicondesgin,
  firstcelldesign,
  celldesign,
} from "../../helpers/helper-config/colors";
import { Row, Column } from "@tanstack/react-table";
import { DistributionGroup } from "../../types/data-fetching-types";
export const dataColsGroups = [
  {
    accessorKey: "groupname",
    header: () => (
      <div className="flex flex-row justify-start items-center text-black h-11 w-full">
        Group
      </div>
    ),
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const name = row.original.groupname;
      const color =
        row.original.color === undefined ? icongray : row.original.color;

      return (
        <div className={` ${firstcelldesign}`}>
          <div
            style={{ backgroundColor: color }}
            className="flex items-center justify-center w-5 h-5 rounded-sm"
          ></div>
          <div className="flex flex-col justify-center items-start w-1/2 pl-2">
            <p>{name}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "assetcount",
    header: ({ column }: { column: Column<DistributionGroup, unknown> }) => {
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
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
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
    header: ({ column }: { column: Column<DistributionGroup, unknown> }) => {
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
          Percentage{" "}
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const percentage = row.original.distribution;

      return (
        <div className={`${celldesign}`}>
          <div
            className={`flex flex-row w-32 items-end justify-end  rounded-md`}
          >
            {" "}
            <p>{formatValue(percentage)} %</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "groupchange24h",
    header: ({ column }: { column: Column<DistributionGroup, unknown> }) => {
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
          Change 24h{" "}
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const percentage = row.original.groupchange24h;
      const percentagecolor =
        percentage < 0 ? " text-red rounded-md" : " text-green rounded-md;";

      return (
        <div className={`${celldesign}`}>
          <div
            className={`${percentagecolor}  flex flex-row w-32 items-end justify-end  rounded-md`}
          >
            {" "}
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
    header: ({ column }: { column: Column<DistributionGroup, unknown> }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign} pr-1`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          P/L
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const profitloss = row.original.profitloss;
      const profitLossChange = row.original.profitlosschange;
      const renderProfitCell = () => {
        return (
          <div className={"flex flex-col justify-end items-end font-medium"}>
            {" "}
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

/**
 *  {
    accessorKey: "assetcount",
    header: ({ column }: { column: Column<DistributionGroup, unknown> }) => {
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
          Asset-Count
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const amount = parseFloat(row.getValue("assetcount"));

      return (
        <div className={` flex flex-col justify-end items-end`}>
          <p> {amount} </p>
        </div>
      );
    },
  },
 */

/**
   *  {
    accessorKey: "groupchange24hvalue",
    header: "Percentage",
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const assetcount: string = row.getValue("groupchange24hvalue");
      return <div className="flex flex-row justify-end"> {assetcount} </div>;
    },
  },
  {
    accessorKey: "profitloss",
    header: ({ column }: { column: Column<DistributionGroup, unknown> }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign} pr-1`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          P/L
        </button>
      );
    },
    cell: ({ row }: { row: Row<DistributionGroup> }) => {
      const profitloss = row.getValue("profitloss");
      const profitLossChange = row.original.profitlosschange;
      const renderProfitCell = () => {
        return (
          <div className={"flex flex-col justify-end items-end font-medium"}>
            {" "}
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
   */
