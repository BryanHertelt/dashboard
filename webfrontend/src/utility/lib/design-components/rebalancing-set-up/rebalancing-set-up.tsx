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
import { flyzerBlue, lightBlue, darkerGray } from "../../helpers/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const RebalancingSetUp = ({
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
  const [balance, setBalance] = useState<number>(desiredbalance);
  const [toast, setToast] = useState<{
    active: boolean;
    title: string;
  }>({ active: false, title: "" });

  const [isToggled, setToggled] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(balance.toString());

  if (desiredbalance === null || desiredbalancenumber === null) {
    return (
      <p> Set desired balancing to see your rebalancing statistics here.</p>
    );
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setToast({ active: false, title: "" });
    postRebalancing(assetId, Math.round(Number(balance) * 100) / 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!/^\d*\.?\d*$/.test(value)) {
      setToast({ active: true, title: "Please type in a number" });
      return;
    }
    if (value.endsWith(".")) {
      setInputValue(value);
      return;
    }

    const numericValue = Number(value);

    if (numericValue > currentValue) {
      setToast({
        active: true,
        title: "Your desired balance cannot be larger than the portfolio size.",
      });
    } else if (value.endsWith(".")) {
      setInputValue(value);
    } else if (!isToggled && numericValue > 100) {
      setToast({
        active: true,
        title: "Your desired balance cannot be larger than 100 percent.",
      });
    } else if (isToggled && value === "") {
      setBalance(0);
    } else {
      setToast({ active: false, title: "" });
      setInputValue("");
      setBalance(
        isToggled
          ? (numericValue / currentValue) * 100
          : Math.round(numericValue * 100) / 100
      );
    }
  };

  const barData: ChartData<"bar"> = {
    labels: [""],
    datasets: [
      {
        label: `Current: ${formatValue(currentbalance)}% ~ ${formatCurrency(
          currentbalancenumber
        )}`,
        data: [currentbalance],
        backgroundColor: flyzerBlue,
        borderWidth: 0,
        borderRadius: 7,
        order: currentbalancenumber > balance ? 2 : 1,
      },
      {
        label: `Desired: ${formatValue(Number(balance))}% ~ ${formatCurrency(
          Math.round(Number(currentValue * balance)) / 100
        )}`,
        data: [balance],
        backgroundColor: lightBlue,
        borderWidth: 0,
        borderRadius: 7,
        order: currentbalance > balance ? 1 : 2,
      },
      {
        label: `Portfolio Balance: 100%  ~ ${formatCurrency(currentValue)} `,
        backgroundColor: darkerGray,
        borderWidth: 0,
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
          <div className="flex flex-col text-center mt-2 w-3/5">
            {barData.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-sm mb-3"
                  style={{ backgroundColor: dataset.backgroundColor as string }}
                ></span>
                <span className="text-xs text-icongray mb-3 text-start">
                  {dataset.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-end w-1/2 ">
            <div
              className={`flex items-center w-12 h-6 bg-gray rounded-full transition-all duration-500 pl-1`}
            >
              <span
                onClick={() => setToggled(!isToggled)}
                className={`flex h-5 w-5 p-2 ${
                  isToggled ? "translate-x-full" : "translate-x-0"
                } bg-white rounded-full transition-all duration-500 justify-center items-center font-semibold text-xs`}
              >
                {isToggled ? "x" : "%"}
              </span>{" "}
            </div>
            <div className="flex flex-col items-end w-2/5 ml-2.5">
              <input
                type="text"
                step="any"
                onBlur={handleSubmit}
                onChange={(e) => handleChange(e)}
                value={
                  inputValue != "" && inputValue != desiredbalance.toString()
                    ? inputValue
                    : isToggled
                    ? Math.round(Number((balance / 100) * currentValue * 100)) /
                      100
                    : Math.round(Number(balance) * 100) / 100
                }
                className="bg-gray w-full rounded-md pl-2 p1 h-6"
              />
              <p className="flex flex-row justify-end h-7 w-32 items-center text-icongray">
                ≈{" "}
                {isToggled
                  ? `${formatValue(balance)} %`
                  : formatCurrency((balance / 100) * currentValue)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast.active === true ? (
        <div className="rounded-md text-red text-xs ml-1.5 h-7  ">
          {" "}
          {toast.title}
        </div>
      ) : null}
    </div>
  );
};
