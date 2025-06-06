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
  import { formatValue, formatCurrency } from "../helpers";
  import { black } from "../helpers/helper-config/colors";
  import { DistributionAsset } from "../types/data-fetching-types";
  

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


type HoverLabelInformation = {
selectedDatasetIndex: any
selectedIndex: any
updatedPieData: DistributionAsset[], 
tresholdValue: number, 
otherAssetsValue: number, 
otherAssetsDistribution: number, 
pieData: any
full: boolean
}

export const renderHoverLabel = (chart: ChartJS<"doughnut">, hoverLabelInformation: HoverLabelInformation ) => {
    const {
      ctx,
      chartArea: { width, height, top },
    } = chart;

    if (
      hoverLabelInformation.selectedDatasetIndex.current !== null &&
      hoverLabelInformation.selectedIndex.current !== null
    ) {
      ctx.save();
      ctx.font = "bold 1.25rem sans-serif";
      ctx.fillStyle = black;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const selectedAsset = hoverLabelInformation.updatedPieData[hoverLabelInformation.selectedIndex.current];

      ctx.fillText(
        hoverLabelInformation.selectedIndex.current < hoverLabelInformation.tresholdValue
          ? formatCurrency(
              selectedAsset.assettype === "nft"
                ? selectedAsset.collectionfloorprice
                : selectedAsset.assetvalue
            )
          : formatCurrency(hoverLabelInformation.otherAssetsValue),
        width / 2,
        height / 2 + top + 10
      );
      ctx.font = "normal 1rem  sans-serif";
      ctx.fillText(
        hoverLabelInformation.selectedIndex.current != hoverLabelInformation.tresholdValue
          ? hoverLabelInformation.updatedPieData[hoverLabelInformation.selectedIndex.current].assetname
          : "Other Assets",
        width / 2,
        height / 2 + top + 35,
      );
      ctx.font = "lighter 1rem  sans-serif";
      ctx.fillText(
        hoverLabelInformation.selectedIndex.current < hoverLabelInformation.tresholdValue
          ? formatValue(hoverLabelInformation.updatedPieData[hoverLabelInformation.selectedIndex.current].distribution) +
              "%"
          : formatValue(hoverLabelInformation.otherAssetsDistribution) + "%",
        width / 2,
        height / 2 + top + 55
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = "bold 1.25rem sans-serif";
      ctx.fillStyle = black;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(formatCurrency(hoverLabelInformation.pieData.total), width / 2, height / 2 + top + 25);
      ctx.font = "lighter 1rem  sans-serif";
      ctx.fillText("100%", width / 2, height / 2 + top + 50);
      ctx.restore();
    }
  }