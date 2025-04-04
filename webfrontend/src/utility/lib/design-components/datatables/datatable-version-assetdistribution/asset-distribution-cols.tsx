"use client";

import { AssetPercentageValueIcon } from "../../../../../../public/images";
import {
  PositionDirectionIcon,
  SortingDataTableIcon,
  ShowDetailIcon,
} from "../../../../../../public/images/icons";
import {
  formatCurrency,
  formatValue,
} from "@/utility/lib/helpers/helper-functions";
import { prefetchDetailComponent } from "@/utility/lib/datafetching/client-refetch/prefetch-hooks";
import { TableLineChart } from "../../charts/table-line-charts";

const toggleExpandedRow = (rowId: number, setExpandedRow: any) => {
  setExpandedRow((prevExpandedRow: number | null) =>
    prevExpandedRow === rowId ? null : rowId
  );
};

const headerdesign =
  "flex flex-row font-normal items-center justify-end text-black h-11  w-full";
const celldesign = "flex flex-row justify-end items-center w-1/2 w-full";
const firstcelldesign = "flex flex-row text-sm font-medium items-center ml-2";
const sortingicondesgin = "bg-red h-5 w-1 ml-1 rounded-sm";

export const formatDataColsCurrency = (
  parentdata: any,
  queryClient: any,
  setExpandedRow?: any
) => {
  return [
    {
      accessorKey: "assetname",
      header: () => (
        <div
          className={`flex flex-row justify-start items-center pl-10 text-black h-11 w-full`}
        >
          {" "}
          Asset{" "}
        </div>
      ),
      cell: ({ row }: any) => {
        const rowId = row.id;
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < parentdata.length; index++) {
            if (name == parentdata[index].assetname) {
              return (
                <div className={`${firstcelldesign}`}>
                  <div
                    className="mr-4 h-3 w-3"
                    onClick={() => toggleExpandedRow(rowId, setExpandedRow)}
                    onMouseEnter={() =>
                      prefetchDetailComponent(
                        "cryptocurrency",
                        parentdata[index].assetid,
                        queryClient
                      )
                    }
                  >
                    <ShowDetailIcon />
                  </div>
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
      header: () => <div className={`${headerdesign} pl-2`}> Amount </div>,
      cell: ({ row }: any) => {
        const amount = row.getValue("assetamount");

        return (
          <div className={`${celldesign}`}>{formatValue(Number(amount))}</div>
        );
      },
    },
    {
      accessorKey: "assetpercentage",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <SortingDataTableIcon className={`${sortingicondesgin}`} />
            Percentage{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const percentage = row.getValue("assetpercentage");
        return <div className={`${celldesign} w-1/3`}> {percentage} %</div>;
      },
    },
    {
      accessorKey: "assetvalue",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <SortingDataTableIcon className={`${sortingicondesgin}`} /> Value
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("assetvalue"));
        const formatted = formatCurrency(amount);

        return <div className={`${celldesign} w-1/3`}> {formatted} </div>;
      },
    },
    {
      accessorKey: "assetmarketprice",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Market Price{" "}
            <SortingDataTableIcon className={`${sortingicondesgin}`} />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("assetmarketprice"));
        const formatted = formatCurrency(amount);

        return <div className={`${celldesign} w-1/3`}> {formatted} </div>;
      },
    },
    {
      accessorKey: "assetchange24h",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 24 h{" "}
            <SortingDataTableIcon className={`${sortingicondesgin}`} />{" "}
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
                <div className={`${celldesign}`}>
                  <div
                    className={`${percentagecolor} flex flex-row text-xs w-1/2 items-center justify-center`}
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
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Change 7d{" "}
            <SortingDataTableIcon className={`${sortingicondesgin}`} />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const change = row.getValue("assetchange7d");
        return (
          <div className={`${celldesign}`}>
            <div className="w-2/6 h-5">
              <TableLineChart data={change} />
            </div>
          </div>
        );
      },
    },
  ];
};

