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

const AssetGroupDistributionComponent = ({
  groupData,
}: {
  groupData: AssetGroups;
}) => {
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

  console.log(
    "processed Wuery data in asset group distribution comp",
    processedQueryData
  );

  const dataFrontendNaming = processedQueryData.groups.map((group: Group) => {
    return {
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
      description: group.description,
    };
  });

  const updatedData = dataFrontendNaming
    .flat()
    .map((group: DistributionGroup) => {
      group = {
        ...group,
        distribution:
          Number(group.groupvalue / processedQueryData.currentvalue) * 100,
      };
      return group;
    });

  const pieData = {
    data: updatedData,
    total: processedQueryData.currentvalue,
  };

  return (
    <>
      <div className="flex flex-col text-end justify-center card h-56 mb-7 w-8/12 sm:w-8/12 md:w-full lg:w-full lp:w-full">
        <div className="flex flex-col items-center justify-center h-96 w-full">
          <div className="w-96 h-96">
            <DistributionChart
              pieData={pieData}
              full={false}
              tresholdValue={10}
            />
          </div>
        </div>
      </div>
      {/** 
      <div className="card mt-9 p-7 w-full">
        <DetailTableComponent
          text={"You can see all your cryptocurrencies here."}
          title={"Assets"}
          columns={assetgroupdistributioncolumns}
          data={assetGroupData}
        />
      </div>
      */}
    </>
  );
};
export default AssetGroupDistributionComponent;
