"use client";
import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/utility/lib/design-components/datatables/table-layout/data-table";
import AssetTableController from "@/utility/lib/build-components/asset-table-controller";
import LoadingSkeleton from "../loading";
import { useQueryClient } from "@tanstack/react-query";

const initialData = [
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 1,
    assettype: "cryptocurrency",
    assetid: 1,
    assetname: "Bitcoin",
    assetabbreviation: "BTC",
    assetamount: 300000000000,
    assetvalue: 70000,
    assetmarketprice: 1400000,
    assetchange24h: 5,
    assetchange24hourvalue: 100,
    assetchange7d: [680000, 690000, 710000, 695000, 700000],
    notes: "Notes",
  },
  {
    symbol: "B",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 7,
    assetpercentage: 3,
    assettype: "nft",
    assetid: 568,
    assetname: "Pudgy Penguins",
    collectionvalue: 450,
    collectionfloorprice: 400,
    nftcount: 10,
    notes: "Notes",
  },
  {
    symbol: "C",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 7,
    assetpercentage: 3,
    assettype: "derivative",
    assetid: 12,
    assetname: "BTCUSDT",
    derivateexchange: "Bybit",
    positiontype: "open",
    tradedirection: "long",
    derivativetype: "future",
    leverage: 5,
    size: 15000,
    entry: 30000,
    unrealizedpl: 2500,
    price: 32000,
    liquidationprice: 25000,
    margin: 100,
    tp: 3,
    sl: 29,
    settlementdate: "2024-06-15T10:00:00.000Z",
    notes: "Notes",
  },
];

export default function BuilderPage() {
  const currentValue = 5000;

  const tableConfig = {
    title: "Assets",
    initial: initialData,
    currentValue: currentValue,
    status: [
      {
        status: "cryptocurrency",
        statusTitle: "Cryptocurrencies",
      },
      {
        status: "nft",
        statusTitle: "NFTs",
      },
      {
        status: "derivative",
        statusTitle: "Derivatives",
      },
    ],
    filter: [
      {
        filter: "perp",
        filterTitle: "Perpetual",
        filterStatus: "derivative",
      },
      {
        filter: "future",
        filterTitle: "Future",
        filterStatus: "derivative",
      },
    ],
  };
  return (
    <div className="mt-9 border border-none w-full mb-10 h-5/6">
      <AssetTableComponent config={tableConfig} />
    </div>
  );
}

const AssetTableComponent = ({
  config,
}: {
  config: {
    title: string;
    initial: any;
    currentValue: number;
    status: { status: string; statusTitle: string }[];
    filter: { filter: string; filterTitle: string; filterStatus: string }[];
  };
}) => {
  const [tableStatus, setTableStatus] = useState<string>("cryptocurrency");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filterObject: Record<string, boolean> = config.filter.reduce(
    (acc, curr) => {
      acc[curr.filter] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );
  console.log("filterObject", filterObject);
  const [filter, setFilter] = useState<any>(filterObject);

  const StatusButton = ({
    status,
    label,
  }: {
    status: string;
    label: string;
  }) => (
    <button
      onClick={() => {
        setTableStatus(status);
        setExpandedRow(null);
      }}
      className={`relative px-3 text-base h-full text-black rounded-md `}
    >
      {label}
    </button>
  );

  const FilterButtons = () => {
    const keys = Object.keys(filter);

    return (
      <>
        {config.filter.map(({ filter: key, filterTitle, filterStatus }) => {
          if (filterStatus === tableStatus) {
            const otherKeys = config.filter
              .filter(({ filterStatus: status }) => status === tableStatus)
              .map(({ filter }) => filter)
              .filter((k) => k !== key);

            const otherActive = otherKeys.some((k) => filter[k]);

            return (
              <button
                key={key}
                className={`${
                  filter[key]
                    ? "border-2 px-2 border-icongray"
                    : "px-2 border-2 border-white"
                } flex mr-3 items-center justify-center rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setFilter((prevState: any) => ({
                    ...prevState,
                    [key]: !prevState[key],
                  }));
                }}
                disabled={!(otherActive || !filter[key])}
              >
                {filterTitle}
              </button>
            );
          } else {
            return null;
          }
        })}
      </>
    );
  };

  return (
    <div className="card pt-5">
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className=" flex flex-row justify-center h-full items-center text-1xl font-normal px-7">
            {config.title}
          </h1>
        </header>
        <nav className="flex flex-row px-7">
          <div className="flex flex-row justify-center items-center mr-2 w-full">
            <FilterButtons />
          </div>
          <div className=" relative flex flex-row bg-gray rounded-md">
            {config.status.map((statusConfig) => {
              return (
                <div key={statusConfig.status}>
                  <StatusButton
                    status={statusConfig.status}
                    label={statusConfig.statusTitle}
                  />
                </div>
              );
            })}
          </div>
        </nav>
      </div>
      <AssetTableController
        initial={config.initial}
        currentValue={config.currentValue}
        tableStatus={tableStatus}
        derivativeType={filter}
      />
    </div>
  );
};
