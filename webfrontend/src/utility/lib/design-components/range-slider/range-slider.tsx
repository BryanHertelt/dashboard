import { useState, useEffect, useRef } from "react";
import { formatCurrency, formatValue } from "../../helpers/helper-functions";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const RangeSlider = ({
  data,
  theme,
  currentValue,
}: {
  data: {
    currentbalance: number;
    desiredbalance: number;
    desiredbalancenumber: number;
    currentbalancenumber: number;
  };
  theme: string;
  currentValue: number;
}) => {
  const {
    desiredbalance,
    currentbalance,
    desiredbalancenumber,
    currentbalancenumber,
  } = data;
  const [balance, setBalance] = useState<number | string>(desiredbalancenumber);

  if (desiredbalance === null || desiredbalancenumber === null) {
    return (
      <p> Set desired balancing to see your rebalancing statistics here.</p>
    );
  }

  const barData: ChartData<"bar"> = {
    labels: [""],
    datasets: [
      {
        label: `Current: ${formatValue(currentbalance)}% ~ ${formatCurrency(
          currentbalancenumber
        )}`,
        data: [currentbalancenumber],
        backgroundColor: "rgba(0, 26, 66, 1)",
        borderColor: "rgba(0, 26, 66, 1)",
        borderWidth: 1,
      },
      {
        label: `Desired: ${formatValue(desiredbalance)}% ~ ${formatCurrency(
          desiredbalancenumber
        )}`,
        data: [Number(balance)],
        backgroundColor: "rgba(122, 122, 122, 1)",
        borderColor: "rgba(122, 122, 122, 1)",
        borderWidth: 1,
      },
      {
        label: `Portfolio Balance`,
        data: [currentValue - Math.max(Number(balance), currentbalancenumber)],
        borderRadius: 7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        display: false,
      },
    },
  };
  return (
    <div className="w-full h-11 flex justify-center items-center mr-5 flex-wrap">
      <Bar data={barData} options={options} />
      <div>
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setBalance(e.target.value);
          }}
          value={balance}
          className="border border-black"
        />
      </div>
      <div className="flex flex-col justify-start w-full">
        <div className="flex flex-col text-center mt-2">
          {barData.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className="w-4 h-4 rounded-sm mb-3"
                style={{ backgroundColor: dataset.backgroundColor as string }}
              ></span>
              <span className="text-xs text-icongray mb-3">
                {dataset.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
