"use client";
import {
  AssetLineChart,
  PieChart,
} from "@/lib/distribution/assets-distributioncharts";
import { assetGroupData } from "@/api/distribution/asset-distributiontabledata";

import { DataTable } from "@/lib/datatable/data-table";
import { assetdistributioncolumns } from "@/lib/distribution/asset-distributioncolumns";
import { cryptocurrencyMockData } from "@/api/distribution/asset-distributiontabledata";
import { BitcoinIcon, EthereumIcon } from "@/../public/images";
import { assetgroupdistributioncolumns, assetgrouplistcolumns } from "./col-ag";

export const AssetValueChartComponent = (props: any) => {
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
          <AssetLineChart data={props.data} />
        </div>
      </div>
    </>
  );
};

export const DistributionComponent = (props: any) => {
  return (
    <>
      <header>
        <h1>{props.title}</h1>
        <p className="text-icongray mb-3">{props.text}</p>
      </header>
      <hr />
      <div className=" flex flex-row justify-center align-middle w-full h-full my-11">
        <div className="flex flex-row justify-center w-10/12 h-4/6">
          <PieChart piedata={props.piedata} pieoptions={props.pieoptions} />
        </div>
      </div>
    </>
  );
};

export const DetailTableComponent = (props: any) => {
  return (
    <>
      <div className="flex flex-row justify-between mb-7">
        <header>
          <h1 className="font-semibold text-xl"> {props.title} </h1>
          <p className="text-icongray">{props.text}</p>
        </header>
        <nav className="flex flex-row justify-around">
          <button className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md">
            {" "}
            Cryptocurrencies{" "}
          </button>
          <button className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md">
            {" "}
            NFTs{" "}
          </button>
          <button className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md">
            {" "}
            Derivatives{" "}
          </button>
        </nav>
      </div>
      <div>
        <DataTable columns={props.columns} data={props.data} />
      </div>
    </>
  );
};

export const ParentListComponent = (props: any) => {
  return (
    <div>
      <DataTable columns={props.listcolumns} data={props.listdata} />
    </div>
  );
};
