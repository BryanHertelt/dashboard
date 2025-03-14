"use client";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { BitcoinIcon, EthereumIcon } from "@/../public/images";
import { formatCurrency } from "../helpers/helper-functions";
import { useState } from "react";
import { formatMainLineData } from "../design-components/charts/main-chart-line-formatter";
import { useValueChart } from "../datafetching/client-refetch/client-hooks";
import { getTimeFrames } from "../datafetching/layer";
import {
  LoadingSkeleton,
  ErrorSkeleton,
} from "../datafetching/loading-skeleton";

const AssetValueChartComponent = ({ currentValue, initialData }: any) => {
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
  const [toggled, setToggled] = useState<boolean>(true);
  const [scope, setScope] = useState<string>(
    comparators.btc === false && comparators.eth === false
      ? "portfoliotimeframes"
      : "development"
  );

  const { processedQueryData, isLoading, isError } = useValueChart({
    qKey: [
      comparators.btc === false && comparators.eth === false
        ? "portfoliotimeframes"
        : "development",
      timeframe.timeframe.toString(),
    ],
    initialData: initialData,
    queryFunction: getTimeFrames,
    searchquery: timeframe.timeframe.replace(" ", ""),
    scope:
      comparators.btc === false && comparators.eth === false
        ? "portfoliotimeframes"
        : "development",
  });

  console.log(
    "comparators states",
    comparators.btc === false && comparators.eth === false
  );
  const handleTimeFrames = (item: any) => {
    setComparators((prev: any) => {
      return {
        costbasis: prev.costbasis,
        btc: false,
        eth: false,
      };
    });
    setScope("portfoliotimeframes");
    setTimeframe(item);
    setToggled(!toggled);
  };
  const dropDownDesign =
    toggled === false
      ? "hidden"
      : "card flex flex-col border-rounded w-3/12 h-3/6 overflow-auto bg-blue";

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
    { timeframe: "1 year", timeunit: "quarter" },
    { timeframe: "3 years", timeunit: "quarter" },
    { timeframe: "5 years", timeunit: "year" },
  ];
  return (
    <div className="relative w-full h-full">
      <header>
        <div className=" flex flex-row justify-between">
          <h1 className="font-medium text-xl"> Assets </h1>
          <div className=" flex flex-row justify-end w-4/12 h-8">
            <button
              className="bg-gray text-icongray text-sm h-full w-6/12 mr-2.5 rounded-md"
              onClick={() =>
                setComparators((prev: any) => {
                  return {
                    costbasis:
                      scope != "development" ? !prev.costbasis : prev.costbasis,
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
              className="bg-gray text-icongray text-sm h-full w-3/12 rounded-md"
            >
              {timeframe.timeframe == "12 hours"
                ? timeframe.timeframe.substring(0, 4).replace(" ", "")
                : timeframe.timeframe.substring(0, 3).replace(" ", "")}{" "}
            </button>
          </div>
          <div className={`${dropDownDesign} absolute top-1/4 right-1`}>
            {dropDownMenuValues.map((item: any, index: number) => {
              return (
                <button
                  key={item.timeframe}
                  onClick={() => handleTimeFrames(item)}
                  className="border-b-2 border-solid border-gray w-full"
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
        <div className="flex flex-row h-10 items-center mt-5">
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
          <div className="border border-left border-gray h-4/5 w-0 mx-5 " />
          <button className="flex flex-row items-center justify-center bg-gray text-black text-xs w-1/12 h-4/5 rounded-sm mt-1">
            <div className=" bg-black rounded-sm h-3 w-3 mr-1" />
            My Assets{" "}
          </button>
          {comparators.btc === true ? (
            <div className="flex flex-row items-center justify-center bg-gray text-black text-xs w-1/12 h-4/5 rounded-sm mt-1">
              <div className=" bg-black rounded-sm h-3 w-3 mr-1" />
              Bitcoin{" "}
            </div>
          ) : null}
          {comparators.eth === true ? (
            <div className="flex flex-row items-center justify-center bg-gray text-black text-xs w-1/12 h-4/5 rounded-sm mt-1">
              <div className=" bg-black rounded-sm h-3 w-3 mr-1" />
              Ethereum{" "}
            </div>
          ) : null}
        </div>
      </header>
      <div className="w-full h-4/6">
        <div className="flex flex-row justify-center w-full h-full">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorSkeleton />
          ) : (
            <LineComponent
              processedQueryData={processedQueryData}
              timeframe={timeframe}
              comparators={comparators}
              scope={
                comparators.btc === false && comparators.eth === false
                  ? "portfoliotimeframes"
                  : "development"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetValueChartComponent;

const LineComponent = (props: any) => {
  const lineConfig = formatMainLineData(
    props.processedQueryData,
    props.timeframe,
    props.comparators,
    props.scope
  );
  return <Line data={lineConfig.data} options={lineConfig.config} />;
};
