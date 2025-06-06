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

/**
 * `renderHoverLabel` is a canvas-drawing utility for Chart.js doughnut charts
 * that displays dynamic tooltip-like labels at the center of the chart,
 * depending on the current hover state. It visually annotates selected
 * segments or defaults to total chart information if no segment is selected.
 *
 * ### Parameters
 * @param chart - A Chart.js `doughnut` chart instance whose canvas context (`ctx`)
 *   and dimensions are used for rendering.
 * @param hoverLabelInformation - An object containing relevant chart and data state:
 * - `selectedDatasetIndex` - Ref to the currently hovered dataset index (null if none).
 * - `selectedIndex` - Ref to the currently hovered slice index (null if none).
 * - `updatedPieData` - Array of assets being visualized in the doughnut chart.
 * - `tresholdValue` - Index separating specific assets from grouped "Other Assets".
 * - `otherAssetsValue` - Combined value of grouped assets below the threshold.
 * - `otherAssetsDistribution` - Percentage distribution of grouped "Other Assets".
 * - `pieData` - Original pie chart data, including `total` value.
 * - `full` - Boolean flag controlling display logic (not directly used here).
 *
 * ### Behavior
 * - If a chart segment is selected (`selectedIndex` is not null):
 *   - Displays the asset value or `otherAssetsValue` if it's part of "Other Assets".
 *   - Shows the asset name or "Other Assets".
 *   - Displays the distribution percentage.
 * - If no segment is selected:
 *   - Shows the total portfolio value and 100% label in the center.
 *
 * ### Canvas Styling
 * - Uses bold and light font weights to distinguish between values and labels.
 * - Always centers the text both horizontally and vertically within the chart area.
 *
 * @returns void - This function draws directly onto the Chart.js canvas.
 */
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