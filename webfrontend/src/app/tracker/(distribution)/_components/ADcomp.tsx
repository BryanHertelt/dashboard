"use client";
import AssetValueChartComponent from "../_components/assetvaluechartcomponent";
import DistributionComponent from "../_components/distributioncomp";
import DetailTableComponent from "../_components/tabledetailcomp";
import useDistributionData from "@/utility/lib/distribution/hooks/distributionHook";

import {
  assetLineChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";
import { ADcompPropsType } from "@/utility/lib/distribution/types";

const AssetDistributionComponent = (props: any) => {
  const { processedQueryData } = useDistributionData([
    {
      qKey: ["PortfolioAD"],
      initialData: props.portfolioResponse,
      slug: "portfolios",
      searchquery: "portfolioid=1",
      staleTime: 5 * 1000,
      cacheTime: 0,
    },
    {
      qKey: ["AssetAD", "cryptocurrency"],
      initialData: props.assetResponse,
      slug: "assets",
      searchquery: "assettype=cryptocurrency",
      //staleTime: 0, building feature-> need to refresh data, set to value regarding caching strategy at build time
      staleTime: 5 * 1000,
      cacheTime: 5 * 1000,
    },
  ]);
  return (
    <>
      <div className="card h-4/6 w-8/12 flex-grow pl-7 py-7 pr-8">
        <AssetValueChartComponent
          data={assetLineChartData}
          portfolioResponse={processedQueryData[0].data}
        />
      </div>
      <div className="card p-7 h-4/6 ml-7 w-3/12">
        <DistributionComponent
          text={"You can see your Asset Distribution here."}
          title={"Asset Distribution"}
          piedata={processedQueryData[1].data}
          pieoptions={pieChartOptions}
        />
      </div>
      <div className="card mt-9 p-7 w-full">
        <DetailTableComponent initial={processedQueryData[1].data} />
      </div>
    </>
  );
};

export default AssetDistributionComponent;
