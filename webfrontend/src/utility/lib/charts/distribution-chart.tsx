"use client";
import {
  Chart as ChartJS,
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
import { useRef, useEffect } from "react";
import {
  gray,
} from "../helpers/helper-config/colors";
import { drawDoughnutChart, renderHoverLabel } from "../charts";
import { SmallErrorSkeleton } from "../data-fetching";
import logger from "../logging/logger";

import {
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
 * - `data`: an array of `Asset` objects, each representing an individual asset.
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
 * - Sorts and processes the input `data` by descending distribution share.
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
  config,
}: {
  config: {
    pieData: {
      disElId: number | string;
      disElVal: number;
      disElName: string;
      disElDistribution: number;
      disColor: string;
    }[];
    full: boolean;
    tresholdValue: number;
    total: number;
    others: string;
  };
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
      }
    );
  }, []);

  //Data sorting
  const selectedDatasetIndex = useRef<number | null>(null);
  const selectedIndex = useRef<number | null>(null);

  if (!config.pieData || config.pieData.length === 0) {
    logger.error(
      "distribution-chart.tsx >> Pie Data is undefined or empty",
      config.pieData
    );
    return <SmallErrorSkeleton />;
  }

  const sortedEntries = [...config.pieData].sort(
    (prevDisObj: any, thisDisObj: any) =>
      prevDisObj.disElDistribution < thisDisObj.disElDistribution
        ? 1
        : prevDisObj.disElDistribution > thisDisObj.disElDistribution
        ? -1
        : 0
  );

  logger.debug("distribution-chart.tsx >> sorted entries", sortedEntries);

  //chart treshold logic
  const mainDisObj: MainAssetsChart[] = [];
  const otherDisObj: OtherAssetsChart[] = [];

  sortedEntries.forEach((disObj: any, index: number) => {
    if (index < config.tresholdValue) {
      mainDisObj.push({
        distribution: disObj.disElDistribution,
        label: disObj.disElId,
      });
    } else {
      otherDisObj.push({
        value: disObj.disElVal,
        distribution: disObj.disElDistribution,
        label: disObj.disElId,
      });
    }
  });

  const otherDistribution = otherDisObj.reduce(
    (acc: number, disObj: OtherAssetsChart) => {
      const result = acc + disObj.distribution;
      return result;
    },
    0
  );
  const otherValue = otherDisObj.reduce(
    (acc: number, disObj: OtherAssetsChart) => {
      const result = acc + disObj.value;
      return result;
    },
    0
  );


  logger.debug("distribution-chart.tsx >> [MainAssets, OtherAssets]", [
    mainDisObj,
    otherDisObj,
  ]);

  const baseColors = config.pieData
    .map((disObj, index) => {
      if (index < config.tresholdValue) {
        return disObj.disColor;
      }
    })
    .filter((color) => color !== undefined); // Remove undefined values from map

  const colors = otherDisObj.length !== 0 ? [...baseColors, gray] : baseColors;
  logger.debug(
    "distribution-chart.tsx >> colors generated, tresholdValue",
    colors.length,
    config.tresholdValue - 1
  );

  // render HoverLabel
  const hoverLabelInformation = {
    selectedDatasetIndex: selectedDatasetIndex,
    selectedIndex: selectedIndex,
    updatedPieData: sortedEntries,
    tresholdValue: config.tresholdValue,
    otherValue: otherValue,
    otherDistribution: otherDistribution,
    pieData: config.pieData,
    total: config.total,
    full: config.full,
    others: config.others,
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
    labels: mainDisObj.map(
      (labelconstructor: MainAssetsChart) => labelconstructor.label
    ),
    datasets: [
      {
        label: "Asset",
        data: [
          mainDisObj.map(
            (distributionObject: MainAssetsChart) =>
              distributionObject.distribution
          ),
          otherDistribution,
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
    circumference: config.full ? 360 : 180,
    rotation: config.full ? 0 : 270,
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