export const formatDataColsDerivative = (
  processedQueryData: any,
  queryClient: any,
  setExpandedRow?: any
) => {
  return [
    {
      accessorKey: "tradedirection",
      header: () => <div className=" font-normal pl-5"> Position Type </div>,
      cell: ({ row }: any) => {
        const direction = row.getValue("tradedirection");
        const directionToUpper =
          direction.charAt(0).toUpperCase() + direction.substring(1, 5);
        const rowId = row.id;
        const renderPercentageCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (direction == processedQueryData[index].tradedirection) {
              const directioncolor =
                direction < "short" ? "text-green" : "text-red";
              return (
                <div className={`${directioncolor} ${firstcelldesign}`}>
                  <div
                    className="mr-4 h-3 w-3"
                    onClick={() => toggleExpandedRow(rowId, setExpandedRow)}
                    onMouseEnter={() =>
                      prefetchDetailComponent(
                        "derivative",
                        processedQueryData[index].assetid,
                        queryClient
                      )
                    }
                  >
                    <ShowDetailIcon />
                  </div>
                  <div className="flex flex-row align-baseline">
                    {" "}
                    <PositionDirectionIcon direction={direction} />
                    <p className="pl-3">{directionToUpper} </p>
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
      accessorKey: "assetname",
      header: () => <div className={`${headerdesign}`}> Symbol </div>,
      cell: ({ row }: any) => {
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (name == processedQueryData[index].assetname) {
              return (
                <div className={`${celldesign}`}>
                  {processedQueryData[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-1/2 ml-2">
                    <div> {processedQueryData[index].assetname}</div>
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
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Entry <SortingDataTableIcon
              className={`${sortingicondesgin}`}
            />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("entry"));
        const formatted = formatCurrency(amount);

        return <div className={`${celldesign} w-1/3`}> {formatted} </div>;
      },
    },
    {
      accessorKey: "liquidationprice",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Liq - Price{" "}
            <SortingDataTableIcon className={`${sortingicondesgin}`} />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("liquidationprice"));
        const formatted = formatCurrency(amount);

        return <div className={`${celldesign} w-1/3`}> {formatted} </div>;
      },
    },
    {
      accessorKey: "margin",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Margin <SortingDataTableIcon
              className={`${sortingicondesgin}`}
            />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("margin"));
        const formatted = formatCurrency(amount);

        return <div className={`${celldesign} w-1/3`}> {formatted} </div>;
      },
    },
    {
      accessorKey: "sl",
      header: () => {
        return <div className={`${headerdesign}`}>SL/TP</div>;
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
                <div className={`${celldesign} w-1/3`}>
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
        return <div className={`${headerdesign}`}>Settlement Date</div>;
      },
      cell: ({ row }: any) => {
        const settlementdate = row.getValue("settlementdate");

        const checkedsettlementdate =
          settlementdate == "" ? "--" : settlementdate.substring(0, 9);
        return (
          <div className={`${celldesign} w-1/3`}> {checkedsettlementdate}</div>
        );
      },
    },
  ];
};

export const formatDataColsNft = (
  processedQueryData: any,
  queryClient: any,
  setExpandedRow?: any
) => {
  return [
    {
      accessorKey: "assetname",
      header: () => <div className=" font-normal pl-10"> Collection </div>,
      cell: ({ row }: any) => {
        const rowId = row.id;
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (name == processedQueryData[index].assetname) {
              return (
                <div className={` ${firstcelldesign}`}>
                  <div
                    className="mr-4 h-3 w-3"
                    onClick={() => toggleExpandedRow(rowId, setExpandedRow)}
                    onMouseEnter={() =>
                      prefetchDetailComponent(
                        "nft",
                        processedQueryData[index].assetid,
                        queryClient
                      )
                    }
                  >
                    <ShowDetailIcon />
                  </div>
                  {processedQueryData[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-1/2 ml-2">
                    <p> {processedQueryData[index].assetname} </p>
                    <p className="text-icongray"> ETH </p>
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
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Value <SortingDataTableIcon
              className={`${sortingicondesgin}`}
            />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("collectionvalue"));
        const formatted = formatCurrency(amount);

        return <div className={`${celldesign} w-1/5`}> {formatted} </div>;
      },
    },
    {
      accessorKey: "collectionfloorprice",
      header: ({ column }: any) => {
        return (
          <button
            className={`${headerdesign}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {" "}
            Floor Price{" "}
            <SortingDataTableIcon className={`${sortingicondesgin}`} />{" "}
          </button>
        );
      },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("collectionvalue"));
        return (
          <div className={`${celldesign} w-1/3 items-center justify-center`}>
            {amount} ETH
          </div>
        );
      },
    },
    {
      accessorKey: "nftcount",
      header: () => <div className={`${headerdesign}`}> NFT-Count </div>,
      cell: ({ row }: any) => {
        const count = parseFloat(row.getValue("nftcount"));
        return <div className={`${celldesign}`}> {count} </div>;
      },
    },
  ];
};
