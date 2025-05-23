"use client";
import { LineChartController, DistributionComponent } from "../charts";
import {
  AssetTableComponent,
  dataColsCurrency,
  dataColsDerivative,
  dataColsNft,
} from "../data-table";
import { useDistributionData, getPortfolioData } from "../data-fetching";
import { formatValue } from "../helpers";

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

  const tableData = processedQueryData.assets.map((asset: any) => {
    asset = {
      ...asset,
      assetpercentage:
        asset.assettype === "cryptocurrency"
          ? Number(
              formatValue(
                (asset.assetvalue / processedQueryData.currentvalue) * 100
              )
            )
          : null,
    };
    return asset;
  });

  const pieData = {
    assetData: processedQueryData.assets.map((asset: any) => {
      return {
        symbol: asset.symbol,
        assetname: asset.assetname,
        assetvalue:
          asset.assettype === "cryptocurrency"
            ? asset.assetvalue
            : asset.assettype === "derivative"
            ? asset.size
            : asset.collectionvalue,
      };
    }),
    total: processedQueryData.currentvalue,
  };

  const tableConfig = {
    initial: tableData,
    detail: true,
    statusFilter: "assettype",
    status: [
      {
        status: "cryptocurrency",
        statusTitle: "Currencies",
        columns: dataColsCurrency,
      },
      {
        status: "nft",
        statusTitle: "NFTs",
        columns: dataColsNft,
      },
      {
        status: "derivative",
        statusTitle: "Derivatives",
        columns: dataColsDerivative,
      },
    ],
    filter: [
      {
        filter: "perp",
        filterTitle: "Perpetual",
        filterStatus: "derivative",
      },
      {
        filter: "future",
        filterTitle: "Future",
        filterStatus: "derivative",
      },
    ],
    currentValue: processedQueryData.currentvalue,
  };

  return (
    <div className="h-full">
      {/**
      <div className="card h-4/6 w-8/12 flex-grow pl-7 pt-7 pr-8">
        <LineChartController
          currentValue={processedQueryData.currentvalue}
          initialData={props.initialLineLoad}
        />
      </div>
      <div id="note-overlay"> </div>
      <div className="card p-7 h-4/6 ml-7 w-3/12">
        <DistributionComponent
          text={"You can see your Asset Distribution here."}
          title={"Asset Distribution"}
          piedata={pieData}
        />
      </div>
      */}
      <div className="w-full h-1/5 mb-10 card">
        <AssetTableComponent config={tableConfig} />
      </div>
    </div>
  );
};

export default AssetDistributionComponent;
