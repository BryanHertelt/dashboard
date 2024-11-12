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
} from "chart.js";
import {
  assetLineChartData,
  assetPieChartData,
} from "@/api/distribution/assetdistributionAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      position: "right",
      ticks: {
        callback: function (value, index, ticks) {
          return "$" + value;
        },
      },
    },
    x: {
      ticks: {
        padding: 0,
      },
    },
  },
  layout: {
    padding: 0,
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

const textCenter = {
  id: "textCenter",
  beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
    const { ctx, data } = chart;

    ctx.save();
    ctx.font = "bolder 50px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Text",
      chart.getDatasetMeta(0).assetPieChartData[1].x,
      chart.getDatasetMeta(0).assetPieChartData[1].y
    );
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
      //  plugins={[textCenter]}
    />
  );
};
