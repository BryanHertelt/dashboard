"use client";

import {
  assetGroupPieChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";
import {
  AssetGroups,
  DistributionGroup,
  Group,
} from "../types/data-fetching-types";
import { useDistributionData } from "../data-fetching";
import { getDistribution } from "../data-fetching";
import { DistributionChart } from "../charts";
import { SmallLoadingSkeleton } from "../data-fetching";
import { dataColsGroups, AssetTableComponent } from "../data-table";
import { useMemo } from "react";
import { ranHexGen } from "../helpers";

const AssetGroupDistributionComponent = ({
  groupData,
}: {
  groupData: AssetGroups;
}) => {
  const thresholdValue = 5;
  const colors = useMemo(() => {
    const baseColors = ranHexGen(thresholdValue);
    return baseColors;
  }, [thresholdValue]);
  const { processedQueryData, isLoading, isError, error } = useDistributionData(
    {
      qKey: ["PortfolioAD"],
      initialData: groupData,
      queryFunction: getDistribution,
      distributionScope: "group",
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
    if (processedQueryData && processedQueryData.groups) {
      break;
    }
    attempts++;
  }
  if (!processedQueryData || !processedQueryData.groups) {
    return <div className="p-4">Try to reload the page</div>;
  }

  const dataFrontendNaming = processedQueryData.groups.map((group: Group) => ({
    groupid: group.groupid,
    portfolioid: group.portfolioid,
    userid: group.userid,
    groupname: group.groupname,
    assetcount: group.assetcount,
    groupvalue: group.groupvalue,
    grouppercentage: group.grouppercentage,
    groupchange24h: group.groupchange24h,
    groupchange24hvalue: group.groupchange24hvalue,
    groupchange7d: group.groupchange7d,
    profitloss: group.profitloss,
    profitlosschange: group.profitlosschange,
    description: group.description,
  }));

  const updatedData = dataFrontendNaming.map(
    (group: DistributionGroup, index: number) => ({
      ...group,
      color: colors[index],
      distribution:
        Number(group.groupvalue / processedQueryData.currentvalue) * 100,
    })
  );

  const pieConfig = {
    pieData: updatedData.map((group: DistributionGroup) => ({
      disElId: group.groupid,
      disElVal: group.groupvalue,
      disElName: group.groupname,
      disElDistribution: group.distribution,
      disColor: group.color,
    })),
    full: false,
    tresholdValue: thresholdValue,
    total: processedQueryData.currentvalue,
    others: "Other Groups",
  };

  const tableConfig = {
    initial: updatedData,
    detail: false,
    statusFilter: "",
    status: [
      {
        status: "groups",
        statusTitle: "Asset Groups",
        columns: dataColsGroups,
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

export default AssetGroupDistributionComponent;
