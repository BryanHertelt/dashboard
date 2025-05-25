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
import { useRef, useState } from "react";
import { formatValue, formatCurrency } from "../helpers";
import { icongray, black, chartColors } from "../helpers/helper-config/colors";

import { Asset, DistributionAsset } from "../types/data-fetching-types";

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
}: {
  pieData: { total: number; assetData: Asset[] };
  full: boolean;
}) => {
  const selectedDatasetIndex = useRef<number | null>(null);
  const selectedIndex = useRef<number | null>(null);
  const [content, setContent] = useState<any>(formatCurrency(pieData.total));

  const updatedPieData: any = pieData.assetData.map((assetObj: Asset) => {
    return {
      ...assetObj,
      distribution:
        Number(
          (assetObj.assettype === "nft"
            ? assetObj.collectionvalue
            : assetObj.assetvalue) / pieData.total
        ) * 100,
    };
  });

  const sortedEntries = updatedPieData.sort(
    (prevAsset: DistributionAsset, thisAsset: DistributionAsset) =>
      prevAsset.distribution < thisAsset.distribution
        ? 1
        : prevAsset.distribution > thisAsset.distribution
        ? -1
        : 0
  );

  const mainAssets: any[] = [];
  const otherAssets: any[] = [];
  const tresholdValue: number = 9;

  sortedEntries.forEach((asset: DistributionAsset, index: number) => {
    if (index < tresholdValue) {
      mainAssets.push({
        distribution: asset.distribution,
        label: asset.assetid,
      });
    } else {
      otherAssets.push({
        value:
          asset.assettype == "nft" ? asset.collectionvalue : asset.assetvalue,
        distribution: asset.distribution,
        label: asset.assetid,
      });
    }
  });

  const otherAssetsDistribution = otherAssets.reduce(
    (acc: number, asset: any) => {
      const result = acc + asset.distribution;
      return result;
    },
    0
  ); // Initial accumulator value

  const otherAssetsValue = otherAssets.reduce((acc: number, asset: any) => {
    const result = acc + asset.value;
    return result;
  }, 0); // Initial accumulator value

  const chartNewCol = chartColors.map((color: string, index: number) => {
    if (index < tresholdValue) {
      return color;
    } else {
      return icongray;
    }
  });

  const formattedPieData = {
    labels: mainAssets.map((labelconstructor) => labelconstructor.label),
    datasets: [
      {
        label: "Asset",
        data: [
          mainAssets.map(
            (distributionObject: DistributionAsset) =>
              distributionObject.distribution
          ),
          otherAssetsDistribution,
        ].flat(),
        backgroundColor: chartNewCol,
        hoverOffset: 10,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };
  const hoverLabel = {
    id: "hoverLabel",
    afterDraw: (chart: any) => {
      const {
        ctx,
        chartArea: { width, height, top },
      } = chart;

      if (
        selectedDatasetIndex.current !== null &&
        selectedIndex.current !== null
      ) {
        ctx.save();
        ctx.font = "bold 1.25rem sans-serif";
        ctx.fillStyle = black;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          selectedIndex.current < tresholdValue
            ? formatCurrency(
                updatedPieData[selectedIndex.current].assettype === "nft"
                  ? updatedPieData[selectedIndex.current].collectionfloorprice
                  : updatedPieData[selectedIndex.current].assetvalue
              )
            : formatCurrency(otherAssetsValue),
          width / 2,
          height / 2 + top + 10
        );
        ctx.font = "normal 1rem  sans-serif";
        ctx.fillText(
          selectedIndex.current != tresholdValue
            ? updatedPieData[selectedIndex.current].assetname
            : "Other Assets",
          width / 2,
          height / 2 + top + 35
        );
        ctx.font = "lighter 1rem  sans-serif";
        ctx.fillText(
          selectedIndex.current < tresholdValue
            ? formatValue(updatedPieData[selectedIndex.current].distribution) +
                "%"
            : formatValue(otherAssetsDistribution) + "%",
          width / 2,
          height / 2 + top + 55
        );
        ctx.restore();
      } else {
        setContent(formatCurrency(pieData.total));
        ctx.save();
        ctx.font = "bold 1.25rem sans-serif";
        ctx.fillStyle = black;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(content, width / 2, height / 2 + top + 25);
        ctx.font = "lighter 1rem  sans-serif";
        ctx.fillText("100%", width / 2, height / 2 + top + 50);
        ctx.restore();
      }
    },
  };

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
    cutout: "80%",
    radius: "90%",
    circumference: full ? 360 : 180,
    rotation: full ? 0 : 270,
    onHover: (hover, element, chart) => {
      if (element[0]) {
        selectedDatasetIndex.current = element[0].datasetIndex;
        selectedIndex.current = element[0].index;
        chart.draw();
      } else {
        selectedDatasetIndex.current = null;
        selectedIndex.current = null;
        chart.draw();
      }
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
