"use client";

import { formatCurrency } from "../helpers/helper-functions";
import {
  InfoCards,
  StopLossCards,
  DetailNfts,
} from "../helpers/helper-detail-table";
import { ErrorSkeleton } from "../datafetching/loading-skeleton";
import { Bar } from "react-chartjs-2";
import { RebalancingSetUp } from "../design-components/rebalancing-set-up/rebalancing-set-up";
import { chartColors, darkerGray } from "../helpers/colors";
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

  const initialData = {
    desiredbalance: data.desiredbalance,
    currentbalance: data.currentbalance,
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row w-full h-4/6  ">
        <div className="card h-full w-5/6"> </div>
        <div className="flex flex-col h-full w-1/6">
          {portfolioRebalancingData.map((cards: any) => {
            return (
              <div
                role="Detail Rebalancing Cards"
                className={`flex flex-col justify-center card mb-2.5 py-3 px-3 w-full sm:h-20 md:h-20 lp:h-16 lg:h-16 xl:h-16`}
                key={cards.header}
              >
                <p
                  className={
                    "flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray"
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

  const datasets: any[] = [];

  if (cardDataFormatted.length != 0) {
    datasets.push(cardDataFormatted);
  } else {
    console.error(
      "No data available in asset detailcomponent> asset details> holding chart."
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
  return { data, options };
};

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
  //Check for entries and return Error Skeleton if there are no Entries
  if (detailData.length === 0) {
    return <ErrorSkeleton />;
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

  // Generating data, which are used for the infocards.
  const cardData =
    detailData.length > widthProp + 1
      ? [...mainDisObj, otherDisObj].flat()
      : mainDisObj.flat();

  // Generating data, which are used for the bar-chart.
  const barData: any = buildBar(
    detailData.length > widthProp + 1
      ? [...mainDisObj, otherObj].flat()
      : mainDisObj.flat(),
    totalAmount
  );

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
