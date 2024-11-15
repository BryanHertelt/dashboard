"use client";
import {
  AssetLineChart,
  AssetPieChart,
} from "@/lib/distribution/assets-distributioncharts";

import { DataTable } from "@/lib/datatable/data-table";
import { assetdistributioncolumns } from "@/lib/distribution/asset-distributioncolumns";
import { cryptocurrencyMockData } from "@/api/distribution/asset-distributiontabledata";
import { BitcoinIcon, EthereumIcon } from "@/../public/images";

export const AssetValueComponent = () => {
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
          {" "}
          $5.200{" "}
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
          <AssetLineChart />
        </div>
      </div>
    </>
  );
};

export const AssetDistributionComponent = () => {
  return (
    <>
      <header>
        <h1>Asset Distribution</h1>
        <p className="text-icongray mb-3">
          {" "}
          You can see your Asset Distribution here.{" "}
        </p>
      </header>
      <hr />
      <div className=" flex flex-row justify-center align-middle w-full h-full my-11">
        <div className="flex flex-row justify-center w-10/12 h-4/6">
          <AssetPieChart />
        </div>
      </div>
    </>
  );
};

export const AssetDistributionDetailComponent = () => {
  return (
    <>
      <div className="flex flex-row justify-between mb-7">
        <header>
          <h1 className="font-semibold text-xl"> Assets </h1>
          <p className="text-icongray">
            {" "}
            You can see all your cryptocurrencies here.{" "}
          </p>
        </header>
        <nav className="flex flex-row justify-around">
          <button className="mr-5 active:bg-blue active:text-white focus:bg-blue focus:text-white">
            {" "}
            Cryptocurrencies{" "}
          </button>
          <button className="mr-5"> NFTs </button>
          <button> Derivatives </button>
        </nav>
      </div>
      <div>
        <DataTable
          columns={assetdistributioncolumns}
          data={cryptocurrencyMockData}
        />
      </div>
    </>
  );
};
