"use client";

import {
  AssetPercentageValueIcon,
  SortingDataTableIcon,
  NotesInDataTableIcon,
} from "../../../../../../public/images";
import { Line } from "react-chartjs-2";
import { assetDataTableLineChartData } from "@/api/distribution/chartdataformatter";
import { assetDataTableLineChartDataOptions } from "@/api/distribution/chartdataformatter";
import { formatCurrency } from "@/utility/lib/helpers/currency-formatter";

export const formatDataColsCurrency = (parentdata: any) => {
  return [
    {
      accessorKey: "assetname",
      header: () => <div className="text-icongray font-normal"> Asset </div>,
      cell: ({ row }: any) => {
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < parentdata.length; index++) {
            if (name == parentdata[index].assetname) {
              return (
                <div className="flex flex-row text-sm font-medium items-center ml-2">
                  {parentdata[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-1/2 ml-2">
                    {parentdata[index].assetname}
                    <div className="text-xs text-icongray w-2/5 justify-start">
                      {parentdata[index].assetabbreviation}
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
      header: ({ column }: any) => {
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
      cell: ({ row }: any) => {
        const percentage = parseFloat(row.getValue("assetpercentage"));
        return <div> {percentage} %</div>;
      },
    },
    {
      accessorKey: "assetvalue",
      header: ({ column }: any) => {
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
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("assetvalue"));
        const formatted = formatCurrency(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "assetmarketprice",
      header: ({ column }: any) => {
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
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("assetmarketprice"));
        const formatted = formatCurrency(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "assetchange24h",
      header: ({ column }: any) => {
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
      cell: ({ row }: any) => {
        const percentage = parseFloat(row.getValue("assetchange24h"));
        const renderPercentageCell = () => {
          for (let index = 0; index < parentdata.length; index++) {
            if (percentage == parentdata[index].assetchange24h) {
              const formattedPercentageValue = formatCurrency(
                parentdata[index].assetchange24hourvalue
              );
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
      header: ({ column }: any) => {
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
      cell: () => {
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
      accessorKey: "notes",
      header: () => (
        <div className="flex flex-row justify-start text-icongray font-normal">
          {" "}
          Notes{" "}
        </div>
      ),
      cell: () => {
        return (
          <div className="flex flex-row justify-start text-3xl items-center">
            {" "}
            <NotesInDataTableIcon />{" "}
          </div>
        );
      },
    },
  ];
};

export const formatDataColsDerivative = (processedQueryData: any) => {
  return [
    {
      accessorKey: "direction",
      header: () => (
        <div className="text-icongray font-normal"> Position Type </div>
      ),
      cell: ({ row }: any) => {
        const tradedirection = row.getValue("direction");
        const tradedirectionToUpper =
          tradedirection.charAt(0).toUpperCase() +
          tradedirection.substring(1, 5);

        const renderPercentageCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (tradedirection == processedQueryData[index].direction) {
              const directioncolor =
                tradedirection < "short" ? "text-green" : "text-red";
              return (
                <div
                  className={`${directioncolor} flex flex-row text-xs w-1/2 items-center`}
                >
                  <div className="flex flex-col">
                    {" "}
                    <p>{tradedirectionToUpper} </p>
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
      accessorKey: "derivativename",
      header: () => <div className="text-icongray font-normal"> Symbol </div>,
      cell: ({ row }: any) => {
        const name = row.getValue("derivativename");
        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (name == processedQueryData[index].derivativename) {
              return (
                <div className="flex flex-row text-sm font-medium items-center ml-2">
                  {processedQueryData[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-1/2 ml-2">
                    <div> {processedQueryData[index].derivativename}</div>
                    <div>
                      {" "}
                      {processedQueryData[index].leverage}x{" "}
                      {processedQueryData[index].derivateexchange}{" "}
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
      accessorKey: "entry",
      header: ({ column }: any) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Entry <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("entry"));
        const formatted = formatCurrency(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "liquidationprice",
      header: ({ column }: any) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Liq - Price <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("liquidationprice"));
        const formatted = formatCurrency(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "margin",
      header: ({ column }: any) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Margin <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("margin"));
        const formatted = formatCurrency(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "sl",
      header: () => {
        return (
          <div className="flex flex-row text-icongray font-normal items-center">
            SL/TP
          </div>
        );
      },
      cell: ({ row }: any) => {
        const sl = row.getValue("sl");

        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (sl == processedQueryData[index].sl) {
              const tp = processedQueryData[index].tp;
              const checkedsl = sl == null ? "--" : sl.toString() + "%";
              const checkedtp = tp == null ? "--" : tp.toString() + "%";

              return (
                <div className="flex flex-row text-sm font-medium items-center ml-2">
                  {checkedsl}/{checkedtp}
                </div>
              );
            }
          }
        };
        return renderNameCell();
      },
    },
    {
      accessorKey: "settlementdate",
      header: () => {
        return (
          <div className="flex flex-row text-icongray font-normal items-center">
            Settlement Date
          </div>
        );
      },
      cell: ({ row }: any) => {
        const settlementdate = row.getValue("settlementdate");

        const checkedsettlementdate =
          settlementdate == "" ? "--" : settlementdate.substring(0, 9);
        return <div> {checkedsettlementdate}</div>;
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
      cell: () => {
        return (
          <div className="flex flex-row justify-start text-3xl items-center">
            {" "}
            <NotesInDataTableIcon />{" "}
          </div>
        );
      },
    },
  ];
};

export const formatDataColsNft = (processedQueryData: any) => {
  return [
    {
      accessorKey: "collectionname",
      header: () => (
        <div className="text-icongray font-normal"> Collection </div>
      ),
      cell: ({ row }: any) => {
        const name = row.getValue("collectionname");
        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (name == processedQueryData[index].collectionname) {
              return (
                <div className="flex flex-row text-sm font-medium items-center ml-2">
                  {processedQueryData[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-1/2 ml-2">
                    {processedQueryData[index].collectionname}
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
      accessorKey: "collectionvalue",
      header: ({ column }: any) => {
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
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("collectionvalue"));
        const formatted = formatCurrency(amount);

        return <div> {formatted} </div>;
      },
    },
    {
      accessorKey: "collectionfloorprice",
      header: ({ column }: any) => {
        return (
          <button
            className="flex flex-row text-icongray font-normal items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Floor Price <SortingDataTableIcon className="ml-2 h-4 w-4" />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("collectionvalue"));
        return <div> {amount} ETH </div>;
      },
    },
    {
      accessorKey: "nftcount",
      header: "NFT-Count",
    },
    {
      accessorKey: "notes",
      header: () => (
        <div className="flex flex-row justify-start text-icongray font-normal">
          {" "}
          Notes{" "}
        </div>
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex flex-row justify-start text-3xl items-center">
            {" "}
            <NotesInDataTableIcon />{" "}
          </div>
        );
      },
    },
  ];
};
