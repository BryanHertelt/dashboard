"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  AssetGroupResponseObject,
  assetGroupData,
} from "@/api/distribution/asset-distributiontabledata";

import { AssetPercentageValueIcon } from "../../../../../public/images";
import { SortingDataTableIcon } from "../../../../../public/images/icons";
import { Line } from "react-chartjs-2";
import { assetDataTableLineChartDataOptions } from "@/api/distribution/chartdataformatter";
import { assetDataTableLineChartData } from "@/api/distribution/chartdataformatter";
export const assetgrouplistcolumns: ColumnDef<AssetGroupResponseObject>[] = [
  {
    accessorKey: "groupname",
    header: "Asset-Groups",
    cell: ({ row }) => {
      const groupname: string = row.getValue("groupname");
      return <div className=""> {groupname} </div>;
    },
  },
  {
    accessorKey: "grouppercentage",
    header: "%",
    cell: ({ row }) => {
      const percentage = parseFloat(row.getValue("grouppercentage"));
      return <div className=""> {percentage} %</div>;
    },
  },
];

export const assetgroupdistributioncolumns: ColumnDef<AssetGroupResponseObject>[] =
  [
    {
      accessorKey: "groupname",
      header: () => (
        <div className="text-icongray font-normal"> Asset-Groups </div>
      ),
    },
    {
      accessorKey: "assetcount",
      header: () => (
        <div className="text-icongray font-normal"> Asset-Count </div>
      ),
    },
    {
      accessorKey: "groupvalue",
      header: "Value",
      cell: ({ row }) => {
        const groupvalue = parseFloat(row.getValue("groupvalue"));
        const formattedgroupvalue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(groupvalue);
        return <div> {formattedgroupvalue}</div>;
      },
    },
    {
      accessorKey: "grouppercentage",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            % <SortingDataTableIcon
              sorted="asc"
              className="ml-2 h-4 w-4"
            />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const grouppercentage = parseFloat(row.getValue("grouppercentage"));
        return <div> {grouppercentage} %</div>;
      },
    },
    {
      accessorKey: "groupchange24h",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 24h{" "}
            <SortingDataTableIcon sorted="asc" className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const grouppercentage = parseFloat(row.getValue("groupchange24h"));
        const renderPercentageCell = () => {
          for (let index = 0; index < assetGroupData.length; index++) {
            if (grouppercentage == assetGroupData[index].groupchange24h) {
              const formattedPercentageValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(assetGroupData[index].groupchange24hvalue);
              const percentagecolor =
                grouppercentage < 0 ? "negative" : "positive";
              const iconcolor = grouppercentage < 0 ? "text-red" : "text-green";
              return (
                <div
                  className={`${percentagecolor} flex flex-row text-xs w-1/2 items-center`}
                >
                  <div className={`${iconcolor} flex flex-row mx-1`}>
                    <AssetPercentageValueIcon />
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <p>{grouppercentage}% </p>
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
      accessorKey: "groupchange7d",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 7d{" "}
            <SortingDataTableIcon sorted="asc" className="ml-2 h-4 w-4" />{" "}
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
  ];
