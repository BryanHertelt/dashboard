"use client";
import { useState } from "react";
import AssetTableComponent from "@/utility/lib/build-components/asset-table-component";

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
  return (
    <div className="mt-9 border border-none w-full mb-10 h-5/6">
      <AssetTableComponent initial={initialData} currentValue={currentValue} />
    </div>
  );
}
