"use client";

import { formatCurrency, formatValue } from "../helpers/helper-functions";
import { ExposeNfts } from "../helpers/nft-container";
import {
  BarChartRebalancing,
  HoldingBarChart,
} from "../design-components/charts/bar-charts";
import { useState } from "react";
import { RebalancingSetUp } from "../design-components/rebalancing-set-up/rebalancing-set-up";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { HoldingLogoImageContainer } from "../helpers/image-container";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  //props: designComponents, detailData
  console.log("data", data);
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
    <>
      <div className="flex flex-row lg:w-2/5 lp:w-3/5 justify-start flex-wrap md:w-3/5 sm:w-3/5">
        <div className="flex flex-row flex-wrap ml-1.5 h-full w-full">
          {portfolioRebalancingData.map((cards: any) => {
            return (
              <div
                role="Detail Rebalancing Cards"
                className={`${designComponents.carddesign} transition-opacity duration-300 sm:w-40 md:w-40 lg:w-52 lp:w-40 xl:w-72`}
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
      <div className="lg:w-3/5 lp:w-2/5 pr-3 pt-5 pl-10 border-l-2 border-gray md:w-2/5 sm:w-2/5">
        <RebalancingSetUp
          data={barchartData}
          assetId={data.assetId}
          theme={"details"}
          currentValue={currentValue}
        />
      </div>
    </>
  );
};

export const AgDetail = (props: any) => {
  // props: designComponents, tableStatus, assetname
  const [activeGroup, setActiveGroup] = useState<any>(
    props.tableStatus === "nft" ? props.data[0] : null
  );

  return (
    <>
      <div className="flex flex-col w-full justify-start flex-wrap ">
        <div
          className={`flex flex-row ml-3.5 ${
            props.tableStatus === "nft"
              ? "border-b-2 border-gray mb-5 pb-4"
              : ""
          }`}
        >
          {props.data.map((group: any) => {
            return (
              <div
                className={`${props.designComponents.carddesign} ${
                  activeGroup === group && props.tableStatus === "nft"
                    ? "border border-black"
                    : ""
                }`}
                key={group.id}
                onClick={() => setActiveGroup(group)}
              >
                <div className={props.designComponents.headerdesign}>
                  {group.name}
                </div>
                <div className="flex flex-row align-middle ">
                  {props.tableStatus === "nft" ? (
                    <p className={props.designComponents.valuedesign}>
                      {" "}
                      {group.nftcount} NFTs
                    </p>
                  ) : (
                    <p className={props.designComponents.valuedesign}>
                      {props.assetname}
                    </p>
                  )}
                  {props.tableStatus === "nft" ? (
                    <p
                      className={`${props.designComponents.headerdesign} pt-1`}
                    >
                      {" "}
                      ~ {formatValue(group.assetvalue)} ETH{" "}
                    </p>
                  ) : (
                    <p
                      className={`${props.designComponents.headerdesign} flex flex-row  pt-1`}
                    >
                      ~ {formatCurrency(group.currencyvalue)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {props.tableStatus === "nft" ? <ExposeNfts data={activeGroup} /> : null}
      </div>
    </>
  );
};

export const HdDetail = (props: any) => {
  // Proceed with building the HdDetail component to 1. render based on tableStatus 2. give the right props at datatable
  /**
   * Props needed: 1. data object containing: assetname(assetabbr), holdingdata , 2. tableStatus
   */
  const [activeHolding, setActiveHolding] = useState<any>(
    props.tableStatus === "nft" ? props.data[0] : null
  );

  return (
    <>
      <div className="flex flex-col w-full justify-start flex-wrap">
        <div className="flex flex-row ml-3.5 border-b-2 border-gray mb-5 pb-4 flex-wrap">
          {props.data.map((holding: any) => {
            return (
              <div
                className={`${props.designComponents.carddesign} ${
                  activeHolding === holding && props.tableStatus === "nft"
                    ? "border border-black"
                    : ""
                }`}
                key={holding.id}
                onClick={() => setActiveHolding(holding)}
              >
                <div className={props.designComponents.headerdesign}>
                  <div className="mr-1.5">
                    <HoldingLogoImageContainer
                      url={holding.holdingurl}
                      alt={`${holding.name} Logo in Asset Detail Component`}
                      placeholder={"HL"}
                    />{" "}
                  </div>{" "}
                  {holding.name}
                </div>
                <div className="flex flex-row align-middle">
                  {props.tableStatus === "cryptocurrency" ||
                  props.tableStatus === "derivative" ? (
                    <>
                      {" "}
                      <div
                        className={`flex flex-row ${props.designComponents.valuedesign}`}
                      >
                        {" "}
                        <p>
                          {" "}
                          {formatValue(holding.assetvalue)} {props.assetname}{" "}
                        </p>
                        <p
                          className={`${props.designComponents.headerdesign} pt-1`}
                        >
                          ~ {formatCurrency(holding.currencyvalue)}
                        </p>{" "}
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      <p className={props.designComponents.valuedesign}>
                        {" "}
                        {holding.nftcount} NFTs{" "}
                      </p>
                      <p
                        className={`${props.designComponents.headerdesign} pt-1`}
                      >
                        ~ {formatValue(holding.assetvalue)} ETH
                      </p>
                    </>
                  )}{" "}
                </div>
              </div>
            );
          })}
        </div>
        {props.tableStatus === "nft" ? (
          <ExposeNfts data={activeHolding} />
        ) : null}
        {props.tableStatus === "cryptocurrency" ? (
          <div className="overflow-y-scroll h-36">
            <HoldingBarChart data={props.data} />
          </div>
        ) : null}
      </div>
    </>
  );
};
