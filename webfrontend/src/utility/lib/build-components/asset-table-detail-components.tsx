"use client";

import { formatCurrency, formatValue } from "../helpers/helper-functions";
import { ExposeNfts } from "../helpers/nft-container";
import { useState, useMemo, useEffect } from "react";
import { NftsIcon } from "../../../../public/images";
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
  changeActiveDisObj,
  activeDisObj,
}: {
  data: any[];
  tableStatus: string | undefined;
  designComponents: { headerdesign: string; valuedesign: string };
  barData: { data: any; options: any };
  assetname: string | undefined;
  changeActiveDisObj: Function;
  activeDisObj: number | null;
}) => {
  return data.map((disObj: any, index: number) => {
    const active =
      tableStatus != "nft" || disObj.name === "Others"
        ? "hidden"
        : disObj.id === activeDisObj
        ? "text-blue"
        : "text-icongray";

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
          <div className="flex flex-row items-center">
            <button
              className={` ${active} mr-1 text-base`}
              onClick={() =>
                activeDisObj === disObj.id
                  ? changeActiveDisObj(null)
                  : changeActiveDisObj(disObj.id)
              }
            >
              {" "}
              <NftsIcon />{" "}
            </button>
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
        </div>
        <div className="flex flex-row align-middle">
          <>
            <div className={`flex flex-row ${designComponents.valuedesign}`}>
              <p className="mr-1">
                {tableStatus === "nft"
                  ? `${disObj.assetvalue} NFTs`
                  : `${formatValue(disObj.assetvalue)} ${assetname}`}
              </p>
              <p
                className={`${designComponents.headerdesign} border-r-2 mr-1 pr-1 font-normal`}
              >
                ~{" "}
                {tableStatus === "nft"
                  ? `${formatValue(disObj.currencyvalue)} ETH`
                  : formatCurrency(disObj.currencyvalue)}
              </p>{" "}
              <p className={`${designComponents.headerdesign} font-normal`}>
                {" "}
                {formatValue(Number(barData.data.datasets[index].data))}%
              </p>
            </div>{" "}
          </>
        </div>
      </div>
    );
  });
};

const buildBar = (cardData: any[], totalAmount: number) => {
  const backgroundColors = chartColors;
  const cardDataFormatted = cardData.map((disObj: any, index: number) => {
    return {
      label: ` `,
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

const DerivativeComponent = ({
  sltp,
}: {
  sltp:
    | {
        sl: number | null;
        tp: number | null;
        partial: {
          id: number;
          quantity: number;
          tp: number | null;
          sl: number | null;
        }[];
      }
    | undefined;
}) => {
  return (
    <div className="w-full">
      <span className="flex flex-row gap-2 mb-2 ">
        {" "}
        SL/TP:{" "}
        <p className="pl-1 text-red">
          {" "}
          {formatValue(Number(sltp?.sl === null ? NaN : Number(sltp?.sl)))} %
        </p>
        /{" "}
        <p className="text-green">
          {formatValue(Number(sltp?.tp === null ? NaN : Number(sltp?.tp)))}%{" "}
        </p>
      </span>
      <p className="mb-2"> Partial SL/TP: </p>
      <div className="flex flex-row gap-3 overlflow-x-scroll w-full mb-2">
        {sltp?.partial.map((parEl) => {
          console.log("parEl", parEl.quantity);
          return (
            <div
              className="flex flex-col bg-gray px-3 pt-3 pb-2 rounded-md w-1/5"
              key={parEl.id}
            >
              <div className="flex flex-row ">
                <span className="flex flex-col justify-center items-start w-full border-r border-icongray mr-2 pr-2">
                  <p className="text-xs text-icongray"> Take Profit</p>{" "}
                  <p className="text-green">
                    {" "}
                    {formatCurrency(parEl.tp != null ? Number(parEl.tp) : NaN)}
                  </p>
                </span>
                <span className="flex flex-col justify-center items-end w-full ">
                  <p className="text-xs text-icongray"> Stop Loss</p>{" "}
                  <p className="text-red">
                    {" "}
                    {formatCurrency(parEl.sl != null ? Number(parEl.sl) : NaN)}
                  </p>
                </span>
              </div>
              <span className="flex flex-row justify-center items-center mt-1 w-full">
                <p className="flex flex-row justify-end items-center text-xs text-icongray pr-1 w-1/2 h-full text-end">
                  Qty
                </p>
                <p className="flex flex-row justify-start items-center text-black font-semibold w-1/2 h-full">
                  {" "}
                  {parEl.quantity}
                </p>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
  const designComponents = useMemo(
    () => ({
      headerdesign:
        "flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray",
      valuedesign:
        "font-semibold text-base mr-3 text-sm sm:text-xs md:text-xs lp:text-xs",
    }),
    []
  );

  console.log("sltp", formatValue(sltp?.sl === null ? NaN : Number(sltp?.sl)));

  const mainDisObj: any[] = [];
  const otherDisObj: any[] = [];

  detailData.map((disObj: any) => {
    Number(disObj.assetvalue / totalAmount) * 100 < 5
      ? otherDisObj.push(disObj)
      : mainDisObj.push(disObj);
  });

  const ids = new Set(mainDisObj.map((disObj: any) => disObj.id));

  let newId: number;
  do {
    newId = Math.floor(Math.random() * 1_000_000); // Larger range = lower collision risk
  } while (ids.has(newId));

  const otherObj = [
    otherDisObj.reduce(
      (acc: any, curr: any) => {
        acc.assetvalue += curr.assetvalue;
        acc.currencyvalue += curr.currencyvalue;
        return acc;
      },
      {
        name: "Others",
        assetvalue: 0,
        currencyvalue: 0,
        id: newId,
      }
    ),
  ];

  const cardData =
    otherDisObj.length != 0 ? [...mainDisObj, otherObj].flat() : mainDisObj;

  const barData: any = buildBar(cardData, totalAmount);
  return (
    <>
      <div className="flex flex-col justify-start">
        <div className="flex flex-row  mb-5 pb-4 flex-wrap">
          {tableStatus === "derivative" ? (
            <DerivativeComponent sltp={sltp} />
          ) : null}
          <div className="overflow-y-scroll w-full">
            <div className="w-1/2 h-11 flex justify-center items-center mb-4 flex-wrap">
              <Bar data={barData.data} options={barData.options} />
            </div>
          </div>
          <div className="flex flex-row w-full flex-wrap gap-3">
            <InfoCards
              data={cardData}
              tableStatus={tableStatus}
              designComponents={designComponents}
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
          <ExposeNfts
            data={cardData.find((disObj) => activeDisObj === disObj.id)}
          />
        ) : null}
      </div>
    </>
  );
};
