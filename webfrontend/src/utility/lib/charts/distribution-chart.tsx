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
import { useRef, useMemo, useEffect } from "react";
import { ranHexGen } from "../helpers";
import { icongray, black, chartColors } from "../helpers/helper-config/colors";
import { drawDoughnutChart, renderHoverLabel } from "../charts";
import { SmallErrorSkeleton } from "../data-fetching";
import logger from "../logging/logger";

import {
  Asset,
  DistributionAsset,
  OtherAssetsChart,
  MainAssetsChart,
} from "../types/data-fetching-types";

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

/**
 * `DistributionChart` is a data visualization component that renders a responsive
 * doughnut chart representing asset distribution. It visualizes the proportional
 * value of asset holdings, categorizing smaller items under an "Other" segment
 * when a defined threshold is exceeded.
 *
 * ### Props
 * @param pieData - An object containing:
 * - `total`: the overall value of all assets combined.
 * - `assetData`: an array of `Asset` objects, each representing an individual asset.
 * @param full - A boolean flag indicating whether the doughnut chart should render
 *   as a full circle (`true`) or as a half-circle (`false`).
 * @param tresholdValue - A numerical threshold used to determine how many top assets
 *   are displayed individually before grouping the remaining into an "Other" segment.
 *
 * ### Internal Logic
 * - `selectedDatasetIndex: useRef<number | null>` - Tracks the active dataset on hover.
 * - `selectedIndex: useRef<number | null>` - Tracks the index of the currently hovered chart segment.
 *
 * ### Behavior
 * - Sorts and processes the input `assetData` by descending distribution share.
 * - Divides data into two categories based on `tresholdValue`:
 *   - `mainAssets`: top assets rendered as distinct segments in the chart.
 *   - `otherAssets`: grouped under a single "Other" segment with combined value and distribution.
 * - Dynamically generates color codes for each chart segment, appending a default gray color
 *   for the "Other" segment if it exists.
 * - Configures Chart.js `onHover` behavior to track hovered segments and trigger chart redraw.
 * - Uses a custom plugin (`hoverLabel`) to draw hover labels manually, bypassing default tooltips.
 *
 * @returns A rendered `Doughnut` chart component from `react-chartjs-2`, customized
 * with sorting, grouping logic, hover behavior, and dynamic color rendering.
 */
export const DistributionChart = ({
  pieData,
  full,
  tresholdValue,
}: {
  pieData: { total: number; assetData: Asset[] };
  full: boolean;
  tresholdValue: number;
}) => {
  // Measure performance of component
  const start = performance.now();
  useEffect(() => {
    const end = performance.now();
    const duration = end - start;
    logger.info(
      `Asset Distribution Doughnut Chart rendered with the following data`,
      {
        duration: duration.toFixed(2),
        options: doughnutOptions,
        data: formattedPieData,
      }
    );
  }, []);

  //Data sorting
  const selectedDatasetIndex = useRef<number | null>(null);
  const selectedIndex = useRef<number | null>(null);

  if (!pieData || pieData.assetData.length === 0) {
    logger.error(
      "distribution-chart.tsx >> Pie Data is undefined or empty",
      pieData
    );
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
  logger.debug("distribution-chart.tsx >> updated pie data", updatedPieData);

  const sortedEntries = [...updatedPieData].sort(
    (prevAsset: DistributionAsset, thisAsset: DistributionAsset) =>
      prevAsset.distribution < thisAsset.distribution
        ? 1
        : prevAsset.distribution > thisAsset.distribution
        ? -1
        : 0
  );
  logger.debug("distribution-chart.tsx >> sorted entries", sortedEntries);

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

  logger.debug("distribution-chart.tsx >> [MainAssets, OtherAssets]", [
    mainAssets,
    otherAssets,
  ]);
  //generate colors
  const colors = useMemo(() => {
    const baseColors = ranHexGen(tresholdValue);
    return otherAssets.length !== 0 ? [...baseColors, icongray] : baseColors;
  }, [tresholdValue, otherAssets.length]);
  logger.debug(
    "distribution-chart.tsx >> colors generated, tresholdValue",
    colors.length,
    tresholdValue - 1
  );

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

  logger.debug("distribution-chart.tsx >> hoverLabel render starts");
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
