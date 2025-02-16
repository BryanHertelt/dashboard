"use client";
import { Line } from "react-chartjs-2";
import { lineChartOptions } from "@/api/distribution/chartdataformatter";
import { BitcoinIcon, EthereumIcon } from "@/../public/images";
import { formatCurrency } from "@/utility/lib/dataformatters/currencyformatter";
import DropDownMenu from "@/utility/lib/dropdownmenu";
import { useState } from "react";
import { formatMainLineData } from "@/utility/lib/dataformatters/formatchartdata";

const AssetValueChartComponent = ({ data, portfolioResponse }: any) => {
  const [timeframe, setTimeframe] = useState("1 day");
  const [toggled, setToggled] = useState(true);

  const lineData = formatMainLineData(portfolioResponse, timeframe);

  const dropDownDesign =
    toggled === false
      ? "hidden"
      : "card flex flex-col border-rounded w-3/12 h-3/6 overflow-auto bg-blue";

  if (portfolioResponse[0] === "failed") {
    return (
      <div className="flex flex-row justify-center items-center h-full w-full">
        Failed to load portfolio data...{" "}
      </div>
    );
  }
  const dropDownMenuValues = [
    "all",
    "1 hour",
    "4 hours",
    "12 hours",
    "1 day",
    "3 days",
    "7 days",
    "1 month",
    "3 months",
    "6 months",
    "1 year",
    "3 years",
    "5 years",
  ];

  const portfolioValue = portfolioResponse[0].currentvalue;
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
              {timeframe == "12 hours"
                ? timeframe.substring(0, 4).replace(" ", "")
                : timeframe.substring(0, 3).replace(" ", "")}{" "}
            </button>
          </div>
          <div className={`${dropDownDesign} absolute top-1/4 right-1`}>
            {dropDownMenuValues.map((item: any, index: number) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setTimeframe(item);
                    setToggled(!toggled);
                  }}
                  className="border-b-2 border-solid border-gray w-full"
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        <p className=" w-11/12 font-semibold text-2xl text-currentvaluefont">
          {formatCurrency(portfolioValue)}
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
          <Line options={lineChartOptions} data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default AssetValueChartComponent;
