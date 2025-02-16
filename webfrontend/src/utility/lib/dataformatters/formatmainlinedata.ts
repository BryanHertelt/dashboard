
export interface MainLineDataFormatted{}

import { InitialDataMainChart } from "./types"
import { getTimeFrame } from "../utils";

const formatMainLineData = (initialData:InitialDataMainChart, timeframe: string, addCharts: string[])=> {
const chartData = initialData.data[0]; 
  

return

}

/**
 *       labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "currentValue",
          data: [890000, 880000, 2000, 850000, 890000, 120000, 400000], 
          borderColor: "#005BEA",
          backgroundColor: (context: any) => {
            const bgColor = [
              "rgba(0, 91, 234, 0.3)",
              "rgba(0, 91, 234, 0.2)",
              "rgba(0, 91, 234, 0.01)",
            ];
            if (!context.chart.chartArea) {
              return "rgba(0, 91, 234, 0.1)"; 
            }
            const { ctx, chartArea: { top, bottom } } = context.chart;
            const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
            const colorTranches = 1 / (bgColor.length - 1);

            for (let i = 0; i < bgColor.length; i++) {
              gradientBg.addColorStop(i * colorTranches, bgColor[i]);
            }
            return gradientBg;
          },
          pointRadius: 0,
          fill: true,
        },
      ],
 */