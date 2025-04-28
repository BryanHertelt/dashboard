"use client";

import { formatCurrency, formatValue } from "../helpers/helper-functions";
import { ExposeNfts } from "../helpers/nft-container";
import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { RebalancingSetUp } from "../design-components/rebalancing-set-up/rebalancing-set-up";
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

import { HoldingLogoImageContainer } from "../helpers/image-container";
import { chartColors, darkerGray } from "../helpers/colors";

interface detailDataProps {
  assetvalue: number;
  currencyvalue: number;
  holdingdistribution: number;
  holdingurl: string;
  id: number;
  name: string;
}

const InfoCards = ({
  data,
  tableStatus,
  designComponents,
  barData,
  assetname,
}: {
  data: any;
  tableStatus: string | undefined;
  designComponents: { headerdesign: string; valuedesign: string };
  barData: { data: any; options: any };
  assetname: string | undefined;
}) => {
  {
    return data.map((disObj: any, index: number) => {
      return (
        <div
          className={` flex flex-col flex-grow justify-around card mb-2 w-1/4 py-3 px-3 sm:h-20 md:h-20 lp:h-16 lg:h-16 xl:h-16`}
          key={disObj.id}
        >
          <div className="flex flex-row justify-between">
            <div className={designComponents.headerdesign}>
              <div className="mr-1.5">
                <HoldingLogoImageContainer
                  url={disObj.url}
                  alt={`${disObj.name} Logo in Asset Detail Component`}
                  placeholder={"HL"}
                />{" "}
              </div>{" "}
              {disObj.name}
            </div>
            <span
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: Array.isArray(
                  barData.data.datasets[index].backgroundColor
                )
                  ? barData.data.datasets[index].backgroundColor[0]
                  : barData.data.datasets[index].backgroundColor,
              }}
            />
          </div>
          <div className="flex flex-row align-middle">
            {tableStatus === "cryptocurrency" ||
            tableStatus === "derivative" ? (
              <>
                <div
                  className={`flex flex-row ${designComponents.valuedesign}`}
                >
                  <p className="mr-1">
                    {formatValue(disObj.assetvalue)} {assetname}{" "}
                  </p>
                  <p
                    className={`${designComponents.headerdesign} border-r-2 mr-1 pr-1 font-normal`}
                  >
                    ~ {formatCurrency(disObj.currencyvalue)}
                  </p>{" "}
                  <p className={`${designComponents.headerdesign} font-normal`}>
                    {" "}
                    {formatValue(Number(barData.data.datasets[index].data))}%
                  </p>
                </div>{" "}
              </>
            ) : (
              <>
                <p className={designComponents.valuedesign}>
                  {" "}
                  {disObj.assetvalue} NFTs{" "}
                </p>
                <p
                  className={`${designComponents.headerdesign} border-r-2 pr-1 mr-1`}
                >
                  ~ {formatValue(disObj.currencyvalue)} ETH
                </p>
                <p className={`${designComponents.headerdesign} font-normal`}>
                  {" "}
                  {formatValue(Number(barData.data.datasets[index].data))}%
                </p>
              </>
            )}
          </div>
        </div>
      );
    });
  }
};

const buildBar = (mainDisObj: any, otherDisObj: any, totalAmount: number) => {
  const backgroundColors = chartColors;
  const mainDisObjFormatted = mainDisObj.map((disObj: any, index: number) => {
    return {
      label: ` `,
      data: [Number(disObj.assetvalue / totalAmount) * 100],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      borderColor: "rgba(0, 26, 66, 1)",
      borderWidth: 0,
      borderRadius: 7,
    };
  });

  const otherDisObjFormatted = {
    label: `Other Holdings: ${formatValue(
      otherDisObj.reduce(
        (acc: any, [holdingdistribution]: any) => acc + holdingdistribution,
        0
      )
    )}% ~ ${formatCurrency(
      otherDisObj.reduce(
        (acc: any, [, holdingsvalue]: any) => acc + holdingsvalue,
        0
      )
    )} `,
    data: [
      Number(
        formatValue(
          otherDisObj.reduce(
            (acc: any, [holdingdistribution]: any) => acc + holdingdistribution,
            0
          )
        )
      ),
    ],
    backgroundColor: darkerGray,
    borderRadius: 7,
  };

  const datasets: any[] = [];

  if (otherDisObj.length != 0 && mainDisObj.length != 0) {
    datasets.push(mainDisObjFormatted, otherDisObjFormatted);
  } else if (otherDisObj.length != 0 && mainDisObj.length == 0) {
    datasets.push(otherDisObjFormatted);
  } else if (otherDisObj.length == 0 && mainDisObj.length != 0) {
    datasets.push(mainDisObjFormatted);
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

export const DrDetail = ({
  designComponents,
  data,
  currentValue,
}: {
  designComponents: {
    carddesign: string;
    headerdesign: string;
    valuedesign: string;
  };
  data: any;
  currentValue: number;
}) => {
  const portfolioRebalancingData = [
    { header: "Average Entry Price", data: data.averageentryprice },
    { header: "Market Price", data: data.marketprice },
    { header: "Average Exit Price", data: data.averageexitprice },
    { header: "Total Cost", data: data.totalcost },
  ];

  const barchartData = {
    desiredbalance: data.desiredbalance,
    currentbalance: data.currentbalance,
    desiredbalancenumber: data.desiredbalancenumber,
    currentbalancenumber: data.currentbalancenumber,
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
                className={`${designComponents.carddesign} justify-center`}
                key={cards.header}
              >
                <p className={designComponents.headerdesign}>
                  {" "}
                  {cards.header}{" "}
                </p>
                <p className={designComponents.valuedesign}>
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
          data={barchartData}
          assetId={data.assetId}
          theme={"details"}
          currentValue={currentValue}
        />
      </div>
    </div>
  );
};

export const Detail = ({
  detailData,
  tableStatus,
  totalAmount,
  assetname,
}: {
  detailData: detailDataProps[];
  tableStatus: string | undefined;
  totalAmount: number;
  assetname: string | undefined;
}) => {
  // Proceed with building the HdDetail component to 1. render based on tableStatus 2. give the right props at datatable
  /**
   * Props needed: 1. data object containing: assetname(assetabbr), holdingdata , 2. tableStatus
   */
  const designComponents = useMemo(
    () => ({
      headerdesign:
        "flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray",
      valuedesign:
        "font-semibold text-base mr-3 text-sm sm:text-xs md:text-xs lp:text-xs",
    }),
    []
  );
  const mainDisObj: any[] = [];
  const otherDisObj: any[] = [];

  detailData.map((disObj: any) => {
    Number(disObj.assetvalue / totalAmount) * 100 < 5
      ? otherDisObj.push([disObj.holdingdistribution, disObj.currencyvalue])
      : mainDisObj.push(disObj);
  });

  const barData: any = buildBar(mainDisObj, otherDisObj, totalAmount);

  return (
    <>
      <div className="flex flex-col justify-start">
        <div className="flex flex-row  mb-5 pb-4 flex-wrap">
          <div className="overflow-y-scroll w-full">
            <div className="w-1/2 h-11 flex justify-center items-center mb-4 flex-wrap">
              <Bar data={barData.data} options={barData.options} />
            </div>
          </div>
          <div className="flex flex-row w-full flex-wrap gap-3">
            <InfoCards
              data={mainDisObj}
              tableStatus={tableStatus}
              designComponents={designComponents}
              barData={barData}
              assetname={assetname}
            />
          </div>
        </div>
        {/** 
        {tableStatus === "nft" ? <ExposeNfts data={activeHolding} /> : null}
        */}
      </div>
    </>
  );
};
