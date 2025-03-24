"use client";
import AssetValueChartComponent from "../build-components/value-chart-comp";
import DistributionComponent from "../build-components/distribution-component";
import AssetTableComponent from "../build-components/asset-table-component";
import { useDistributionData } from "../datafetching/client-refetch/client-hooks";
import { getPortfolioData } from "../datafetching/layer";
import { CryptocurrencyDataInterface } from "../types/data-fetching-types";

const AssetDistributionComponent = (props: any) => {
  const { processedQueryData, isLoading, isError, error } = useDistributionData(
    {
      qKey: ["PortfolioAD"],
      initialData: props.portfolioData,
      queryFunction: getPortfolioData,
      slug: "portfolios",
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const tableData = processedQueryData.assets;
  const pieData = processedQueryData.assets.map((asset: any) => {
    return {
      symbol: asset.symbol,
      assetname: asset.assetname,
      assetvalue:
        asset.assettype === "cryptocurrency"
          ? asset.assetvalue
          : asset.assettype === "derivative"
          ? asset.size
          : asset.collectionvalue,
      distribution: asset.assetpercentage,
    };
  });

  return (
    <>
      <div className="card h-4/6 w-8/12 flex-grow pl-7 pt-7 pr-8">
        <AssetValueChartComponent
          currentValue={processedQueryData.currentvalue}
          initialData={props.initialLineLoad}
        />
      </div>
      <div className="card p-7 h-4/6 ml-7 w-3/12">
        <DistributionComponent
          text={"You can see your Asset Distribution here."}
          title={"Asset Distribution"}
          piedata={pieData}
        />
      </div>
      <div className="card mt-9 px-7 pt-5 w-full h-5/6 mb-10">
        <AssetTableComponent initial={tableData} />
      </div>
      <div className="border border-backgroundchild w-full"> </div>
    </>
  );
};

export default AssetDistributionComponent;
