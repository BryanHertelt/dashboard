"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CryptoCurrencyResponseObject,
  cryptocurrencyMockData,
} from "@/api/distribution/asset-distributiontabledata";
import {
  AssetPercentageValueIcon,
  SortingDataTableIcon,
  NotesInDataTableIcon,
} from "../../../public/images";
import { AssetDataTableLineChart } from "@/lib/distribution/assets-distributioncharts";

export const assetdistributioncolumns: ColumnDef<CryptoCurrencyResponseObject>[] =
  [
    {
      accessorKey: "assetname",
      header: () => <div className="text-icongray font-normal"> Asset </div>,
      cell: ({ row }) => {
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < cryptocurrencyMockData.length; index++) {
            if (name == cryptocurrencyMockData[index].assetname) {
              return (
                <div className="flex flex-row text-sm font-medium items-center ml-2">
                  {cryptocurrencyMockData[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-1/2 ml-2">
                    {cryptocurrencyMockData[index].assetname}
                    <div className="text-xs text-icongray w-2/5 justify-start">
                      {cryptocurrencyMockData[index].assetabbreviation}
                    </div>
                  </div>
                </div>
              );
            }
          }
        };
        return renderNameCell();
      },
    },
    {
      accessorKey: "assetamount",
      header: () => <div className="text-icongray font-normal"> Amount </div>,
    },
    {
      accessorKey: "assetpercentage",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Percentage <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const percentage = parseFloat(row.getValue("assetpercentage"));
        return <div> {percentage} %</div>;
      },
    },
    {
      accessorKey: "assetvalue",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Value <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("assetvalue"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "assetmarketprice",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Market Price <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("assetmarketprice"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "assetchange24h",
      header: ({ column }) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 24 h <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }) => {
        const percentage = parseFloat(row.getValue("assetpercentage"));
        const renderPercentageCell = () => {
          for (let index = 0; index < cryptocurrencyMockData.length; index++) {
            if (percentage == cryptocurrencyMockData[index].assetpercentage) {
              const formattedPercentageValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(cryptocurrencyMockData[index].assetpercentagevalue);
              const percentagecolor = percentage < 0 ? "negative" : "positive";
              const iconcolor = percentage < 0 ? "text-red" : "text-green";
              return (
                <div
                  className={`${percentagecolor} flex flex-row text-xs w-1/2 items-center`}
                >
                  <div className={`${iconcolor} flex flex-row mx-1`}>
                    <AssetPercentageValueIcon />
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <p>{percentage}% </p>
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
      accessorKey: "assetchange7d",
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
        const percentage = parseFloat(row.getValue("assetpercentage"));
        return (
          <div className="w-2/6 h-5">
            {" "}
            <AssetDataTableLineChart />{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: () => (
        <div className="flex flex-row justify-start text-icongray font-normal">
          {" "}
          Notes{" "}
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
