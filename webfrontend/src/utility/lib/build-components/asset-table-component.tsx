"use client";
import { DataTable } from "@/utility/lib/design-components/datatables/table-layout/data-table";
import {
  formatDataColsCurrency,
  formatDataColsNft,
  formatDataColsDerivative,
} from "@/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { LoadingSkeleton } from "../datafetching/loading-skeleton";

type TableStatus = "nft" | "cryptocurrency" | "derivative";

const AssetTableComponent = ({
  initial,
  currentValue,
}: {
  initial: any[];
  currentValue: number;
}) => {
  const [tableStatus, setTableStatus] = useState<TableStatus>("cryptocurrency");
  const [tableData, setTableData] = useState(initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [derivativeType, setDerivativeType] = useState<any>({
    perp: false,
    future: false,
  });
  const queryClient = useQueryClient();

  const getFilteredData = (status: TableStatus) => {
    const tableOptions = {
      nft: {
        data: initial.filter((asset) => asset.assettype === "nft"),
        format: formatDataColsNft,
      },
      cryptocurrency: {
        data: initial.filter((asset) => asset.assettype === "cryptocurrency"),
        format: formatDataColsCurrency,
      },
      derivative: {
        data: initial.filter((asset) => {
          if (derivativeType.perp === true && derivativeType.future === true) {
            return asset.assettype === "derivative";
          } else if (
            derivativeType.perp === true &&
            derivativeType.future === false
          ) {
            return (
              asset.assettype === "derivative" &&
              asset.derivativetype === "perpetual"
            );
          } else if (
            derivativeType.perp === false &&
            derivativeType.future === true
          ) {
            return (
              asset.assettype === "derivative" &&
              asset.derivativetype === "future"
            );
          } else {
            return asset.assettype === "derivative";
          }
        }),
        format: formatDataColsDerivative,
      },
    };
    return tableOptions[status];
  };

  useEffect(() => {
    const { data } = getFilteredData(tableStatus);
    setTableData(data);
  }, [tableStatus, derivativeType]);

  const col = useMemo(() => {
    const { data, format } = getFilteredData(tableStatus);
    return format(data, queryClient, setExpandedRow);
  }, [tableStatus]);

  const getButtonClass = (status: string) =>
    tableStatus === status ? "bg-blue text-white" : "text-black";

  const StatusButton = ({
    status,
    label,
  }: {
    status: TableStatus;
    label: string;
  }) => (
    <button
      onClick={() => {
        setTableStatus(status);
        setExpandedRow(null);
      }}
      className={` px-3 text-base h-full transition-all duration-500 ease-in-out ${getButtonClass(
        status
      )} rounded-md `}
    >
      {label}
    </button>
  );

  const realStatus = tableData.map((asset) => asset.assettype);

  for (let i = 0; i < tableData.length; i++) {
    if (tableStatus != realStatus[i]) {
      return <LoadingSkeleton />;
    }
  }

  return (
    <div className="card pt-5">
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className=" flex flex-row justify-cente h-full items-center text-1xl font-normal px-7">
            {" "}
            Assets{" "}
          </h1>
        </header>
        <nav className="flex flex-row px-7">
          {tableStatus === "derivative" ? (
            <div className="flex flex-row justify-center items-center mr-5 w-40">
              <button
                className={`${
                  derivativeType.perp === true
                    ? "border-2 px-2 border-black"
                    : "px-2 border-2 border-white"
                } flex mr-3 items-center justify-center`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: !prevState.perp,
                      future: prevState.future,
                    };
                  });
                }}
              >
                {" "}
                Perpetual{" "}
              </button>
              <button
                className={`${
                  derivativeType.future === true
                    ? "border-2 px-2 border-black"
                    : "px-2 w-20 border-2 border-white "
                }`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: prevState.perp,
                      future: !prevState.future,
                    };
                  });
                }}
              >
                {" "}
                Future{" "}
              </button>
            </div>
          ) : null}
          <div className=" flex flex-row bg-gray rounded-md">
            <StatusButton status="cryptocurrency" label="Cryptocurrencies" />
            <StatusButton status="nft" label="NFTs" />
            <StatusButton status="derivative" label="Derivatives" />
          </div>
        </nav>
      </div>
      <div className="shadow-flyzerShadow rounded-md ">
        <DataTable
          data={tableData}
          columns={col}
          expandedRow={expandedRow}
          tableStatus={tableStatus}
          currentValue={currentValue}
        />
      </div>
    </div>
  );
};

