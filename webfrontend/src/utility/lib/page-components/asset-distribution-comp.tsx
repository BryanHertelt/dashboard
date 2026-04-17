"use client";
import { DistributionChart } from "../charts";
import { Asset, DistributionAsset } from "../types/data-fetching-types";
import {
  AssetTableComponent,
  dataColsCurrency,
  dataColsDerivative,
  dataColsNft,
} from "../data-table";
import { useDistributionData, getDistribution } from "../data-fetching";
import { useMemo } from "react";
import { ranHexGen } from "../helpers";

const AssetDistributionComponent = ({
  portfolioData,
}: {
  portfolioData: Asset[];
}) => {
  const tresholdValue = 10;
  const colors = useMemo(() => {
    const baseColors = ranHexGen(tresholdValue);
    return baseColors;
  }, [tresholdValue]);
  const { processedQueryData } = useDistributionData(
    {
      qKey: ["PortfolioAD", "Assets"],
      initialData: portfolioData,
      queryFunction: getDistribution,
      distributionScope: "all",
      slug: "portfolios",
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const dataFrontendNaming = processedQueryData.assets.map((asset: Asset) => {
    const dataFrontendNamingArray = [];

    if (asset.assettype === "derivative") {
      dataFrontendNamingArray.push({
        symbol: asset.symbol,
        portfolioid: asset.portfolioid,
        userid: asset.userid,
        groupid: asset.groupid,
        holdingid: asset.holdingid,
        assettype: asset.assettype,
        assetid: asset.assetid,
        assetname: asset.assetname,
        derivativeexchange: asset.derivativeexchange,
        positiontype: asset.positiontype,
        tradedirection: asset.tradedirection,
        derivativetype: asset.derivativetype,
        leverage: asset.leverage,
        assetvalue: asset.assetvalue,
        entry: asset.entry,
        unrealizedpl: asset.unrealizedpl,
        price: asset.price,
        liquidationprice: asset.liquidationprice,
        margin: asset.margin,
        tp: asset.tp,
        sl: asset.sl,
        profitloss: asset.profitloss,
        profitlosschange: asset.profitlosschange,
        settlementdate: asset.settlementdate,
        notes: asset.notes,
      });
    } else if (asset.assettype === "nft") {
      dataFrontendNamingArray.push({
        symbol: asset.symbol,
        portfolioid: asset.portfolioid,
        userid: asset.userid,
        groupid: asset.groupid,
        holdingid: asset.holdingid,
        assetpercentage: asset.assetpercentage,
        assettype: asset.assettype,
        assetid: asset.assetid,
        assetname: asset.assetname,
        collectionvalue: asset.collectionvalue,
        collectionvalueeth: asset.collectionvalueeth,
        collectionfloorprice: asset.collectionfloorprice,
        assetamount: asset.assetamount,
        profitloss: asset.profitloss,
        profitlosschange: asset.profitlosschange,
        notes: asset.notes,
      });
    } else if (asset.assettype === "cryptocurrency") {
      dataFrontendNamingArray.push({
        symbol: asset.symbol,
        portfolioid: asset.portfolioid,
        userid: asset.userid,
        groupid: asset.groupid,
        holdingid: asset.holdingid,
        assettype: asset.assettype,
        assetid: asset.assetid,
        assetname: asset.assetname,
        assetabbreviation: asset.assetabbreviation,
        assetamount: asset.assetamount,
        assetvalue: asset.assetvalue,
        assetmarketprice: asset.assetmarketprice,
        assetchange24h: asset.assetchange24h,
        assetchange24hourvalue: asset.assetchange24hourvalue,
        assetchange7d: asset.assetchange7d,
        profitloss: asset.profitloss,
        profitlosschange: asset.profitlosschange,
        notes: asset.notes,
      });
    } else {
      dataFrontendNamingArray.push({});
    }
    return dataFrontendNamingArray;
  });

  const updatedData = dataFrontendNaming
    .flat()
    .map((asset: DistributionAsset, index: number) => {
      asset = {
        ...asset,
        color: colors[index],
        distribution:
          Number(
            (asset.assettype === "nft"
              ? asset.collectionvalue
              : asset.assetvalue) / processedQueryData.currentvalue
          ) * 100,
      };
      return asset;
    });

  // Manual calculate total value above, for the case currentvalue is undefined

  const pieConfig = {
    pieData: updatedData.map((asset: DistributionAsset) => {
      return {
        disElId: asset.assetid,
        disElVal:
          asset.assettype === "nft" ? asset.collectionvalue : asset.assetvalue,
        disElName: asset.assetname,
        disElDistribution: asset.distribution,
        disColor: asset.color,
      };
    }),
    full: false,
    tresholdValue: tresholdValue,
    total: processedQueryData.currentvalue,
    others: "Other Assets",
  };

  const tableConfig = {
    initial: updatedData,
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
    addOns: [],
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

export default AssetDistributionComponent;
