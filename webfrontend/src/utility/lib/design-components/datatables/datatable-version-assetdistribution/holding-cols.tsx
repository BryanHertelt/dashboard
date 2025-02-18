"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  HoldingsResponseObject,
  holdingsData,
} from "@/api/distribution/asset-distributiontabledata";
import {
  AssetPercentageValueIcon,
  NotesInDataTableIcon,
  SortingDataTableIcon,
} from "../../../../../../public/images";
import { Line } from "react-chartjs-2";
import { assetDataTableLineChartData } from "@/api/distribution/chartdataformatter";
import { assetDataTableLineChartDataOptions } from "@/api/distribution/chartdataformatter";

export const holdingslistcolumns: ColumnDef<HoldingsResponseObject>[] = [
  {
    accessorKey: "holdingname",
    header: "Holdings",
    cell: ({ row }) => {
      const groupname: string = row.getValue("holdingname");
      return <div className=""> {groupname} </div>;
    },
  },
  {
    accessorKey: "holdingpercentage",
    header: "%",
    cell: ({ row }) => {
      const percentage = parseFloat(row.getValue("holdingpercentage"));
      return <div className=""> {percentage} %</div>;
    },
  },
];

export const holdingsdistributioncolumns: ColumnDef<HoldingsResponseObject>[] =
  [
    {
      accessorKey: "holdingname",
      header: () => <div className="text-icongray font-normal"> Holdings </div>,
    },
    {
      accessorKey: "assetcount",
      header: () => (
        <div className="text-icongray font-normal"> Asset-Count </div>
      ),
    },
    {
      accessorKey: "holdingvalue",
      header: "Value",
      cell: ({ row }) => {
        const groupvalue = parseFloat(row.getValue("holdingvalue"));
        const formattedgroupvalue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(groupvalue);
        return <div> {formattedgroupvalue}</div>;
      },
    },
    {
      accessorKey: "holdingpercentage",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            % <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const grouppercentage = parseFloat(row.getValue("holdingpercentage"));
        return <div> {grouppercentage} %</div>;
      },
    },
    {
      accessorKey: "holdingchange24h",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 24h <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const holdingpercentage = parseFloat(row.getValue("holdingchange24h"));
        const renderPercentageCell = () => {
          for (let index = 0; index < holdingsData.length; index++) {
            if (holdingpercentage == holdingsData[index].holdingchange24h) {
              const formattedPercentageValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(holdingsData[index].holdingchange24hvalue);
              const percentagecolor =
                holdingpercentage < 0 ? "negative" : "positive";
              const iconcolor =
                holdingpercentage < 0 ? "text-red" : "text-green";
              return (
                <div
                  className={`${percentagecolor} flex flex-row text-xs w-1/2 items-center`}
                >
                  <div className={`${iconcolor}flex flex-row mx-1`}>
                    <AssetPercentageValueIcon />
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <p>{holdingpercentage}% </p>
                    <p> {formattedPercentageValue} </p>
                  </div>{" "}
                </div>
              );
            }
          }
        };
        return renderPercentageCell();
      },
    },
    {
      accessorKey: "holdingchange7d",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 7d <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="w-2/6 h-5">
            <Line
              options={assetDataTableLineChartDataOptions}
              data={assetDataTableLineChartData}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => (
        <div className="flex flex-row justify-start text-icongray font-normal">
          {" "}
          Description{" "}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-row justify-start text-3xl items-center">
            {" "}
            <NotesInDataTableIcon />{" "}
          </div>
        );
      },
    },
  ];
