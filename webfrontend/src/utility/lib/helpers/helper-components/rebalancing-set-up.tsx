"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatValue } from "../../helpers";
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

import { postRebalancing } from "../../data-fetching";
import {
  flyzerBlue,
  lightBlue,
  darkerGray,
} from "../../helpers/helper-config/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * RebalancingSetUp Component
 *
 * Displays a bar chart comparing the current vs desired portfolio balance for a given asset.
 * Allows the user to input and submit a new desired balance either as a percentage or a value.
 *
 * Navigation:
 * 1. Navigate to asset distribution.
 * 2. Select crypto currrency in asset table.
 * 3. Expand detail.
 * 4. Navigate to details (should be the default value here)
 * 5. Look beneath the asset chart.
 *
 * ### Props:
 * @param data - An object containing balance details.
 * @param data.currentbalance - The current balance percentage of the asset.
 * @param data.desiredbalance - The desired balance percentage to be set.
 * @param currentValue - The total value of the portfolio for calculation reference.
 * @param assetId - Unique identifier of the asset for which rebalancing is set.
 *
 * ### Behavior:
 * - Users can toggle between inputting desired balance as a percentage or absolute value.
 * - Displays formatted percentage and currency values.
 * - Prevents invalid input (e.g., values exceeding portfolio size or 100%).
 * - Submits rebalancing data using `postRebalancing` when inputs lose focus.
 * - Provides inline error messages for invalid values.
 * - Visualizes current, desired, and total portfolio balance with a responsive horizontal bar chart.
 *
 * ### Dependencies:
 * - Uses `Chart.js` via `react-chartjs-2` to render the bar chart.
 * - Depends on formatting helpers: `formatCurrency`, `formatValue`.
 * - Communicates updates via the `postRebalancing` API helper.
 */
export const RebalancingSetUp = ({
  data,
  currentValue,
  assetId,
}: {
  data: {
    currentbalance: number;
    desiredbalance: number;
  };
  assetId: string | number;
  currentValue: number;
}) => {
  const { desiredbalance, currentbalance } = data;
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

  useEffect(() => {
    setPrintV([`${formatValue(calcV[0])}%`, formatCurrency(calcV[1])]);
  }, [calcV]);

  if (desiredbalance === null) {
    return (
      <p> Set desired balancing to see your rebalancing statistics here.</p>
    );
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setToast({ active: false, title: "" });
    setToggled("none");
    postRebalancing(assetId, calcV[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

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

    if (roundedValue > currentValue) {
      setToast({
        active: true,
        title: "Your desired balance cannot be larger than the portfolio size.",
      });
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

  const currBalance = (currentbalance / 100) * currentValue;

  const barData: ChartData<"bar"> = {
    labels: [""],
    datasets: [
      {
        label: `Current: ${formatValue(currentbalance)}% ~ ${formatCurrency(
          currBalance
        )}`,
        data: [currentbalance],
        backgroundColor: flyzerBlue,
        borderWidth: 0,
        borderRadius: 7,
        order: currBalance > calcV[0] ? 2 : 1,
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
    <div className="flex justify-center items-center flex-wrap">
      <div className="flex flex-row w-full justify-start h-11 items-center">
        <div className="h-9 w-7/12">
          <Bar data={barData} options={options} />
        </div>
        <div className="flex flex-row justify-end w-4/12 items-center ml-5">
          <div className="flex justify-end w-full">
            <input
              aria-label="inputPercentage"
              type="text"
              step="any"
              onBlur={handleSubmit}
              onChange={(e) => handleChange(e)}
              onClick={() => setToggled("percentage")}
              value={isToggled === "percentage" ? calcV[0] : printV[0]}
              className={`${
                isToggled === "percentage"
                  ? "bg-gray text-black"
                  : "text-icongray bg-transparent"
              } w-5/12 rounded-md pl-2 p1 h-6 text-xs focus:outline-none focus:ring-0 focus:border-transparent`}
            />
            <input
              aria-label="inputAbsolute"
              onBlur={handleSubmit}
              onChange={(e) => handleChange(e)}
              onClick={() => setToggled("value")}
              value={isToggled === "value" ? calcV[1] : printV[1]}
              className={`${
                isToggled === "value"
                  ? "bg-gray text-black"
                  : "text-icongray bg-transparent"
              } w-full rounded-md pl-2 p1 h-6 text-xs focus:outline-none focus:ring-0 focus:border-transparent`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start w-full">
        <div className="flex flex-row">
          <div className="flex flex-col text-center mt-2 w-3/5">
            {barData.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-sm mb-3"
                  style={{
                    backgroundColor: dataset.backgroundColor as string,
                  }}
                ></span>
                <span className="text-xs text-icongray mb-3 text-start">
                  {dataset.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {toast.active === true ? (
          <div className="rounded-md text-red text-xs ml-1.5 h-7  ">
            {" "}
            {toast.title}
          </div>
        ) : null}
      </div>
    </div>
  );
};
