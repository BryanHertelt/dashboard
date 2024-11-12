"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CryptoCurrencyResponseObject } from "@/api/distribution/asset-distributiontabledata";

export const assetdistributioncolumns: ColumnDef<CryptoCurrencyResponseObject>[] =
  [
    {
      accessorKey: "assetname",
      header: "Asset",
    },
    {
      accessorKey: "assetamount",
      header: "Amount",
    },
    {
      accessorKey: "assetpercentage",
      header: "Percentage",
    },
    {
      accessorKey: "assetvalue",
      header: "Value",
    },
    {
      accessorKey: "assetmarketprice",
      header: "Market Price",
    },
    {
      accessorKey: "assetchange24h",
      header: "Change 24h",
    },
    {
      accessorKey: "assetchange7d",
      header: "Change 7D",
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
  ];
