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
  },
  comparators: { costbasis: boolean; btc: boolean; eth: boolean },
  scope: string
): { data: any; config: ChartOptions<"line"> } => {
  const thirdDataSet =
    comparators.eth === true && scope === "development"
      ? processedQueryData.map(
          (timestamp: { x: string; y: number[] }) => timestamp.y[2]
        )
      : null;
  const secondDataSet =
    comparators.costbasis === true && scope === "portfoliotimeframes"
      ? processedQueryData.map(
          (timestamp: { x: string; y: number[] }) => timestamp.y[1]
        )
      : comparators.btc === true && scope === "development"
      ? processedQueryData.map(
          (timestamp: { x: string; y: number[] }) => timestamp.y[1]
        )
      : null;
  const portfolioData = processedQueryData.map(
    (timestamp: { x: string; y: number[] }) => timestamp.y[0]
  );
  const timestamps = processedQueryData.map(
    (timestamp: { x: string; y: number }) => timestamp.x
  );

  return {
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "networth",
          data: portfolioData,
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
        {
          label: "invest",
          data: secondDataSet,
          borderColor: "#005BEA",
        },
        {
          label: "invest",
          data: thirdDataSet,
          borderColor: "#005BEA",
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
