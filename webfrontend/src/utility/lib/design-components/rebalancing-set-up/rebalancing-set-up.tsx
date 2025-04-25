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
  const [calcV, setCalcV] = useState<any[]>([
    Math.round(desiredbalance),
    Math.round(Number((desiredbalance / 100) * currentValue * 100)) / 100,
  ]);
  const [printV, setPrintV] = useState<string[]>([
    `${formatValue(calcV[0])}%`,
    `${formatCurrency(calcV[1])}`,
  ]);
  const [toast, setToast] = useState<{
    active: boolean;
    title: string;
  }>({ active: false, title: "" });
  const [isToggled, setToggled] = useState<string>("none");

  if (desiredbalance === null || desiredbalancenumber === null) {
    return (
      <p> Set desired balancing to see your rebalancing statistics here.</p>
    );
  }

  useEffect(() => {
    setPrintV([`${formatValue(calcV[0])}%`, formatCurrency(calcV[1])]);
  }, [calcV]);

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setToast({ active: false, title: "" });
    setToggled("none");
    //Change
    postRebalancing(assetId, calcV[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!/^\d*\.?\d*$/.test(value)) {
      setToast({ active: true, title: "Please type in a number" });
      return;
    }
    if (value.endsWith(".")) {
      isToggled === "value"
        ? setCalcV([
            Math.round((Number(value) / currentValue) * 100 * 100) / 100,
            value,
          ])
        : setCalcV([
            value,
            Math.round(Number((Number(value) / 100) * currentValue * 100)) /
              100,
          ]);
      return;
    }

    const numericValue = Number(value);
    const roundedValue = Math.round(numericValue * 100) / 100;
    console.log("rounded value", roundedValue);
    console.log("calcV", calcV);

    if (roundedValue > currentValue) {
      setToast({
        active: true,
        title: "Your desired balance cannot be larger than the portfolio size.",
      });
    } else if (value.endsWith(".")) {
      isToggled === "value"
        ? setCalcV([
            Math.round((roundedValue / currentValue) * 100 * 100) / 100,
            roundedValue,
          ])
        : setCalcV([
            roundedValue,
            Math.round(Number((Number(value) / 100) * currentValue * 100)) /
              100,
          ]);
    } else if (isToggled === "percentage" && roundedValue > 100) {
      setToast({
        active: true,
        title: "Your desired balance cannot be larger than 100 percent.",
      });
    } else if (isToggled === "value" && value === "") {
      setCalcV([0, 0]);
    } else {
      setToast({ active: false, title: "" });
      isToggled === "value"
        ? setCalcV([
            Math.round((roundedValue / currentValue) * 100 * 100) / 100,
            roundedValue,
          ])
        : setCalcV([
            roundedValue,
            Math.round(Number((roundedValue / 100) * currentValue * 100)) / 100,
          ]);
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
        order: currentbalancenumber > calcV[0] ? 2 : 1,
      },
      {
        label: `Desired: ${printV[0]} ~ ${printV[1]}`,
        data: [calcV[0]],
        backgroundColor: lightBlue,
        borderWidth: 0,
        borderRadius: 7,
        order: currentbalance > calcV[0] ? 1 : 2,
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
            <div className="flex justify-end w-full">
              <input
                type="text"
                step="any"
                onBlur={handleSubmit}
                onChange={(e) => handleChange(e)}
                onClick={() => setToggled("percentage")}
                value={isToggled === "percentage" ? calcV[0] : printV[0]}
                className="bg-gray w-full rounded-md pl-2 p1 h-6"
              />
              <input
                onBlur={handleSubmit}
                onChange={(e) => handleChange(e)}
                onClick={() => setToggled("value")}
                value={isToggled === "value" ? calcV[1] : printV[1]}
                className="bg-gray w-full rounded-md pl-2 p1 h-6"
              />
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
