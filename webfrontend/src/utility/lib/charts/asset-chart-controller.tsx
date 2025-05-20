"use client";
import { BitcoinIcon, EthereumIcon } from "@/../public/images";
import { LineChartComponent } from "../charts";
import { formatCurrency } from "../helpers";
import { useState } from "react";
import {
  SmallLoadingSkeleton,
  SmallErrorSkeleton,
  useValueChart,
} from "../data-fetching";

const LineChartController = ({ currentValue, initialData }: any) => {
  const [comparators, setComparators] = useState({
    costbasis: false,
    btc: false,
    eth: false,
  });
  const [timeframe, setTimeframe] = useState<{
    timeframe: string;
    timeunit: string;
  }>({
    timeframe: "7 days",
    timeunit: "day",
  });
  const [toggled, setToggled] = useState<boolean>(false);

  const scope =
    comparators.btc === false && comparators.eth === false
      ? "portfoliotimeframes"
      : "development";

  const { processedQueryData, isLoading, isError } = useValueChart({
    qKey: [scope, timeframe.timeframe.toString()],
    initialData: initialData,
    searchquery: timeframe.timeframe.replace(" ", ""),
    scope: scope,
  });

  const comparatorsData = [
    {
      label: "Bitcoin",
      color: "bg-bitcoinyellow",
      index: 1,
      comparator: comparators.btc,
    },
    {
      label: "Ethereum",
      color: "bg-ethereumblue",
      index: 2,
      comparator: comparators.eth,
    },
  ];

  const dropDownDesign =
    toggled === false
      ? "hidden"
      : "card flex flex-col border-rounded w-60 h-48 overflow-auto bg-blue lg:w-74";

  const buttonLine =
    "flex flex-row items-center justify-center bg-gray text-black text-xs w-40 h-4/5 rounded-sm mt-1 ml-3";

  const dropDownMenuValues = [
    { timeframe: "YTD", timeunit: "month" },
    { timeframe: "all", timeunit: "year" },
    { timeframe: "1 hour", timeunit: "minute" },
    { timeframe: "4 hours", timeunit: "minute" },
    { timeframe: "12 hours", timeunit: "hour" },
    { timeframe: "1 day", timeunit: "hour" },
    { timeframe: "7 days", timeunit: "day" },
    { timeframe: "1 month", timeunit: "day" },
    { timeframe: "3 months", timeunit: "week" },
    { timeframe: "6 months", timeunit: "month" },
    { timeframe: "1 year", timeunit: "month" },
    { timeframe: "3 years", timeunit: "month" },
    { timeframe: "5 years", timeunit: "year" },
  ];

  const handleTimeFrames = (item: any) => {
    setComparators((prev: any) => {
      return {
        costbasis: prev.costbasis,
        btc: false,
        eth: false,
      };
    });
    setTimeframe(item);
    setToggled(!toggled);
  };

  return (
    <div className="relative w-full h-full">
      <header className="flex-wrap">
        <div className=" flex flex-row justify-between flex-wrap">
          <h1 className="font-medium text-xl"> Assets </h1>
          <div className=" flex flex-row justify-end w-4/12 h-8">
            <button
              className={`${
                comparators.costbasis ? "border border-black" : "none"
              } bg-gray text-black text-sm h-full w-4/12 mr-2.5 rounded-md`}
              onClick={() =>
                setComparators((prev: any) => {
                  return {
                    costbasis:
                      scope === "portfoliotimeframes"
                        ? !prev.costbasis
                        : prev.costbasis,
                    btc: prev.btc,
                    eth: prev.eth,
                  };
                })
              }
            >
              {" "}
              Cost Basis{" "}
            </button>
            <button
              onClick={() => setToggled(!toggled)}
              className="bg-gray text-black text-sm h-full w-2/12 rounded-md"
            >
              {timeframe.timeframe == "12 hours"
                ? timeframe.timeframe.substring(0, 4).replace(" ", "")
                : timeframe.timeframe.substring(0, 3).replace(" ", "")}{" "}
            </button>
          </div>
          <div className={`${dropDownDesign} absolute top-10 right-1`}>
            {dropDownMenuValues.map((item: any, index: number) => {
              return (
                <button
                  key={item.timeframe}
                  onClick={() => handleTimeFrames(item)}
                  className={`flex flex-row justify-start border-b-2 border-solid border-gray w-full py-2 px-4 text-black text-sm hover:bg-gray`}
                >
                  {item.timeframe}
                </button>
              );
            })}
          </div>
        </div>
        <p className=" w-11/12 font-semibold text-2xl text-currentvaluefont">
          {formatCurrency(currentValue)}
        </p>
        <div className="flex flex-row">
          <div className="flex flex-row h-10 items-center mt-1">
            <button
              className="mt-1 mr-2 text-3xl h-full rounded-md"
              onClick={() => {
                setComparators((prev: any) => {
                  return {
                    costbasis: false,
                    btc: !prev.btc,
                    eth: prev.eth,
                  };
                });
              }}
            >
              {" "}
              <BitcoinIcon />{" "}
            </button>
            <button
              className="mt-1 text-3xl h-full rounded-md "
              onClick={() => {
                setComparators((prev: any) => {
                  return {
                    costbasis: false,
                    btc: prev.btc,
                    eth: !prev.eth,
                  };
                });
              }}
            >
              {" "}
              <EthereumIcon />{" "}
            </button>
            <div className="border border-left  border-gray h-4/5 w-0 mx-5 mt-1 " />
            <button className={`${buttonLine} flex flex-row`}>
              <div
                className={` ${
                  scope === "development" ? "bg-black" : "bg-flyzerblue"
                } rounded-sm h-3 w-3 mr-2 `}
              />
              <p> My Assets </p>
              {isLoading === true ? null : scope === "development" ? (
                <>
                  <p className="ml-1"> ≈ </p>
                  <p className="text-xs ml-1">
                    {processedQueryData[
                      processedQueryData.length - 1
                    ].y[0].toString()}{" "}
                    %
                  </p>
                </>
              ) : null}
            </button>
            {comparators.costbasis === true ? (
              <div className={`${buttonLine} flex flex-row`}>
                <div className="bg-icongray rounded-sm h-3 w-3 mr-1" />
                <p className="ml-1"> Cost Basis </p>
              </div>
            ) : null}
            {comparatorsData.map(
              ({ label, color, index, comparator }) =>
                comparator && (
                  <div className={`${buttonLine} flex flex-row`} key={label}>
                    <div className={`${color} rounded-sm h-3 w-3 mr-1`} />
                    <p className="ml-1">{label} ≈ </p>
                    {isLoading ? null : (
                      <p className="text-xs ml-1">
                        {processedQueryData[processedQueryData.length - 1].y[
                          index
                        ].toString()}{" "}
                        %
                      </p>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      </header>
      <div className="w-full lg:h-72 xl:h-96 md:h-60 lp:h-72 md:pb-5 lg:pb-5">
        <div className="flex flex-row justify-center w-12/12 h-full">
          {isLoading ? (
            <SmallLoadingSkeleton />
          ) : isError ? (
            <SmallErrorSkeleton />
          ) : (
            <LineChartComponent
              processedQueryData={processedQueryData}
              timeframe={timeframe}
              comparators={comparators}
              scope={scope}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LineChartController;
