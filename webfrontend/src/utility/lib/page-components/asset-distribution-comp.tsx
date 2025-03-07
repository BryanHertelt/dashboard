"use client";
import AssetValueChartComponent from "../build-components/overall-value-component";
import DistributionComponent from "../build-components/distribution-component";
import TableComponent from "../build-components/data-table-component";
import useDistributionData from "../datafetching/client-refetch/distribution-hook";
import { useEffect } from "react";

import {
  assetLineChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";

const AssetDistributionComponent = (props: any) => {
  const { processedQueryData } = useDistributionData([
    {
      qKey: ["PortfolioAD"],
      initialData: props.portfolioData,
      slug: "portfolios",
      staleTime: 0,
      cacheTime: 0,
    },
  ]);

  const tableData = processedQueryData[0].data.assets;

  return (
    <>
      <div className="card h-4/6 w-8/12 flex-grow pl-7 py-7 pr-8">
        {/*   <AssetValueChartComponent
          data={assetLineChartData}
           portfolioResponse={processedQueryData[0].data}
        /> */}
      </div>
      <div className="card p-7 h-4/6 ml-7 w-3/12">
        {/*
        <DistributionComponent
          text={"You can see your Asset Distribution here."}
          title={"Asset Distribution"}
          piedata={processedQueryData[0].data}
          pieoptions={pieChartOptions}
        />
        */}
      </div>
      <div className="card mt-9 p-7 w-full">
        <TableComponent initial={tableData} />
      </div>
    </>
  );
};

export default AssetDistributionComponent;
