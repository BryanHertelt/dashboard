import "chartjs-adapter-date-fns";
import {
  icongray,
  bitcoinYellow,
  ethereumBlue,
  flyzerBlue,
  chartBgColors,
  black,
} from "../../helpers/colors";

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

  console.log(timeframe.timeframe);

  return {
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "networth",
          data: portfolioData,
          borderColor: scope === "development" ? black : flyzerBlue,
          backgroundColor: (context: any) => {
            if (!context.chart.chartArea) {
              return chartBgColors[2];
            }
            const {
              ctx,
              chartArea: { top, bottom },
            } = context.chart;
            const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
            const colorTranches = 1 / (chartBgColors.length - 1);

            for (let i = 0; i < chartBgColors.length; i++) {
              gradientBg.addColorStop(i * colorTranches, chartBgColors[i]);
            }
            return gradientBg;
          },
          pointRadius: 0,
          fill: scope === "development" ? false : true,
        },
        {
          label: scope === "development" ? "change" : "invest",
          data: secondDataSet,
          borderColor: comparators.btc === true ? bitcoinYellow : icongray,
          pointRadius: 0,
        },
        {
          label: "change",
          data: thirdDataSet,
          borderColor: ethereumBlue,
          pointRadius: 0,
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
          ticks: {
            stepSize:
              timeframe.timeframe === "1 hour"
                ? 10
                : timeframe.timeframe === "7 days"
                ? 1
                : 10,
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
