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
        <h1 className="font-semibold text-xl"> Assets </h1>
        <div className=" flex flex-row justify-end">
          <p className=" w-11/12 font-semibold text-2xl"> $5.200 </p>
          <button> Cost Basis </button>
          <button> Timeframe </button>
        </div>
        <div className="flex flex-row">
          <button>
            {" "}
            <BitcoinIcon />{" "}
          </button>
          <button>
            {" "}
            <EthereumIcon />{" "}
          </button>
          <button> MyAssets </button>
        </div>
      </header>
      <div className="w-full h-4/6">
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
