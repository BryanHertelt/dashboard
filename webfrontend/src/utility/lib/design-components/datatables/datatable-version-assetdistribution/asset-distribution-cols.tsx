"use client";

import {
  PositionDirectionIcon,
  SortingDataTableIcon,
  AssetPercentageValueIcon,
} from "../../../../../../public/images/icons";
import Modal from "@/utility/lib/build-components/pop-ups/modal";
import {
  formatCurrency,
  formatValue,
} from "@/utility/lib/helpers/helper-functions";

const headerdesign =
  "flex flex-row font-normal items-center justify-end text-black h-11  w-5/6  ";
const celldesign = "flex flex-row justify-end items-center w-5/6 pr-1 ";
const firstcelldesign = "flex flex-row text-sm font-medium items-center";
const sortingicondesgin = "bg-red h-5 w-1 ml-1 rounded-sm";

/**
 *
 * @param parentdata Passes the data, fetched from the page component down to the data table component.
 * @returns
 */
export const formatDataColsCurrency = (parentdata: any) => {
  return [
    {
      accessorKey: "assetname",
      header: () => (
        <div
          className={`flex flex-row justify-start items-center pl-1 text-black h-11 w-full`}
        >
          {" "}
          Asset{" "}
        </div>
      ),
      cell: ({ row }: any) => {
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < parentdata.length; index++) {
            if (name == parentdata[index].assetname) {
              return (
                <div className={`${firstcelldesign} w-full`}>
                  {parentdata[index].symbol} {""}{" "}
                  <div className="flex flex-col justify-start w-full ml-2">
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
            Percentage{" "}
            <SortingDataTableIcon className={`${sortingicondesgin}`} />
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
            Value
            <SortingDataTableIcon className={`${sortingicondesgin}`} />
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
              const percentagecolor =
                percentage < 0
                  ? " bg-lightred text-red text-xs rounded-md"
                  : " bg-lightgreen text-green text-xs rounded-md;";
              const iconcolor = percentage < 0 ? "text-red" : "text-green";
              return (
                <div className={`${celldesign}`}>
                  <div
                    className={`${percentagecolor}  flex flex-row text-xs w-32 items-center justify-between px-2  rounded-md`}
                  >
                    <div className={`${iconcolor} flex flex-row mx-1 `}>
                      <AssetPercentageValueIcon percentage={percentage < 0} />
                    </div>
                    <div className="flex flex-col">
                      {" "}
                      <p>
                        {percentage < 0
                          ? percentage.toString().replace("-", "")
                          : percentage}
                        %{" "}
                      </p>
                      <p>
                        {" "}
                        {percentage < 0
                          ? formattedPercentageValue.replace("-", "")
                          : formattedPercentageValue}{" "}
                      </p>
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
      accessorKey: "profitloss",
      header: () => {
        return <div className={`${headerdesign} pr-1`}>P/L</div>;
      },
      cell: ({ row }: any) => {
        const profitloss = row.getValue("profitloss");
        const renderProfitCell = () => {
          return (
            <div className={`${celldesign}`}>
              {" "}
              <p className={`${profitloss < 0 ? " text-red" : "text-green"}`}>
                {formatCurrency(
                  profitloss < 0
                    ? Number(profitloss.toString().replace("-", ""))
                    : profitloss
                )}
              </p>
            </div>
          );
        };
        return renderProfitCell();
      },
    },
  ];
};

export const formatDataColsDerivative = (processedQueryData: any) => {
  return [
    {
      accessorKey: "assetname",
      header: () => (
        <div className="flex flex-row font-normal items-center justify-start text-black h-11  w-full ">
          Symbol
        </div>
      ),
      cell: ({ row }: any) => {
        const name = row.getValue("assetname");

        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (name == processedQueryData[index].assetname) {
              let direction = processedQueryData[index].tradedirection;
              return (
                <div
                  className={`flex flex-row justify-start items-center  text-black font-normal `}
                >
                  <PositionDirectionIcon direction={direction} />
                  <div className="flex flex-col items-start w-full ml-2">
                    <div> {processedQueryData[index].assetname}</div>
                    <div className="flex flex-row justify-start items-center">
                      {" "}
                      <div className="flex justify-center items-center mr-1 text-xs items text-center text-blue bg-lightblue rounded-sm h-4 p-1">
                        {" "}
                        x{processedQueryData[index].leverage}{" "}
                      </div>
                      <div className="flex flex-row">
                        {" "}
                        {processedQueryData[index].symbol} {""}{" "}
                        {processedQueryData[index].derivateexchange}{" "}
                      </div>
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
            className={`flex flex-row font-normal items-center justify-end text-black h-11 w-5/6`}
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

        return <div className={`${celldesign}`}> {formatted} </div>;
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
            Liq. Price{" "}
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
      accessorKey: "profitloss",
      header: () => {
        return <div className={`${headerdesign}  pr-1`}>P/L</div>;
      },
      cell: ({ row }: any) => {
        const profitloss = row.getValue("profitloss");
        const renderProfitCell = () => {
          return (
            <div className={`${celldesign}`}>
              {" "}
              <p className={`${profitloss < 0 ? " text-red" : "text-green"}`}>
                {formatCurrency(
                  profitloss < 0
                    ? Number(profitloss.toString().replace("-", ""))
                    : profitloss
                )}
              </p>
            </div>
          );
        };
        return renderProfitCell();
      },
    },
  ];
};

export const formatDataColsNft = (processedQueryData: any) => {
  return [
    {
      accessorKey: "assetname",
      header: () => <div className=" font-normal pl-10"> Collection </div>,
      cell: ({ row }: any) => {
        const name = row.getValue("assetname");
        const renderNameCell = () => {
          for (let index = 0; index < processedQueryData.length; index++) {
            if (name == processedQueryData[index].assetname) {
              return (
                <div className={` ${firstcelldesign}`}>
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
            className={`${headerdesign}w-1/2`}
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
        return <div className={`${celldesign}`}>{amount} ETH</div>;
      },
    },
    {
      accessorKey: "profitloss",
      header: () => {
        return <div className={`${headerdesign}  pr-1`}>P/L</div>;
      },
      cell: ({ row }: any) => {
        const profitloss = row.getValue("profitloss");
        const renderProfitCell = () => {
          return (
            <div className={`${celldesign}`}>
              {" "}
              <p className={`${profitloss < 0 ? " text-red" : "text-green"}`}>
                {formatCurrency(
                  profitloss < 0
                    ? Number(profitloss.toString().replace("-", ""))
                    : profitloss
                )}
              </p>
            </div>
          );
        };
        return renderProfitCell();
      },
    },
    {
      accessorKey: "nftcount",
      header: () => <div className={`${headerdesign} pr-5`}>Amount </div>,
      cell: ({ row }: any) => {
        const count = parseFloat(row.getValue("nftcount"));
        return <div className={`${celldesign} pr-5`}> {count} </div>;
      },
    },
  ];
};
