"use client";

import {
  InfoCards,
  StopLossCards,
  DetailNfts,
  formatCurrency,
} from "../../helpers";
import { SmallErrorSkeleton } from "../../data-fetching";
import logger from "../../logging/logger";
import { Bar } from "react-chartjs-2";
import { RebalancingSetUp } from "../../helpers";
import { chartColors, darkerGray } from "../../helpers/helper-config/colors";
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
interface detailDataProps {
  assetvalue: number;
  currencyvalue: number;
  holdingdistribution: number;
  holdingurl: string;
  id: number;
  name: string;
}

/**
 * `DrDetail` is a React component that displays detailed information
 * for a derivative asset in a rebalancing context. It renders key portfolio
 * metrics and includes a setup section for initiating a rebalance.
 * Navigate to the component:
 * 1. Navigate to assetdistribution.
 * 2. Ensure, that you are in the currency tab, than click on expand detail arrow.
 * 3. The first tab of the popup shows everything, the DrDetail component is doing.
 *
 * @param data - The object containing various rebalancing-related properties for an asset:
 * - `averageentryprice`: The average price at which the asset was purchased.
 * - `marketprice`: The current market price of the asset.
 * - `averageexitprice`: The average price at which the asset was sold or exited.
 * - `totalcost`: The total cost basis of the asset in the portfolio.
 * - `desiredbalance`: The target allocation or balance for rebalancing.
 * - `currentbalance`: The current allocation or balance in the portfolio.
 * - `assetId`: Identifier for the asset, passed to the `RebalancingSetUp` component.
 *
 * @param currentValue - The current value of the asset, passed to the rebalancing setup logic.
 *
 * @returns A layout consisting of:
 * - A line chart, visualizing the asset change in a picked timeframe.
 * - A sidebar of rebalancing metric cards (like entry price, market price, etc.)
 * - A `RebalancingSetUp` component to allow adjusting target and current balances
 *
 * @remarks
 * - Uses `formatCurrency()` to format all monetary values.
 * - Layout adjusts responsively using utility classes for different screen sizes.
 * - The component expects `data` to contain properly structured financial information.
 *
 * @example
 * ```tsx
 * <DrDetail
 *   data={{
 *     averageentryprice: 100,
 *     marketprice: 120,
 *     averageexitprice: 110,
 *     totalcost: 1000,
 *     desiredbalance: 50,
 *     currentbalance: 45,
 *     assetId: 1
 *   }}
 *   currentValue={115}
 * />
 * ```
 */
