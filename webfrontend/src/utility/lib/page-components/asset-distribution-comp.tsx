"use client";
import AssetValueChartComponent from "../build-components/value-chart-comp";
import DistributionComponent from "../build-components/distribution-component";
import AssetTableComponent from "../build-components/asset-table-component";
import { useDistributionData } from "../datafetching/client-refetch/client-hooks";
import { getPortfolioData } from "../datafetching/layer";
import { formatValue } from "../helpers/helper-functions";
import { useEffect } from "react";
import {
  dataColsCurrency,
  dataColsDerivative,
  dataColsNft,
} from "../design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import logger from "../logging/logger";
import { trace, context } from "@opentelemetry/api";

const AssetDistributionComponent = (props: any) => {
  useEffect(() => {
    const startTime = performance.now();
    logger.info({ event: "page_load_start", page: "asset_distribution" });
    return () => {
      const loadTime = performance.now() - startTime;
      logger.info({
        event: "page_load_complete",
        page: "asset_distribution",
        load_time_ms: loadTime,
      });
    };
  }, []);
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
    title: "Assets",
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

  useEffect(() => {
    if (isLoading) {
      logger.info({ event: "data_fetch_start", query: "PortfolioAD" });
    }
    if (isError) {
      const tracer = trace.getTracer("asset-distribution-tracer");
      tracer.startActiveSpan("fetch-portfolio-data", (span) => {
        logger.error({
          event: "data_fetch_error",
          query: "PortfolioAD",
          error: error?.message || "Unknown error",
        });
        span.setAttribute("error", true);
        span.setAttribute("error.message", error?.message || "Unknown error");
        span.end();
      });
    }
    if (processedQueryData && !isLoading && !isError) {
      const tracer = trace.getTracer("asset-distribution-tracer");
      tracer.startActiveSpan("fetch-portfolio-data", (span) => {
        logger.info({
          event: "data_fetch_success",
          query: "PortfolioAD",
          asset_count: processedQueryData.assets.length,
        });
        span.setAttribute("asset_count", processedQueryData.assets.length);
        span.end();
      });
    }
  }, [isLoading, isError, error, processedQueryData]);

  return (
    <div className="h-full">
      {/**
      <div className="card h-4/6 w-8/12 flex-grow pl-7 pt-7 pr-8">
        <AssetValueChartComponent
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
