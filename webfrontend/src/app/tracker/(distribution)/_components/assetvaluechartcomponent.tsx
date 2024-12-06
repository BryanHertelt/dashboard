"use client";
import { Line } from "react-chartjs-2";
import { lineChartOptions } from "@/api/distribution/chartdataformatter";
import { BitcoinIcon, EthereumIcon } from "@/../public/images";

const AssetValueChartComponent = ({ data, portfolioResponse }: any) => {
  console.log(portfolioResponse);
  return (
    <>
      <header>
        <div className=" flex flex-row justify-between">
          <h1 className="font-medium text-xl"> Assets </h1>
          <div className=" flex flex-row justify-end w-2/12 h-8 ">
            <button className="bg-gray text-icongray text-sm h-full w-6/12 mr-2.5 rounded-md">
              {" "}
              Cost Basis{" "}
            </button>
            <button className="bg-gray text-icongray text-sm h-full w-4/12 rounded-md ">
              {" "}
              1h{" "}
            </button>
          </div>
        </div>
        <p className=" w-11/12 font-semibold text-2xl text-currentvaluefont">
          ${portfolioResponse.currentvalue}
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
      <div className="w-full h-4/6 mt-6">
        <div className=" flex flex-row justify-center w-full h-full">
          <Line options={lineChartOptions} data={data} />
        </div>
      </div>
    </>
  );
};

export default AssetValueChartComponent;
