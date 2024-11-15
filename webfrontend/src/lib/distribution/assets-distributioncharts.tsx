"use client";

import { Line, Pie } from "react-chartjs-2";
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
import {
  assetLineChartData,
  assetPieChartData,
} from "@/api/distribution/assetdistributionAPI";
import { AlignCenter } from "lucide-react";

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

const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      position: "right",
    },
  },
  layout: {
    padding: 0,
  },
  animation: {
    duration: 0,
  },
};

const doughnutLabel = {
  id: "doughnutLabel",
  afterDatasetsDraw(chart: any, args: any, plugins: any) {
    const { ctx, data } = chart;

    const centerX = chart.getDatasetMeta(0).data[0].x;
    const centerY = chart.getDatasetMeta(0).data[0].y;

    ctx.save();
    ctx.font = "bold 1.25rem sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$123,000.22", centerX, centerY - 11);

    ctx.font = "1rem sans-serif";
    ctx.fillText("100%", centerX, centerY + 11);
  },
};

const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const AssetLineChart = () => {
  return <Line options={lineChartOptions} data={assetLineChartData} />;
};

export const AssetPieChart = () => {
  return (
    <Pie
      options={pieChartOptions}
      data={assetPieChartData}
      plugins={[doughnutLabel]}
    />
  );
};
