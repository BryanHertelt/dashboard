"use client";

import {
  assetGroupPieChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";
import {
  AssetHoldings,
  DistributionHolding,
  Holding,
} from "../types/data-fetching-types";
import { useState, useMemo, useEffect } from "react";
import { useDistributionData, useHoldingMutation } from "../data-fetching";
import { getDistribution } from "../data-fetching";
import { DistributionChart } from "../charts";
import { SmallLoadingSkeleton } from "../data-fetching";
import { dataColsGroups, AssetTableComponent } from "../data-table";
import { ranHexGen } from "../helpers";
import { dataColsHoldings } from "../data-table/v-ad-cols/holding-cols";
import { useSyncSingleHolding } from "../stores";
import { useQueryClient } from "@tanstack/react-query";

const HoldingDistributionComponent = ({
  holdingData,
}: {
  holdingData: any;
}) => {
  const thresholdValue = 5;
  const setSyncStatus = useSyncSingleHolding((state) => state.setSyncStatus);
  const syncStatus = useSyncSingleHolding((state) => state.syncStatus);
  const queryClient = useQueryClient();

  const { processedQueryData, isLoading, isError, error } = useDistributionData(
    {
      qKey: ["PortfolioAD", "Holdings"],
      initialData: holdingData,
      queryFunction: getDistribution,
      distributionScope: "holding",
      slug: "portfolios",
      staleTime: 0,
      cacheTime: 0,
    }
  );

  // Generate colors based on holdings count
  const colors = useMemo(() => {
    const holdingsCount =
      processedQueryData?.holdings?.length || thresholdValue;
    return ranHexGen(Math.max(holdingsCount, thresholdValue));
  }, [processedQueryData?.holdings, thresholdValue]);

  // Initialize syncStatus
  useEffect(() => {
    if (!processedQueryData?.holdings?.length) return;
    setSyncStatus((prev) => {
      const existingIds = new Set(prev.map((item) => item.holdingId));
      const newSyncObjects = processedQueryData.holdings
        .filter((holding: Holding) => !existingIds.has(holding.holdingid))
        .map((holding: Holding) => ({
          holdingId: holding.holdingid,
          status: "noSync",
        }));
      return [...prev, ...newSyncObjects];
    });
  }, [processedQueryData?.holdings, setSyncStatus]);

  // Handle loading state
  if (isLoading) {
    return <SmallLoadingSkeleton />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Error loading data: {error?.message || "Unknown error"}
      </div>
    );
  }

  console.log("This is the sync status ", syncStatus);

  // Handle missing data
  if (!processedQueryData || !processedQueryData.holdings) {
    return (
      <>
        <div className="flex flex-col text-end justify-center card h-56 mb-7 w-8/12 sm:w-8/12 md:w-full lg:w-full lp:w-full"></div>

        <div className="card p-7 w-full h-5/6" />
      </>
    );
  }

  // Map holdings to frontend naming
  const dataFrontendNaming = processedQueryData.holdings?.length
    ? processedQueryData.holdings.map((holding: Holding) => ({
        holdingid: holding.holdingid,
        portfolioid: holding.portfolioid,
        userid: holding.userid,
        holdingname: holding.holdingname,
        assetcount: holding.assetcount,
        holdingvalue: holding.holdingvalue,
        holdingpercentage: holding.holdingpercentage,
        holdingchange24h: holding.holdingchange24h,
        holdingchange24hvalue: holding.holdingchange24hvalue,
        holdingchange7d: holding.holdingchange7d,
        profitloss: holding.profitloss,
        profitlosschange: holding.profitlosschange,
        symbol: holding.symbol,
        custom: holding.custom,
        description: holding.description,
      }))
    : [];

  // Add colors and distribution percentage
  const updatedData = dataFrontendNaming.map(
    (holding: DistributionHolding, index: number) => ({
      ...holding,
      color: colors[index] || "#000000",
      distribution:
        processedQueryData.currentvalue > 0
          ? Number(holding.holdingvalue / processedQueryData.currentvalue) * 100
          : 0,
    })
  );

  // Pie chart configuration
  const pieConfig = {
    pieData: updatedData.map((holding: DistributionHolding) => ({
      disElId: holding.holdingid,
      disElVal: holding.holdingvalue,
      disElName: holding.holdingname,
      disElDistribution: holding.distribution,
      disColor: holding.color,
    })),
    full: false,
    tresholdValue: thresholdValue,
    total: processedQueryData.currentvalue,
    others: "Other Holdings",
  };

  // Table configuration
  const tableConfig = {
    initial: updatedData,
    detail: false,
    statusFilter: "",
    status: [
      {
        status: "holdings",
        statusTitle: "Asset Holdings",
        columns: dataColsHoldings,
      },
    ],
    filter: [],
    currentValue: processedQueryData.currentvalue,
  };

  return (
    <div className="h-full">
      <div className="flex flex-col text-end justify-center card h-56 mb-7 w-8/12 sm:w-8/12 md:w-full lg:w-full lp:w-full">
        <div className="flex flex-col items-center justify-center h-96 w-full">
          <div className="w-96 h-96">
            <DistributionChart config={pieConfig} />
          </div>
        </div>
      </div>
      <div className="w-8/12 sm:w-8/12 md:w-full lg:w-full lp:w-full h-1/5 mb-10 card">
        <AssetTableComponent config={tableConfig} />
      </div>
    </div>
  );
};

export default HoldingDistributionComponent;
