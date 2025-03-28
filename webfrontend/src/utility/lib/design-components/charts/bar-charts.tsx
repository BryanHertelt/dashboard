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

export const HoldingBarChart = (props: any) => {
  const backgroundColors = [
    "rgba(0, 92, 211, 1)",
    "rgba(54, 134, 220, 1)",
    "rgba(18, 152, 230, 1)",
    "rgba(0, 176, 247, 1)",
    "rgba(0, 198, 251, 1)",
    "rgba(113, 225, 255, 1)",
    "rgba(162, 220, 255, 1)",
    "rgba(203, 235, 255, 1)",
  ];

  const mainHoldings: any[] = [];
  const otherHoldings: any[] = [];

  props.data.map((holding: any) => {
    holding.holdingdistribution < 5
      ? otherHoldings.push([holding.holdingdistribution, holding.currencyvalue])
      : mainHoldings.push(holding);
  });

  const mainHoldingsFormatted = mainHoldings.map(
    (holding: any, index: number) => {
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
    backgroundColor: "#7A7A7A",
    borderWidth: 0,
    borderRadius: 7,
  };

  const datasets: any[] = [];

  // don't forget to test this:
  if (otherHoldings.length != 0 && mainHoldings.length != 0) {
    datasets.push(mainHoldingsFormatted, otherHoldingsFormatted);
  } else if (otherHoldings.length != 0 && mainHoldings.length == 0) {
    datasets.push(otherHoldingsFormatted);
  } else if (otherHoldings.length == 0 && mainHoldings.length != 0) {
    datasets.push(mainHoldingsFormatted);
  } else {
    console.error(
      "No holding data available in asset detailcomponent> asset details> holding chart."
    );
    return <p> No chart data available right now. </p>;
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
                ></span>
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

export const BarChartRebalancing = (props: any) => {
  console.log("props", props);
  const {
    desiredbalance,
    currentbalance,
    desiredbalancenumber,
    currentbalancenumber,
  } = props.data;

  if (desiredbalance === null || desiredbalancenumber === null) {
    return (
      <p> Set desired balancing to see your rebalancing statistics here.</p>
    );
  }

  const data: ChartData<"bar"> = {
    labels: [""],
    datasets: [
      {
        label: `Current: ${formatValue(currentbalance)}% ~ ${formatCurrency(
          currentbalancenumber
        )}`,
        data: [currentbalance],
        backgroundColor: "rgba(0, 26, 66, 1)",
        borderColor: "rgba(0, 26, 66, 1)",
        borderWidth: 1,
        borderRadius: 7,
      },
      {
        label: `Desired: ${formatValue(desiredbalance)}% ~ ${formatCurrency(
          desiredbalancenumber
        )}`,
        data: [desiredbalance],
        backgroundColor: "rgba(122, 122, 122, 1)",
        borderColor: "rgba(122, 122, 122, 1)",
        borderWidth: 1,
        borderRadius: {
          topLeft: 7,
          topRight: 7,
          bottomLeft: 7,
          bottomRight: 7,
        },
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
        labels: {
          boxWidth: 15,
        },
        align: "start",
        display: false,
      },
    },
  };
  return (
    <div className="w-full h-11 flex justify-center items-center mr-5 flex-wrap">
      <Bar data={data} options={options} />
      <div className="flex flex-col justify-start w-full">
        <div className="flex flex-col text-center mt-2">
          {data.datasets.map((dataset, index) => (
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
