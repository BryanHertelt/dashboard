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

import { Doughnut, Pie } from "react-chartjs-2";

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

export const assetPieChartData = {
  labels: ["BTC", "ETH", "SOL", "USDT"],
  datasets: [
    {
      label: "Asset",
      data: [300, 100, 207.67, 20],
      backgroundColor: ["#0042AB", "#005CD3", "#3686DC", "#1298E6"],
    },
  ],
};

export const doughnutLabel = {
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

export const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};
interface pieData {
  symbol: string;
  assetname: string;
  assetvalue: number | undefined;
  distribution: number;
}
export const DistributionChart = ({ pieData }: any) => {
  const formattedPieData = {
    labels: pieData.map((asset: any) => asset.assetname),
    datasets: [
      {
        label: "Asset",
        data: pieData.map((asset: any) => asset.distribution),
        backgroundColor: ["#0042AB", "#005CD3", "#3686DC", "#1298E6"],
      },
    ],
  };
  console.log("pieData raw ", pieData);
  console.log("formatted Pie Data", formattedPieData);
  return (
    <>
      <Doughnut data={formattedPieData} options={doughnutOptions} />
    </>
  );
};

//options={pieChartOptions}
//plugins={[doughnutLabel]}
