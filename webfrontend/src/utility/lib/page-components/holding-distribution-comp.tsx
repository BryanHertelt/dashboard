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
import { useDistributionData } from "../data-fetching";
import { getDistribution } from "../data-fetching";
import { DistributionChart } from "../charts";
import { SmallLoadingSkeleton } from "../data-fetching";
import { dataColsGroups, AssetTableComponent } from "../data-table";
import { useMemo } from "react";
import { ranHexGen } from "../helpers";
import { dataColsHoldings } from "../data-table/v-ad-cols/holding-cols";

const HoldingDistributionComponent = ({
  holdingData,
}: {
  holdingData: any;
}) => {
  const thresholdValue = 5;
  const colors = useMemo(() => {
    const baseColors = ranHexGen(thresholdValue);
    return baseColors;
  }, [thresholdValue]);

  const { processedQueryData, isLoading, isError, error } = useDistributionData(
    {
      qKey: ["PortfolioAD"],
      initialData: holdingData,
      queryFunction: getDistribution,
      distributionScope: "holding",
      slug: "portfolios",
      staleTime: 0,
      cacheTime: 0,
    }
  );

  if (isLoading) {
    return <SmallLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Error loading data: {error?.message || "Unknown error"}
      </div>
    );
  }

  let attempts = 0;
  while (attempts < 3) {
    if (processedQueryData && processedQueryData.holdings) {
      break;
    }
    attempts++;
  }
  if (!processedQueryData || !processedQueryData.holdings) {
    return <div className="p-4">Try to reload the page</div>;
  }

  const dataFrontendNaming = processedQueryData.holdings.map(
    (holding: Holding) => ({
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
    })
  );

  const updatedData = dataFrontendNaming.map(
    (holding: DistributionHolding, index: number) => ({
      ...holding,
      color: colors[index],
      distribution:
        Number(holding.holdingvalue / processedQueryData.currentvalue) * 100,
    })
  );

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
