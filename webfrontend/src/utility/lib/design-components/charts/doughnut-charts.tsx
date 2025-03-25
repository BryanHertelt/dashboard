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
import { useRef, useState } from "react";
import { formatValue, formatCurrency } from "../../helpers/helper-functions";
import { icongray, black } from "../../helpers/colors";

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
      borderWidth: 1,
    },
  ],
};

interface pieData {
  symbol: string;
  assetname: string;
  assetvalue: number | undefined;
}
export const DistributionChart = ({ pieData }: any) => {
  const selectedDatasetIndex = useRef<number | null>(null);
  const selectedIndex = useRef<number | null>(null);
  const [content, setContent] = useState<any>(formatCurrency(pieData.total));
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
        const sum = chart._metasets[selectedDatasetIndex.current]?.total;
        const value =
          chart._metasets[selectedDatasetIndex.current]?._parsed[
            selectedIndex.current
          ];
        const percentage = formatValue((value / sum) * 100);

        ctx.save();
        ctx.font = "bold 1.25rem sans-serif";
        ctx.fillStyle = black;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          formatCurrency(pieData.assetData[selectedIndex.current].assetvalue),
          width / 2,
          height / 2 + top - 25
        );
        ctx.font = "normal 1rem  sans-serif";
        ctx.fillText(
          pieData.assetData[selectedIndex.current].assetname,
          width / 2,
          height / 2 + top
        );
        ctx.font = "lighter 1rem  sans-serif";
        ctx.fillText(percentage + "%", width / 2, height / 2 + top + 25);
        ctx.restore();
      } else {
        setContent(formatCurrency(pieData.total));
        ctx.save();
        ctx.font = "bold 1.25rem sans-serif";
        ctx.fillStyle = black;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(content, width / 2, height / 2 + top - 10);
        ctx.font = "lighter 1rem  sans-serif";
        ctx.fillText("100%", width / 2, height / 2 + top + 15);
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
    },
    cutout: "70%",
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

  const treshold: any[] = [];
  const mainAssets: any[] = [];

  pieData.assetData.map((asset: any) => {
    (asset.assetvalue / pieData.total) * 100 > 5
      ? mainAssets.push({ value: asset.assetvalue, label: asset.assetname })
      : treshold.push({ value: asset.assetvalue, label: asset.assetname });
  });
  const formattedPieData = {
    labels: mainAssets.map((labelconstructor) => labelconstructor.label),
    datasets: [
      {
        label: "Asset",
        data: mainAssets.map((value) => value.value),
        backgroundColor: ["#0042AB", "#005CD3", "#3686DC", "#1298E6"],
        hoverOffset: 20,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Doughnut
      data={formattedPieData}
      options={doughnutOptions}
      plugins={[hoverLabel]}
    />
  );
};
