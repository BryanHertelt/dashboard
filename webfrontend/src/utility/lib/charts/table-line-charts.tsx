import { Line } from "react-chartjs-2";
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

export const TableLineChart = (props: any) => {
  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    layout: {
      padding: 0,
    },
    animation: {
      duration: 0,
    },
  };
  const lineData = {
    labels: props.data,
    datasets: [
      {
        label: "currentValue",
        data: props.data,
        borderColor: "#04B900",
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
  return <Line data={lineData} options={lineOptions} />;
};
