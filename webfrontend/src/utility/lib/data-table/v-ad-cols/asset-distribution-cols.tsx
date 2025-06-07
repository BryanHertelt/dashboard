"use client";

import {
  PositionDirectionIcon,
  SortingDataTableIcon,
} from "../../../../../public/images/icons";
import { formatCurrency, formatValue } from "../../helpers";

import {
  headerdesign,
  firstcelldesign,
  celldesign,
  sortingicondesgin,
} from "../../helpers/helper-config/colors";

interface nftDataInterface {
  assetid: number;
  assetname: string;
  asseetpercentage: string;
  assettype: "nft";
  collectionfloorprice: number;
  collectionvalue: number;
  collectionvalueth: number;
  groupid: number;
  holdingid: number;
  assetamount: number;
  notes?: string;
  portfolioid: number;
  profitloss: number;
  profitlosschange: number;
  symbol: string;
  userid: number;
}

export interface derivativesDataInterface {
  symbol: string;
  portfolioid: number;
  userid: number;
  groupid: number;
  holdingid: number;
  assettype: string;
  assetid: number;
  assetname: string;
  positiontype: string;
  derivativetype: string;
  leverage: number;
  asssetamount: number;
  entry: number;
  unrealizedpl: number;
  price: number;
  liquidationprice: number;
  margin: number;
  tp: number;
  sl: number;
  settlementdate: string | null;
  profitloss: number;
  profitlosschange: number;
  notes?: string;
}

/**
 * dataColsCurrency is an object, which holds header and column definitions for the data-table status currency.
 */
export const dataColsCurrency = [
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

      return (
        <div className={`${firstcelldesign} w-full`}>
          {row.original.symbol} {""}{" "}
          <div className="flex flex-col justify-start w-full ml-2">
            {name}
            <div className="text-xs text-icongray w-2/5 justify-start">
              {row.original.assetabbreviation}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "assetpercentage",
    header: ({ column }: any) => {
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
    cell: ({ row }: any) => {
      const percentage = parseFloat(row.getValue("assetpercentage"));
      const formattedPercentage = formatValue(Number(percentage));
      return (
        <div className={`${celldesign} w-1/3`}> {formattedPercentage} %</div>
      );
    },
  },
  {
    accessorKey: "assetvalue",
    header: ({ column }: any) => {
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
          Value/Amount
        </button>
      );
    },
    cell: ({ row }: any) => {
      const value = parseFloat(row.getValue("assetvalue"));
      const formattedValue = formatCurrency(value);
      const formattedAmount = formatValue(Number(row.original.assetamount));

      return (
        <section
          className={`${celldesign} w-1/3 flex flex-col justify-end items-end`}
        >
          <div className="flex flex-row w-full justify-end">
            {" "}
            {formattedValue}{" "}
          </div>
          <div className="flex flex-row w-full justify-end">
            {" "}
            {formattedAmount}
          </div>{" "}
        </section>
      );
    },
  },
  {
    accessorKey: "assetchange24h",
    header: ({ column }: any) => {
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
    cell: ({ row }: any) => {
      const percentage = parseFloat(row.getValue("assetchange24h"));
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
    header: ({ column }: any) => {
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
    cell: ({ row }: any) => {
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
];

/**
 * dataColsDerivative is an object, which holds header and column definitions for the data-table status derivative.
 */
export const dataColsDerivative = [
  {
    accessorKey: "assetname",
    header: () => (
      <div className="flex flex-row font-normal items-center justify-start text-black h-11  w-full ">
        Symbol
      </div>
    ),
    cell: ({ row }: any) => {
      const name = row.getValue("assetname");
      const tradeDirection = row.original.tradedirection;
      const leverage = row.original.leverage;
      const symbol = row.original.symbol;
      const derivativeExchange = row.original.derivativeexchange;

      return (
        <div
          className={`flex flex-row justify-start items-center  text-black font-normal `}
        >
          <PositionDirectionIcon direction={tradeDirection} />
          <div className="flex flex-col items-start w-full ml-2">
            <div> {name}</div>
            <div className="flex flex-row justify-start items-center">
              {" "}
              <div className="flex justify-center items-center mr-1 text-xs items text-center text-blue bg-lightblue rounded-sm h-4 p-1">
                {" "}
                x{leverage}{" "}
              </div>
              <div className="flex flex-row">
                {" "}
                {symbol} {""} {derivativeExchange}{" "}
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "entry",
    header: ({ column }: any) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`flex flex-row font-normal items-center justify-end text-black h-11 w-full`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />{" "}
          Entry
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
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign}`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />{" "}
          Liq. Price
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
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign}`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />{" "}
          Margin
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
    header: ({ column }: any) => {
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
    cell: ({ row }: any) => {
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
            <p className={`${profitloss < 0 ? " text-red" : "text-green"}`}>
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
 * dataColsNft is an object, which holds header and column definitions for the data-table status nft.
 */
export const dataColsNft = [
  {
    accessorKey: "assetname",
    header: () => <div className=" font-normal"> Collection </div>,
    cell: ({ row }: any) => {
      const name = row.getValue("assetname");
      const symbol = row.original.symbol;

      return (
        <div className={` ${firstcelldesign}`}>
          {symbol} {""}{" "}
          <div className="flex flex-col justify-start w-1/2 ml-2">
            <p> {name} </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "collectionfloorprice",
    header: ({ column }: any) => {
      const sorted = column.getIsSorted();
      return (
        <button
          className={`${headerdesign}w-1/2`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {" "}
          <SortingDataTableIcon
            className={`${sortingicondesgin}`}
            sorted={sorted}
          />
          Floor Price{" "}
        </button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("collectionvalue"));
      return <div className={`${celldesign}`}>{amount} ETH</div>;
    },
  },
  {
    accessorKey: "collectionvalue",
    header: ({ column }: any) => {
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
          Value
        </button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("collectionvalue"));
      const formattedAmount = formatCurrency(amount);
      const valueEth = row.original.collectionvalueeth;

      return (
        <div className={` flex flex-col justify-end items-end`}>
          <p> {formattedAmount} </p>
          <p className="text-xs"> {formatValue(Number(valueEth))} ETH </p>{" "}
        </div>
      );
    },
  },
  {
    accessorKey: "assetamount",
    header: () => <div className={`${headerdesign} pr-5`}>Amount </div>,
    cell: ({ row }: any) => {
      const count = parseFloat(row.getValue("assetamount"));
      return <div className={`${celldesign} pr-5`}> {count} </div>;
    },
  },
  {
    accessorKey: "profitloss",
    header: ({ column }: any) => {
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
    cell: ({ row }: any) => {
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
            <p className={`${profitloss < 0 ? " text-red" : "text-green"}`}>
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
