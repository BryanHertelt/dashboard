import { formatCurrency, formatValue } from "../helpers";
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
  ChartDataset,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { chartColors, darkerGray } from "../helpers/helper-config/colors";

interface holdingProps {
  assetvalue: number;
  currencyvalue: number;
  holdingdistribution: number;
  holdingurl: string;
  id: number;
  name: string;
}
export const HoldingBarChart = ({ barData }: { barData: holdingProps[] }) => {
  const backgroundColors = chartColors;

  const mainHoldings: holdingProps[] = [];
  const otherHoldings: [number, number][] = [];

  barData.forEach((holding: holdingProps) => {
    if (holding.holdingdistribution < 5) {
      otherHoldings.push([holding.holdingdistribution, holding.currencyvalue]);
    } else {
      mainHoldings.push(holding);
    }
  });

  const mainHoldingsFormatted = mainHoldings.map(
    (holding: holdingProps, index: number) => {
      return {
        label: `${holding.name}: ${formatValue(
          holding.holdingdistribution
        )}% ~ ${formatCurrency(holding.currencyvalue)} `,
        data: [holding.holdingdistribution],
        backgroundColor: backgroundColors[index % backgroundColors.length],
        borderColor: "rgba(0, 26, 66, 1)",
        borderWidth: 0,
        borderRadius: 7,
      };
    }
  );

  const otherHoldingsFormatted = {
    label: `Other Holdings: ${formatValue(
      otherHoldings.reduce(
        (acc, [holdingdistribution]) => acc + holdingdistribution,
        0
      )
    )}% ~ ${formatCurrency(
      otherHoldings.reduce((acc, [, holdingsvalue]) => acc + holdingsvalue, 0)
    )} `,
    data: [
      Number(
        formatValue(
          otherHoldings.reduce(
            (acc, [holdingdistribution]) => acc + holdingdistribution,
            0
          )
        )
      ),
    ],
    backgroundColor: darkerGray,
    borderRadius: 7,
  };

  const datasets: ChartDataset<"bar">[] = [];

  if (otherHoldings.length != 0 && mainHoldings.length != 0) {
    datasets.push(...mainHoldingsFormatted, otherHoldingsFormatted);
  } else if (otherHoldings.length != 0 && mainHoldings.length == 0) {
    datasets.push(otherHoldingsFormatted);
  } else if (otherHoldings.length == 0 && mainHoldings.length != 0) {
    datasets.push(...mainHoldingsFormatted);
  } else {
    console.error(
      "No holding data available in asset detailcomponent> asset details> holding chart."
    );
    return <p> No chart data available...</p>;
  }

  const data: ChartData<"bar"> = {
    labels: [""],
    datasets: datasets.flat(),
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    aspectRatio: 2,
    scales: {
      x: { stacked: true, display: false },
      y: { stacked: true, display: false },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 15 },
        align: "start",
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="w-11/12 ml-5 h-11 flex justify-center items-center mr-5 flex-wrap">
      <Bar data={data} options={options} />
      <div className="flex flex-col justify-start w-full">
        <div className="flex flex-col text-center mt-2">
          {data.datasets.map((dataset, index) => {
            return (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-sm mb-3"
                  style={{
                    backgroundColor: Array.isArray(dataset.backgroundColor)
                      ? dataset.backgroundColor[0]
                      : dataset.backgroundColor,
                  }}
                />
                <span className="text-xs text-icongray mb-3">
                  {dataset.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
