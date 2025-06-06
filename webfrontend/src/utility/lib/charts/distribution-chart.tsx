"use client";
import {
  Chart as ChartJS,
  Chart as ChartType,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ArcElement,
  Filler,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { useRef, useState, useMemo } from "react";
import { ranHexGen } from "../helpers";
import { icongray, black, chartColors } from "../helpers/helper-config/colors";
import { renderHoverLabel } from "./renderHoverLabel";
import { SmallErrorSkeleton } from "../data-fetching";

import {
  Asset,
  DistributionAsset,
  OtherAssetsChart,
  MainAssetsChart,
} from "../types/data-fetching-types";
import { drawDoughnutChart } from "./drawDoughnutChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DistributionChart = ({
  pieData,
  full,
  tresholdValue,
}: {
  pieData: { total: number; assetData: Asset[] };
  full: boolean;
  tresholdValue: number;
}) => {
  //Data sorting
  const selectedDatasetIndex = useRef<number | null>(null);
  const selectedIndex = useRef<number | null>(null);

  if (!pieData || pieData.assetData.length === 0) {
    return <SmallErrorSkeleton />;
  }

  const updatedPieData: DistributionAsset[] = pieData.assetData.map(
    (assetObj: Asset) => {
      return {
        ...assetObj,
        distribution:
          Number(
            (assetObj.assettype === "nft"
              ? assetObj.collectionvalue
              : assetObj.assetvalue) / pieData.total
          ) * 100,
      };
    }
  );

  const sortedEntries = [...updatedPieData].sort(
    (prevAsset: DistributionAsset, thisAsset: DistributionAsset) =>
      prevAsset.distribution < thisAsset.distribution
        ? 1
        : prevAsset.distribution > thisAsset.distribution
        ? -1
        : 0
  );

  //chart treshold logic
  const mainAssets: MainAssetsChart[] = [];
  const otherAssets: OtherAssetsChart[] = [];

  sortedEntries.forEach((asset: DistributionAsset, index: number) => {
    if (index < tresholdValue) {
      mainAssets.push({
        distribution: asset.distribution,
        label: asset.assetid.toString(),
      });
    } else {
      otherAssets.push({
        value:
          asset.assettype == "nft" ? asset.collectionvalue : asset.assetvalue,
        distribution: asset.distribution,
        label: asset.assetid.toString(),
      });
    }
  });

  const otherAssetsDistribution = otherAssets.reduce(
    (acc: number, asset: OtherAssetsChart) => {
      const result = acc + asset.distribution;
      return result;
    },
    0
  );
  const otherAssetsValue = otherAssets.reduce(
    (acc: number, asset: OtherAssetsChart) => {
      const result = acc + asset.value;
      return result;
    },
    0
  );

  //generate colors
  const colors = useMemo(() => {
    const baseColors = ranHexGen(tresholdValue);
    return otherAssets.length !== 0 ? [...baseColors, icongray] : baseColors;
  }, [tresholdValue, otherAssets.length]);

  // render HoverLabel
  const hoverLabelInformation = {
    selectedDatasetIndex: selectedDatasetIndex,
    selectedIndex: selectedIndex,
    updatedPieData: updatedPieData,
    tresholdValue: tresholdValue,
    otherAssetsValue: otherAssetsValue,
    otherAssetsDistribution: otherAssetsDistribution,
    pieData: pieData,
    full: full,
  };

  const hoverLabel = {
    id: "hoverLabel",
    afterDraw: (chart: ChartJS<"doughnut">) => {
      const hoverLabel = renderHoverLabel(chart, hoverLabelInformation);
      return hoverLabel;
    },
  };

  //format pie data for chart js
  const formattedPieData = {
    labels: mainAssets.map(
      (labelconstructor: MainAssetsChart) => labelconstructor.label
    ),
    datasets: [
      {
        label: "Asset",
        data: [
          mainAssets.map(
            (distributionObject: MainAssetsChart) =>
              distributionObject.distribution
          ),
          otherAssetsDistribution,
        ].flat(),
        backgroundColor: colors,
        hoverOffset: 10,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  //build doughnut Options
  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: "73%",
    radius: "90%",
    circumference: full ? 360 : 180,
    rotation: full ? 0 : 270,
    onHover: (hover, element, chart) => {
      drawDoughnutChart(
        hover,
        element,
        chart,
        selectedDatasetIndex,
        selectedIndex
      );
    },
  };

  return (
    <>
      <Doughnut
        data={formattedPieData}
        options={doughnutOptions}
        plugins={[hoverLabel]}
      />
    </>
  );
};
