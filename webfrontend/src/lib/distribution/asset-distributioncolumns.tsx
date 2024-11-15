"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CryptoCurrencyResponseObject,
  cryptocurrencyMockData,
} from "@/api/distribution/asset-distributiontabledata";
import {
  AssetPercentageValueIcon,
  SortingDataTableIcon,
} from "../../../public/images";

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
      header: () => <div className="text-icongray font-normal"> Value </div>,
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
      header: () => (
        <div className="text-icongray font-normal"> Market Price </div>
      ),
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
      header: () => (
        <div className="text-icongray font-normal"> Change 24h </div>
      ),
      cell: ({ row }) => {
        const percentage = parseFloat(row.getValue("assetpercentage"));
        const renderPercentageCell = () => {
          for (let index = 0; index < cryptocurrencyMockData.length; index++) {
            if (percentage == cryptocurrencyMockData[index].assetpercentage) {
              const formattedPercentageValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(cryptocurrencyMockData[index].assetpercentagevalue);
              if (percentage < 0) {
                return (
                  <div className="flex flex-row bg-lightred text-red text-xs w-1/2 rounded-md items-center">
                    <div className="flex flex-row mx-1 text-red">
                      <AssetPercentageValueIcon />
                    </div>
                    <div className="flex flex-col">
                      {" "}
                      <p>{percentage}% </p>
                      <p> {formattedPercentageValue} </p>
                    </div>{" "}
                  </div>
                );
              } else {
                return (
                  <div className="flex flex-row bg-lightgreen text-green text-xs w-1/2 rounded-md items-center">
                    <div className="flex flex-row mx-1">
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
          }
        };
        return renderPercentageCell();
      },
    },
    {
      accessorKey: "assetchange7d",
      header: () => (
        <div className="text-icongray font-normal"> Change 7D </div>
      ),
      cell: ({ row }) => {
        const percentage = parseFloat(row.getValue("assetpercentage"));
        return <div> {percentage} %</div>;
      },
    },
    {
      accessorKey: "notes",
      header: () => <div className="text-icongray font-normal"> Notes </div>,
    },
  ];
