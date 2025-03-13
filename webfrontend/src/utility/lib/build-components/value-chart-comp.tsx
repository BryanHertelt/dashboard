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
  const [timeframe, setTimeframe] = useState<{
    timeframe: string;
    timeunit: string;
  }>({
    timeframe: "7 days",
    timeunit: "day",
  });
  const [toggled, setToggled] = useState<boolean>(true);

  const { processedQueryData, isLoading, isError, error } = useValueChart({
    qKey: [timeframe.timeframe.toString()],
    initialData: initialData,
    queryFunction: getTimeFrames,
    searchquery: timeframe.timeframe.replace(" ", ""),
  });

  if (isError) {
    return <ErrorSkeleton />;
  }
  if (isLoading) {
    console.log("Is Loading");
    return <LoadingSkeleton />;
  }

  const lineConfig = formatMainLineData(processedQueryData, timeframe);

  const dropDownDesign =
    toggled === false
      ? "hidden"
      : "card flex flex-col border-rounded w-3/12 h-3/6 overflow-auto bg-blue";

  const dropDownMenuValues = [
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
            <button className="bg-gray text-icongray text-sm h-full w-6/12 mr-2.5 rounded-md">
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
                  onClick={() => {
                    setTimeframe(item);
                    setToggled(!toggled);
                  }}
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
          <button className="mt-1 mr-2 text-3xl h-full rounded-md">
            {" "}
            <BitcoinIcon />{" "}
          </button>
          <button className="mt-1 text-3xl h-full rounded-md ">
            {" "}
            <EthereumIcon />{" "}
          </button>
          <div className="border border-left border-gray h-4/5 w-0 mx-5 " />
          <button className="flex flex-row items-center justify-center bg-gray text-black text-xs w-1/12 h-4/5 rounded-sm mt-1">
            <div className=" bg-black rounded-sm h-3 w-3 mr-1" />
            My Assets{" "}
          </button>
        </div>
      </header>
      <div className="w-full h-4/6">
        <div className="flex flex-row justify-center w-full h-full">
          <Line data={lineConfig.data} options={lineConfig.config} />
        </div>
      </div>
    </div>
  );
};

export default AssetValueChartComponent;