export const DrDetail = ({
  data,
  currentValue,
}: {
  data: any;
  currentValue: number;
}) => {
  const portfolioRebalancingData = [
    { header: "Average Entry Price", data: data.averageentryprice },
    { header: "Market Price", data: data.marketprice },
    { header: "Average Exit Price", data: data.averageexitprice },
    { header: "Total Cost", data: data.totalcost },
  ];

  console.log("This is the data", data)

  const initialData = {
    desiredbalance: data.desiredbalance,
    currentbalance: data.currentbalance,
  };
  logger.info("DrDetail called", { initialData: initialData });


  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row w-full h-4/6  ">
        <div className="card h-full w-5/6"> </div>
        <div className="flex flex-col h-full w-1/6">
          {portfolioRebalancingData.map((cards: any) => {
            return (
              <div
                role="Detail Rebalancing Cards"
                className={`flex flex-col border border-black justify-center card mb-2.5 py-3 px-3 w-full sm:h-20 md:h-20 lp:h-16 lg:h-16 xl:h-16`}
                key={cards.header}
              >
                <p
                  className={
                    "flex flex-row items-stretch text-sm sm:text-xs md:text-xs lp:text-xs text-icongray mb-1"
                  }
                >
                  {" "}
                  {cards.header}{" "}
                </p>
                <p className="font-semibold mr-3 text-sm sm:text-xs md:text-xs lp:text-xs">
                  {" "}
                  {formatCurrency(cards.data)}{" "}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" pr-3 pt-5 md:w-1/2 sm:w-1/2 lg:w-1/2 lp:w-1/2 h-2/6">
        <RebalancingSetUp
          data={initialData}
          assetId={data.assetId}
          currentValue={currentValue}
        />
      </div>
    </div>
  );
};

/**
 * `buildBar` generates a horizontal stacked bar chart configuration
 * compatible with Chart.js, based on asset distribution data.
 * The build bar function is just called once in the DisDetail, but because of seperation of concerns it is extracted from the DisDetail Component.
 *
 * @param cardData - An array of objects representing distribution entries.
 *   Each object should include:
 *   - `name`: Name of the asset (used to label "Others")
 *   - `assetvalue`: The value of the asset used for calculating its share
 * @param totalAmount - The total value used to compute percentage distribution
 *
 * @returns An object with:
 * - `data`: A `ChartData<"bar">` object structured for horizontal stacked bars
 * - `options`: A `ChartOptions<"bar">` object with chart styling, scale, and interaction settings
 *
 * @remarks
 * - Each bar's width corresponds to its percentage share of the total amount.
 * - "Others" entries are rendered with a fixed `darkerGray` color.
 * - All bars have consistent styling including border radius and no tooltip or legend.
 * - The chart is horizontal (`indexAxis: "y"`) and responsive.
 *
 * @example
 * ```ts
 * const chart = buildBar([
 *   { name: "BTC", assetvalue: 500 },
 *   { name: "ETH", assetvalue: 300 },
 *   { name: "Others", assetvalue: 200 }
 * ], 1000);
 *
 * <Bar data={chart.data} options={chart.options} />
 * ```
 */
export const buildBar = (cardData: any[], totalAmount: number) => {
  const backgroundColors = chartColors;
  const cardDataFormatted = cardData.map((disObj: any, index: number) => {
    return {
      label: disObj.name === "Others" ? "Others" : "",
      data: [Number(disObj.assetvalue / totalAmount) * 100],
      backgroundColor:
        disObj.name === "Others"
          ? darkerGray
          : backgroundColors[index % backgroundColors.length],
      borderColor: "rgba(0, 26, 66, 1)",
      borderWidth: 0,
      borderRadius: 7,
    };
  });

  logger.info("buildBar called");

  const datasets: any[] = [];

  if (cardDataFormatted.length != 0) {
    datasets.push(cardDataFormatted);
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
  logger.debug("buildBar", { data: data, options: options });
  return { data, options };
};

/**
 * `DisDetail` is a React component that visualizes distribution data in a bar chart and info card format.
 * You can see this component in action following this route:
 * 1. Navigate to asset-distribution.
 * 2. Click on the expand arrow in one of the rows.
 * 3. Navigate to asset-groups or holdings.
 * It also conditionally renders stop loss cards and a detailed view for active distribution items.
 *
 * @param detailData - An array of distribution data objects. These represent individual entries to be visualized.
 * @param tableStatus - A string indicating the table context (e.g., `"nft"` or `"derivative"`), used to determine sorting and rendering behavior.
 * @param totalAmount - The total value (asset or currency) used for calculating the relative distribution of each entry.
 * @param assetname - The name of the asset associated with the distribution data, passed to info cards.
 * @param changeActiveDisObj - A function used to update the currently active distribution object (e.g., on user interaction).
 * @param activeDisObj - The ID of the currently active distribution object, or `null` if none is active.
 * @param sltp - Optional object containing stop-loss and take-profit configurations:
 * - `sl`: Stop-loss value (nullable)
 * - `tp`: Take-profit value (nullable)
 * - `partial`: An array of partial SL/TP configurations, each with `id`, `quantity`, and optional `sl`/`tp`
 *
 * @returns A composite component consisting of:
 * - A bar chart representing the distribution
 * - Optional stop-loss cards (for "derivative" status)
 * - Info cards summarizing each distribution entry
 * - A detailed NFT section if an active distribution is selected
 *
 * @remarks
 * - If no `detailData` is provided, it shows a fallback error skeleton.
 * - Entries are sorted by distribution size before rendering.
 * - Data is split between a main set and an "Others" group when exceeding screen/display limits.
 * - Responsive layout adapts based on `window.innerWidth`.
 *
 * @example
 * ```tsx
 * <DisDetail
 *   detailData={[{ id: 1, assetvalue: 100, currencyvalue: 50, name: 'BTC' }]}
 *   tableStatus="nft"
 *   totalAmount={1000}
 *   assetname="Bitcoin"
 *   changeActiveDisObj={(id) => console.log(id)}
 *   activeDisObj={1}
 * />
 * ```
 */
export const DisDetail = ({
  detailData,
  tableStatus,
  totalAmount,
  assetname,
  changeActiveDisObj,
  activeDisObj,
  sltp,
}: {
  detailData: detailDataProps[];
  tableStatus: string | undefined;
  totalAmount: number;
  assetname: string | undefined;
  changeActiveDisObj: Function;
  activeDisObj: number | null;
  sltp?: {
    sl: number | null;
    tp: number | null;
    partial: {
      id: number;
      quantity: number;
      tp: number | null;
      sl: number | null;
    }[];
  };
}) => {
  logger.info("DisDetail is called for:", tableStatus);

  //Check for entries and return Error Skeleton if there are no Entries
  if (detailData.length === 0) {
    logger.error("DisDetailData: no detail data in disdetail component");
    return <SmallErrorSkeleton />;
  }

  //Sort Entries for the Barchart
  const sortedEntries = detailData.sort((prevDisObj, thisDisObj) =>
    Number(
      (tableStatus === "nft"
        ? prevDisObj.currencyvalue
        : prevDisObj.assetvalue) / totalAmount
    ) *
      100 <
    Number(
      (tableStatus === "nft"
        ? thisDisObj.currencyvalue
        : thisDisObj.assetvalue) / totalAmount
    ) *
      100
      ? 1
      : Number(
          (tableStatus === "nft"
            ? prevDisObj.currencyvalue
            : prevDisObj.assetvalue) / totalAmount
        ) *
          100 >
        Number(
          (tableStatus === "nft"
            ? thisDisObj.currencyvalue
            : thisDisObj.assetvalue) / totalAmount
        ) *
          100
      ? -1
      : 0
  );
  logger.debug("DisDetail: sorted entries for bar chart", sortedEntries);

  //Categorize items, based on index position and screen position.
  let mainDisObj: any[] = [];
  let otherDisObj: any[] = [];

  const widthProp = window.innerWidth < 1100 ? 9 : 14;

  if (detailData.length > widthProp + 1) {
    mainDisObj.push(sortedEntries.slice(0, widthProp));
    otherDisObj.push(sortedEntries.slice(widthProp));
  } else {
    mainDisObj.push(sortedEntries);
  }

  //Add properties to the objects (other => to determine the background color, distribution=> to avoid calculations everytime)
  mainDisObj = mainDisObj.map((disObj) =>
    disObj.map((obj: any) => {
      return {
        ...obj,
        other: false,
        distribution: Number(obj.assetvalue / totalAmount) * 100,
      };
    })
  );
  otherDisObj = otherDisObj.map((disObj) =>
    disObj.map((obj: any) => ({
      ...obj,
      other: true,
      distribution: Number(obj.assetvalue / totalAmount) * 100,
    }))
  );

  //Wrapping all elements in the treshold in one object which can be displayed by the bar chart.
  const otherObj = [
    otherDisObj.length > 0
      ? otherDisObj[0].reduce(
          (acc: any, curr: any) => {
            acc.assetvalue += curr.assetvalue;
            acc.currencyvalue += curr.currencyvalue;
            return acc;
          },
          {
            name: "Others",
            assetvalue: 0,
            currencyvalue: 0,
          }
        )
      : null,
  ];
  logger.debug("DisDetail: treshold for barchart", otherObj);

  // Generating data, which are used for the infocards.
  const cardData =
    detailData.length > widthProp + 1
      ? [...mainDisObj, otherDisObj].flat()
      : mainDisObj.flat();

  logger.debug("DisDetail: generated card data", cardData);

  // Generating data, which are used for the bar-chart.
  const barData: any = buildBar(
    detailData.length > widthProp + 1
      ? [...mainDisObj, otherObj].flat()
      : mainDisObj.flat(),
    totalAmount
  );
  logger.debug("DisDetail: generated bar data", barData);

  logger.debug("DisDetail: Rendering InfoCards, DetailNFTS and StopLossCards");
  return (
    <>
      <div className="flex flex-col justify-start">
        <div className="flex flex-row  mb-5 pb-4 flex-wrap">
          {tableStatus === "derivative" ? <StopLossCards sltp={sltp} /> : null}
          <div className="overflow-y-scroll w-full">
            <div className="w-full h-11 flex justify-center items-center mb-4 flex-wrap">
              <Bar data={barData.data} options={barData.options} />
            </div>
          </div>
          <div className="flex flex-row w-full flex-wrap gap-3">
            <InfoCards
              data={cardData}
              tableStatus={tableStatus}
              barData={barData}
              assetname={assetname}
              changeActiveDisObj={(activeDisObj: number | null) =>
                changeActiveDisObj(activeDisObj)
              }
              activeDisObj={activeDisObj}
            />
          </div>
        </div>
        {activeDisObj != null ? (
          <DetailNfts
            data={detailData.find((disObj) => activeDisObj === disObj.id)}
          />
        ) : null}
      </div>
    </>
  );
};
