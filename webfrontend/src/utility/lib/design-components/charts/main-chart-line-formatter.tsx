import "chartjs-adapter-date-fns";
import {
  icongray,
  bitcoinYellow,
  ethereumBlue,
  flyzerBlue,
  chartBgColors,
  black,
  white,
} from "../../helpers/colors";
import { formatCurrency } from "../../helpers/helper-functions";
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
  TimeScale,
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
  Filler,
  TimeScale
);

export const formatMainLineData = (
  processedQueryData: any,
  timeframe: {
    timeframe: string;
    timeunit: any;
  },
  comparators: { costbasis: boolean; btc: boolean; eth: boolean },
  scope: string
): { data: any; config: ChartOptions<"line"> } => {
  const thirdDataSet =
    comparators.eth === true && scope === "development"
      ? processedQueryData.map(
          (timestamp: { x: string; y: number[] }) => timestamp.y[2]
        )
      : null;
  const secondDataSet =
    comparators.costbasis === true && scope === "portfoliotimeframes"
      ? processedQueryData.map(
          (timestamp: { x: string; y: number[] }) => timestamp.y[1]
        )
      : comparators.btc === true && scope === "development"
      ? processedQueryData.map(
          (timestamp: { x: string; y: number[] }) => timestamp.y[1]
        )
      : null;
  const portfolioData = processedQueryData.map(
    (timestamp: { x: string; y: number[] }) => timestamp.y[0]
  );
  const timestamps = processedQueryData.map(
    (timestamp: { x: string; y: number }) => timestamp.x
  );

  return {
    data: {
      labels: timestamps,
      datasets: [
        {
          label: scope === "development" ? "change" : "networth",
          data: portfolioData,
          borderColor: scope === "development" ? black : flyzerBlue,
          backgroundColor: (context: any) => {
            if (!context.chart.chartArea) {
              return chartBgColors[2];
            }
            const {
              ctx,
              chartArea: { top, bottom },
            } = context.chart;
            const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
            const colorTranches = 1 / (chartBgColors.length - 1);

            for (let i = 0; i < chartBgColors.length; i++) {
              gradientBg.addColorStop(i * colorTranches, chartBgColors[i]);
            }
            return gradientBg;
          },
          pointRadius: 0,
          fill: scope === "development" ? false : true,
        },
        {
          label: scope === "development" ? "change" : "invest",
          data: secondDataSet,
          borderColor: comparators.btc === true ? bitcoinYellow : icongray,
          pointRadius: 0,
        },
        {
          label: "change",
          data: thirdDataSet,
          borderColor: ethereumBlue,
          pointRadius: 0,
        },
      ],
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: (context) => {
            let tooltipEl = document.getElementById("chartjs-tooltip");

            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.innerHTML = "<table></table>";
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = "0";
              return;
            }

            tooltipEl.classList.remove("above", "below", "no-transform");
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add("no-transform");
            }

            function getBody(bodyItem: any) {
              return bodyItem.lines;
            }

            if (tooltipModel.body) {
              const titleLines = tooltipModel.title || [];
              const bodyLines = tooltipModel.body.map(getBody);

              let innerHtml = "<thead>";

              titleLines.forEach(function () {
                innerHtml += "<tr><th>" + "" + "</th></tr>";
              });
              innerHtml += "</thead><tbody>";

              bodyLines.forEach(function (body, i) {
                console.log("body", body);
                console.log("context", context);
                let keyStyle = "color:" + icongray;
                keyStyle += ";font-weight: 300 !important";
                let style = "background:" + white;
                style += "; color: " + black + ";";
                style +=
                  "font-size: 12px ; display: flex; flex-direction: row; gap: 60px; justify-content: space-between;  ";
                const dataSpan =
                  '<span style="' +
                  style +
                  '">' +
                  `${
                    scope === "development"
                      ? `<p style=${keyStyle}> Change: </p> <p>${body[0].substring(
                          8,
                          12
                        )}%</p>`
                      : `<p style=${keyStyle}> Networth: </p> <p>${formatCurrency(
                          Number(body[0].substring(10, 50).replace(",", ""))
                        )}</p>`
                  }`;
                ("</span>");
                const dateSpan =
                  '<span style="' +
                  style +
                  '">' +
                  `<p style=${keyStyle}>` +
                  ` Date: </p> <p> ${context.tooltip.title[0].substring(
                    0,
                    12
                  )} </p> `;
                ("</span>");
                const timeSpan =
                  '<span style="' +
                  style +
                  '">' +
                  `<p style=${keyStyle}>` +
                  ` Time: </p> <p> ${context.tooltip.title[0].substring(
                    13,
                    26
                  )} </p> `;
                ("</span>");

                innerHtml += "<tr><td>" + dataSpan + "</td></tr>";
                innerHtml += "<tr><td>" + dateSpan + "</td></tr>";
                innerHtml += "<tr><td>" + timeSpan + "</td></tr>";
              });
              innerHtml += "</tbody>";

              let tableRoot = tooltipEl.querySelector("table");

              if (!tableRoot) {
                tableRoot = document.createElement("table");
                tooltipEl.appendChild(tableRoot);
              }

              tableRoot.innerHTML = innerHtml;

              const position = context.chart.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = "1";
              tooltipEl.style.position = "absolute";
              tooltipEl.style.left =
                position.left + window.scrollX + tooltipModel.caretX + "px";
              tooltipEl.style.top =
                position.top + window.scrollY + tooltipModel.caretY + "px";
              tooltipEl.style.display = "flex";
              tooltipEl.style.flexDirection = "row";
              tooltipEl.style.flexWrap = "wrap";
              tooltipEl.style.pointerEvents = "none";
              tooltipEl.style.background = "white"; // White background
              tooltipEl.style.borderRadius = "10px"; // Rounded edges
              tooltipEl.style.padding = "8px"; // Padding inside tooltip
              tooltipEl.style.width = "200px";
              tooltipEl.style.boxShadow = "4px 4px 10px rgba(0, 0, 0, 0.3)"; // Shadow effect
              tooltipEl.style.border = "1px solid rgba(0, 0, 0, 0.1)"; // Optional border
            }
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: timeframe.timeunit,
          },
          ticks: {
            stepSize:
              timeframe.timeframe === "1 hour"
                ? 10
                : timeframe.timeframe === "7 days"
                ? 1
                : timeframe.timeframe === "6 months"
                ? 1
                : timeframe.timeframe === "1 year"
                ? 2
                : timeframe.timeframe === "3 years"
                ? 6
                : 10,
          },
        },
        y: {
          position: "right",
          beginAtZero: true,
        },
      },
    },
  };
};
