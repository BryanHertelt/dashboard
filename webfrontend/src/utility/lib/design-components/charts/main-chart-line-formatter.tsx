import "chartjs-adapter-date-fns";

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
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

export const formatMainLineData = (
  processedQueryData: any,
  timeframe: {
    timeframe: string;
    timeunit: any;
  }
): { data: any; config: ChartOptions<"line"> } => {
  return {
    data: {
      labels: processedQueryData.map((x: any) => {
        return x.x;
      }),
      datasets: [
        {
          label: "currentValue",
          data: processedQueryData,
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
            const {
              ctx,
              chartArea: { top, bottom },
            } = context.chart;
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
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: timeframe.timeunit,
          },
        },
        y: {
          position: "right",
          beginAtZero: true,
        },
      },
    },
  };
};
