"use client";

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

import { postRebalancing } from "../../datafetching/layer";

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
  assetId,
}: {
  data: {
    currentbalance: number;
    desiredbalance: number;
    desiredbalancenumber: number;
    currentbalancenumber: number;
  };
  assetId: string | number;
  theme: string;
  currentValue: number;
}) => {
  const {
    desiredbalance,
    currentbalance,
    desiredbalancenumber,
    currentbalancenumber,
  } = data;
  const [balance, setBalance] = useState<number>(desiredbalancenumber);
  const [toast, setToast] = useState<{
    active: boolean;
    title: string;
  }>({ active: false, title: "" });
  const [isToggled, setToggled] = useState<boolean>(false);

  if (desiredbalance === null || desiredbalancenumber === null) {
    return (
      <p> Set desired balancing to see your rebalancing statistics here.</p>
    );
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    postRebalancing(
      assetId,
      Math.round((Number(balance) / currentValue) * 10000) / 100
    );
  };

  const barData: ChartData<"bar"> = {
    labels: [""],
    datasets: [
      {
        label: `Current: ${formatValue(currentbalance)}% ~ ${formatCurrency(
          currentbalancenumber
        )}`,
        data: [currentbalance],
        backgroundColor: "rgba(0, 26, 66, 1)",
        borderColor: "rgba(0, 26, 66, 1)",
        borderRadius: 7,
        order: currentbalancenumber > balance ? 2 : 1,
      },
      {
        label: `Desired: ${formatValue(
          Math.round((Number(balance) / currentValue) * 10000) / 100
        )}% ~ ${formatCurrency(Math.round(Number(balance) * 100) / 100)}`,
        data: [(Number(balance) / currentValue) * 100],
        backgroundColor: "rgba(122, 122, 122, 1)",
        borderColor: "rgba(122, 122, 122, 1)",
        borderRadius: 7,
        order: currentbalancenumber > balance ? 1 : 2,
      },
      {
        label: `Portfolio Balance: 100%  ~ ${formatCurrency(currentValue)} `,
        backgroundColor: "#D3D3D3",
        data: [100],
        borderRadius: 7,
        order: 3,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    animation: {
      duration: 400,
    },
    scales: {
      x: {
        stacked: false,
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
      tooltip: {
        enabled: false,
      },
    },
  };
  return (
    <div className="w-full h-11 flex justify-center items-center mr-5 flex-wrap">
      <Bar data={barData} options={options} />
      <div className="flex flex-col justify-start w-full">
        <div className="flex flex-row">
          <div className="flex flex-col text-center mt-2 w-1/2">
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
          <div
            className={`flex items-center w-14 h-8 bg-gray rounded-full transition-all duration-500`}
          >
            <span
              onClick={() => setToggled(!isToggled)}
              className={`flex h-8 w-8 ${
                isToggled ? "ml-6" : "ml-0"
              } bg-white rounded-full transition-all duration-500 justify-center items-center font-semibold`}
            >
              {isToggled ? "[x]" : "[%]"}
            </span>{" "}
          </div>
          <div className="flex flex-row justify-end w-1/2">
            {toast.active === true ? (
              <div className="rounded-md text-red text-xs ml-1.5 h-7  ">
                {" "}
                {toast.title}
              </div>
            ) : null}
            <form className="flex flex-col items-end">
              <div className="flex flex-row justify-end">
                <p className="pr-3 text-icongray"> Value: </p>
                <input
                  type="text"
                  step="any"
                  onBlur={handleSubmit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (Number(e.target.value) > currentValue) {
                      setToast({
                        active: true,
                        title:
                          "Your desired balance cannot be larger than the portfolio size",
                      });
                    } else {
                      setToast({ active: false, title: "" });
                      setBalance(Number(e.target.value));
                    }
                  }}
                  value={Math.round(Number(balance) * 100) / 100}
                  className="bg-gray w-1/2 rounded-md pl-2"
                />
              </div>
              <div className="flex flex-row justify-end">
                <p className="pr-3 text-icongray"> Balance: </p>
                <input
                  type="text"
                  step="any"
                  onBlur={handleSubmit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (Number(e.target.value) > 100) {
                      setToast({
                        active: true,
                        title:
                          "The desired value cannot be more than 100 percent",
                      });
                    } else {
                      setToast({ active: false, title: "" });
                      setBalance((Number(e.target.value) / 100) * currentValue);
                    }
                  }}
                  value={
                    Math.round((Number(balance) / currentValue) * 10000) / 100
                  }
                  className="bg-gray w-1/2 rounded-md mt-3 pl-2"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