export default AssetTableComponent;

/**
 * {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 3,
          "assettype": "cryptocurrency",
          "assetid": 3,
          "assetname": "Binance Coin",
          "assetabbreviation": "BNB",
          "assetamount": 15,
          "assetvalue": 20000,
          "assetmarketprice": 13333,
          "assetchange24h": 3,
          "assetchange24hourvalue": 6000,
          "assetchange7d": [198000, 195000, 199000, 201000, 200000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 4,
          "assettype": "cryptocurrency",
          "assetid": 4,
          "assetname": "Cardano",
          "assetabbreviation": "ADA",
          "assetamount": 5000,
          "assetvalue": 16000,
          "assetmarketprice": 32,
          "assetchange24h": 2,
          "assetchange24hourvalue": 3200,
          "assetchange7d": [158000, 157000, 159000, 161000, 160000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 5,
          "assettype": "cryptocurrency",
          "assetid": 5,
          "assetname": "Ripple",
          "assetabbreviation": "XRP",
          "assetamount": 10000,
          "assetvalue": 14000,
          "assetmarketprice": 14,
          "assetchange24h": 4,
          "assetchange24hourvalue": 5600,
          "assetchange7d": [138000, 139000, 140000, 141000, 140000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 6,
          "assettype": "cryptocurrency",
          "assetid": 6,
          "assetname": "Solana",
          "assetabbreviation": "SOL",
          "assetamount": 300,
          "assetvalue": 10000,
          "assetmarketprice": 333,
          "assetchange24h": -6,
          "assetchange24hourvalue": -6000,
          "assetchange7d": [99000, 99500, 100500, 105000, 100000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 7,
          "assettype": "cryptocurrency",
          "assetid": 7,
          "assetname": "Polkadot",
          "assetabbreviation": "DOT",
          "assetamount": 1000,
          "assetvalue": 8000,
          "assetmarketprice": 80,
          "assetchange24h": 3,
          "assetchange24hourvalue": 2400,
          "assetchange7d": [79000, 79500, 80500, 80000, 80000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 8,
          "assettype": "cryptocurrency",
          "assetid": 8,
          "assetname": "Avalanche",
          "assetabbreviation": "AVAX",
          "assetamount": 600,
          "assetvalue": 6000,
          "assetmarketprice": 100,
          "assetchange24h": 1,
          "assetchange24hourvalue": 600,
          "assetchange7d": [59000, 59500, 60500, 60000, 60000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 9,
          "assettype": "cryptocurrency",
          "assetid": 9,
          "assetname": "Dogecoin",
          "assetabbreviation": "DOGE",
          "assetamount": 30000,
          "assetvalue": 4000,
          "assetmarketprice": 1.33,
          "assetchange24h": 8,
          "assetchange24hourvalue": 3200,
          "assetchange7d": [39000, 39500, 40500, 40000, 40000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 10,
          "assettype": "cryptocurrency",
          "assetid": 10,
          "assetname": "Litecoin",
          "assetabbreviation": "LTC",
          "assetamount": 200,
          "assetvalue": 4000,
          "assetmarketprice": 200,
          "assetchange24h": 5,
          "assetchange24hourvalue": 2000,
          "assetchange7d": [39500, 39800, 40200, 40000, 40000],
          "notes": "Notes"
        }, 
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 12,
        "assetname": "BTCUSDT",
        "derivateexchange":"Bybit" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "future",
        "leverage": 5,
        "size": 15000,
        "entry": 30000,
        "unrealizedpl": 2500,
        "price": 32000,
        "liquidationprice": 25000,
        "margin": 100,
        "tp": 3,
        "sl": 29,
        "settlementdate": "2024-06-15T10:00:00.000Z",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 13,
        "assetname": "ETHUSDT",
        "derivateexchange":"Binance" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "perpetual",
        "leverage": 10,
        "size": 10000,
        "entry": 2000,
        "unrealizedpl": -500,
        "price": 1900,
        "liquidationprice": 1800,
        "margin": 50,
        "tp": 21,
        "sl": 18.5,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 15,
        "assetname": "XRPUSDT",
        "derivateexchange":"Bitmex" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "perpetual",
        "leverage": 8,
        "size": 20000,
        "entry": 0.5,
        "unrealizedpl": 400,
        "price": 0.52,
        "liquidationprice": 0.4,
        "margin": 50,
        "tp": null,
        "sl": 0.45,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 16,
        "assetname": "DOGEUSDT",
        "derivateexchange":"Binance" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "future",
        "leverage": 20,
        "size": 30000,
        "entry": 0.07,
        "unrealizedpl": -600,
        "price": 0.065,
        "liquidationprice": 0.05,
        "margin": 30,
        "tp": 0.09,
        "sl": 0.06,
        "settlementdate": "2024-12-31T10:00:00.000Z",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 18,
        "assetname": "LTCUSDT",
        "derivateexchange":"Bybit" ,
        "positiontype": "open",
        "tradedirection": "short", 
        "derivativetype": "perpetual",
        "leverage": 15,
        "size": 5000,
        "entry": 100,
        "unrealizedpl": -250,
        "price": 95,
        "liquidationprice": 85,
        "margin": 35,
        "tp": 10,
        "sl": null,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 19,
        "assetname": "BNBUSDT",
        "derivateexchange":"Binance" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "future",
        "leverage": 10,
        "size": 2000,
        "entry": 300,
        "unrealizedpl": 500,
        "price": 325,
        "liquidationprice": 250,
        "margin": 25,
        "tp": 35,
        "sl": 25,
        "settlementdate": "2024-07-01T08:00:00.000Z",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 21,
        "assetname": "MATICUSDT",
        "derivateexchange":"Bitget" ,
        "positiontype": "open",
        "tradedirection": "short", 
        "derivativetype": "perpetual",
        "leverage": 7,
        "size": 15000,
        "entry": 0.9,
        "unrealizedpl": 150,
        "price": 0.95,
        "liquidationprice": 0.7,
        "margin": 50,
        "tp": 1.2,
        "sl": 0.85,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 312,
        "assetname": "Bored Ape Yacht Club",
        "collectionvalue": 1200,
        "collectionfloorprice": 1000,
        "nftcount": 20,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 425,
        "assetname": "Mutant Ape Yacht Club",
        "collectionvalue": 850,
        "collectionfloorprice": 750,
        "nftcount": 15,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 568,
        "assetname": "Pudgy Penguins",
        "collectionvalue": 450,
        "collectionfloorprice": 400,
        "nftcount": 10,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 678,
        "assetname": "Cool Cats NFT",
        "collectionvalue": 700,
        "collectionfloorprice": 650,
        "nftcount": 18,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 789,
        "assetname": "Doodles",
        "collectionvalue": 950,
        "collectionfloorprice": 900,
        "nftcount": 12,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 895,
        "assetname": "World of Women",
        "collectionvalue": 400,
        "collectionfloorprice": 350,
        "nftcount": 7,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 943,
        "assetname": "Azuki",
        "collectionvalue": 1000,
        "collectionfloorprice": 950,
        "nftcount": 25,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 1012,
        "assetname": "CloneX",
        "collectionvalue": 800,
        "collectionfloorprice": 750,
        "nftcount": 17,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 1113,
        "assetname": "CryptoPunks",
        "collectionvalue": 5000,
        "collectionfloorprice": 4800,
        "nftcount": 5,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 30,
        "assettype": "nft",
        "assetid": 1215,
        "assetname": "Moonbirds",
        "collectionvalue": 1200,
        "collectionfloorprice": 1100,
        "nftcount": 9,
        "notes": "Notes"
      },
       {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 1,
          "assettype": "cryptocurrency",
          "assetid": 1,
          "assetname": "Bitcoin",
          "assetabbreviation": "BTC",
          "assetamount": 0.5,
          "assetvalue": 70000,
          "assetmarketprice": 1400000,
          "assetchange24h": 5,
          "assetchange24hourvalue": 35000,
          "assetchange7d": [680000, 690000, 710000, 695000, 700000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 2,
          "assettype": "cryptocurrency",
          "assetid": 2,
          "assetname": "Ethereum",
          "assetabbreviation": "ETH",
          "assetamount": 10,
          "assetvalue": 4000,
          "assetmarketprice": 46000,
          "assetchange24h": 7,
          "assetchange24hourvalue": 32200,
          "assetchange7d": [455000, 450000, 457000, 463000, 460000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 3,
          "assettype": "cryptocurrency",
          "assetid": 3,
          "assetname": "Binance Coin",
          "assetabbreviation": "BNB",
          "assetamount": 15,
          "assetvalue": 20000,
          "assetmarketprice": 13333,
          "assetchange24h": 3,
          "assetchange24hourvalue": 6000,
          "assetchange7d": [198000, 195000, 199000, 201000, 200000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 4,
          "assettype": "cryptocurrency",
          "assetid": 4,
          "assetname": "Cardano",
          "assetabbreviation": "ADA",
          "assetamount": 5000,
          "assetvalue": 16000,
          "assetmarketprice": 32,
          "assetchange24h": 2,
          "assetchange24hourvalue": 3200,
          "assetchange7d": [158000, 157000, 159000, 161000, 160000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 5,
          "assettype": "cryptocurrency",
          "assetid": 5,
          "assetname": "Ripple",
          "assetabbreviation": "XRP",
          "assetamount": 10000,
          "assetvalue": 14000,
          "assetmarketprice": 14,
          "assetchange24h": 4,
          "assetchange24hourvalue": 5600,
          "assetchange7d": [138000, 139000, 140000, 141000, 140000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 6,
          "assettype": "cryptocurrency",
          "assetid": 6,
          "assetname": "Solana",
          "assetabbreviation": "SOL",
          "assetamount": 300,
          "assetvalue": 10000,
          "assetmarketprice": 333,
          "assetchange24h": -6,
          "assetchange24hourvalue": -6000,
          "assetchange7d": [99000, 99500, 100500, 105000, 100000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 7,
          "assettype": "cryptocurrency",
          "assetid": 7,
          "assetname": "Polkadot",
          "assetabbreviation": "DOT",
          "assetamount": 1000,
          "assetvalue": 8000,
          "assetmarketprice": 80,
          "assetchange24h": 3,
          "assetchange24hourvalue": 2400,
          "assetchange7d": [79000, 79500, 80500, 80000, 80000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 8,
          "assettype": "cryptocurrency",
          "assetid": 8,
          "assetname": "Avalanche",
          "assetabbreviation": "AVAX",
          "assetamount": 600,
          "assetvalue": 6000,
          "assetmarketprice": 100,
          "assetchange24h": 1,
          "assetchange24hourvalue": 600,
          "assetchange7d": [59000, 59500, 60500, 60000, 60000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 9,
          "assettype": "cryptocurrency",
          "assetid": 9,
          "assetname": "Dogecoin",
          "assetabbreviation": "DOGE",
          "assetamount": 30000,
          "assetvalue": 4000,
          "assetmarketprice": 1.33,
          "assetchange24h": 8,
          "assetchange24hourvalue": 3200,
          "assetchange7d": [39000, 39500, 40500, 40000, 40000],
          "notes": "Notes"
      },
      {
          "symbol": "A",
          "portfolioid": 1,
          "userid": 1,
          "groupid": 1,
          "holdingid": 10,
          "assettype": "cryptocurrency",
          "assetid": 10,
          "assetname": "Litecoin",
          "assetabbreviation": "LTC",
          "assetamount": 200,
          "assetvalue": 4000,
          "assetmarketprice": 200,
          "assetchange24h": 5,
          "assetchange24hourvalue": 2000,
          "assetchange7d": [39500, 39800, 40200, 40000, 40000],
          "notes": "Notes"
        }, 
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 12,
        "assetname": "BTCUSDT",
        "derivateexchange":"Bybit" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "future",
        "leverage": 5,
        "size": 15000,
        "entry": 30000,
        "unrealizedpl": 2500,
        "price": 32000,
        "liquidationprice": 25000,
        "margin": 100,
        "tp": 3,
        "sl": 29,
        "settlementdate": "2024-06-15T10:00:00.000Z",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 13,
        "assetname": "ETHUSDT",
        "derivateexchange":"Binance" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "perpetual",
        "leverage": 10,
        "size": 10000,
        "entry": 2000,
        "unrealizedpl": -500,
        "price": 1900,
        "liquidationprice": 1800,
        "margin": 50,
        "tp": 21,
        "sl": 18.5,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 15,
        "assetname": "XRPUSDT",
        "derivateexchange":"Bitmex" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "perpetual",
        "leverage": 8,
        "size": 20000,
        "entry": 0.5,
        "unrealizedpl": 400,
        "price": 0.52,
        "liquidationprice": 0.4,
        "margin": 50,
        "tp": null,
        "sl": 0.45,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 16,
        "assetname": "DOGEUSDT",
        "derivateexchange":"Binance" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "future",
        "leverage": 20,
        "size": 30000,
        "entry": 0.07,
        "unrealizedpl": -600,
        "price": 0.065,
        "liquidationprice": 0.05,
        "margin": 30,
        "tp": 0.09,
        "sl": 0.06,
        "settlementdate": "2024-12-31T10:00:00.000Z",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 18,
        "assetname": "LTCUSDT",
        "derivateexchange":"Bybit" ,
        "positiontype": "open",
        "tradedirection": "short", 
        "derivativetype": "perpetual",
        "leverage": 15,
        "size": 5000,
        "entry": 100,
        "unrealizedpl": -250,
        "price": 95,
        "liquidationprice": 85,
        "margin": 35,
        "tp": 10,
        "sl": null,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 19,
        "assetname": "BNBUSDT",
        "derivateexchange":"Binance" ,
        "positiontype": "open",
        "tradedirection": "long", 
        "derivativetype": "future",
        "leverage": 10,
        "size": 2000,
        "entry": 300,
        "unrealizedpl": 500,
        "price": 325,
        "liquidationprice": 250,
        "margin": 25,
        "tp": 35,
        "sl": 25,
        "settlementdate": "2024-07-01T08:00:00.000Z",
         "notes": "Notes"
      },
      {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 21,
        "assetname": "MATICUSDT",
        "derivateexchange":"Bitget" ,
        "positiontype": "open",
        "tradedirection": "short", 
        "derivativetype": "perpetual",
        "leverage": 7,
        "size": 15000,
        "entry": 0.9,
        "unrealizedpl": 150,
        "price": 0.95,
        "liquidationprice": 0.7,
        "margin": 50,
        "tp": 1.2,
        "sl": 0.85,
        "settlementdate": "",
         "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 312,
        "assetname": "Bored Ape Yacht Club",
        "collectionvalue": 1200,
        "collectionfloorprice": 1000,
        "nftcount": 20,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 425,
        "assetname": "Mutant Ape Yacht Club",
        "collectionvalue": 850,
        "collectionfloorprice": 750,
        "nftcount": 15,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 568,
        "assetname": "Pudgy Penguins",
        "collectionvalue": 450,
        "collectionfloorprice": 400,
        "nftcount": 10,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 678,
        "assetname": "Cool Cats NFT",
        "collectionvalue": 700,
        "collectionfloorprice": 650,
        "nftcount": 18,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 789,
        "assetname": "Doodles",
        "collectionvalue": 950,
        "collectionfloorprice": 900,
        "nftcount": 12,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 895,
        "assetname": "World of Women",
        "collectionvalue": 400,
        "collectionfloorprice": 350,
        "nftcount": 7,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 943,
        "assetname": "Azuki",
        "collectionvalue": 1000,
        "collectionfloorprice": 950,
        "nftcount": 25,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 1012,
        "assetname": "CloneX",
        "collectionvalue": 800,
        "collectionfloorprice": 750,
        "nftcount": 17,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "nft",
        "assetid": 1113,
        "assetname": "CryptoPunks",
        "collectionvalue": 5000,
        "collectionfloorprice": 4800,
        "nftcount": 5,
        "notes": "Notes"
      },
      {
        "symbol": "B",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 30,
        "assettype": "nft",
        "assetid": 1215,
        "assetname": "Moonbirds",
        "collectionvalue": 1200,
        "collectionfloorprice": 1100,
        "nftcount": 9,
        "notes": "Notes"
      }
 */
