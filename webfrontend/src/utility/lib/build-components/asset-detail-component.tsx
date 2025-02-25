"use client";

// use useEffect on tablestatus later on to close detail everytime the table status changes
import { useQuery } from "@tanstack/react-query";
import { StructureLayer } from "../datafetching/layer";
import { formatCurrency } from "../helpers/currency-formatter";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import LoadingSkeleton from "../datafetching/loading-skeleton";
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
import { HoldingLogoImageContainer } from "../helpers/image-container";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const prefetchDetailComponent = async (
  assettype: string,
  id: number,
  queryClient: any
) => {
  await queryClient.prefetchQuery({
    queryKey: ["detail components", `${id}`],
    queryFn: async () => await StructureLayer.getDetailAssetData(assettype, id),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  });
};

/*
export const TableDetailComponent = (
  tableStatus: string,
  assetId: number,
  options: any
) => {
  const [detail, setDetail] = useState<string>("AG");
  if (tableStatus === "cryptocurrency") {
    setDetail("DR");
  }
  const [active, setActive] = useState<boolean>(true);
  const { data, isLoading } = useQuery({
    queryKey: ["detail components", `${assetId}`],
    queryFn: async () =>
      await StructureLayer.getDetailAssetData(tableStatus, assetId),
    gcTime: 1000,
    staleTime: 1000,
  });

  const toggledFirstOpt =
    active === true ? "text-white bg-blue" : "bg-gray text-black";

  const toggledSecondOpt =
    active === false ? "text-white bg-blue" : "bg-gray text-black";

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-row h-full w-full flex-wrap">
      <div className="flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md w-8/12">
        <button
          className={`text-center text-sm w-2/12 ${toggledFirstOpt} rounded-l-md p-2`}
          onClick={() => {
            setDetail(tableStatus === "cryptocurrency" ? "DR" : "AG");
            setActive(!active);
          }}
        >
          {tableStatus === "cryptocurrency"
            ? "Asset Distribution + Rebalancing"
            : "Asset Group Distribution"}
        </button>
        <button
          className={`text-center text-sm w-2/12 ${toggledSecondOpt} rounded-r-md p-2`}
          onClick={() => {
            setDetail("HD");
            setActive(!active);
          }}
        >
          {" "}
          Holding Distribution{" "}
        </button>
      </div>
      {detail === "DR" ? (
        <DrDetail />
      ) : detail === "AG" ? (
        <AgDetail />
      ) : (
        <HDDetail />
      )}
    </div>
  );
};

const HdDetail = (data: any) => {
  const carddesign = "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3";
  const headerdesign = "flex flex-row text-sm text-icongray mb-1";
  const valuedesign = "font-semibold text-base mr-3";
  // Proceed with building the HdDetail component to 1. render based on tableStatus 2. give the right props at datatable
  return (
    <>
      <div className="flex flex-col w-full justify-start flex-wrap">
        <div className="flex flex-row ml-3.5">
          {data.holdings.map((holding: any) => {
            return (
              <div className={carddesign} key={holding.holdingname}>
                <HoldingLogoImageContainer
                  url={holding.holdingurl}
                  alt={`${holding.holdingname} Logo in Asset Detail Component`}
                  placeholder={"HL"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
*/

/** 
const HDDetail = (props: any) => {
  const carddesign = "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3";
  const headerdesign = "flex flex-row text-sm text-icongray mb-1";
  const valuedesign = "font-semibold text-base mr-3";

  return (
    <>
      <div className="flex flex-col w-full justify-start flex-wrap">
        <div className="flex flex-row ml-3.5">
          {props.data.holdings.map((holding: any) => {
            return (
              <div className={carddesign} key={holding.holdingname}>
                <Image
                    src={holding.holdingurl}
                    alt={`${holding.holdingname} icon`}
                    width={500}
                    height={500}
                  />{" "} {" "}
                <div className={headerdesign}>
                  {" "}
                  <p className="mr-1.5"> A </p> {holding.holdingname}
                </div>
                <div className="flex flex-row align-middle ">
                  <p className={valuedesign}>
                    {holding.assetvalue} {props.assetAbbr}
                  </p>
                  <p className={`${headerdesign} pt-1`}>
                    ~ {formatCurrency(holding.currencyvalue)}
                  </p>
                </div>
                {props.barChart ? <BarChart /> : null}
              </div>
            );
          })}
        </div>
        <hr />
      </div>
    </>
  );
};
*/

export const CryptoDetailComponent = (props: any) => {
  const [detail, setDetail] = useState<string>("DR");
  const [active, setActive] = useState<boolean>(true);
  const { data, isLoading } = useQuery({
    queryKey: ["detail components", `${props.assetId}`],
    queryFn: async () =>
      await StructureLayer.getDetailAssetData("cryptocurrency", props.assetId),
    gcTime: 1000,
    staleTime: 1000,
  });

  const toggledDR =
    active === true ? "text-white bg-blue" : "bg-gray text-black";

  const toggledHD =
    active === false ? "text-white bg-blue" : "bg-gray text-black";

  if (isLoading === true) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-row h-full w-full flex-wrap">
      <div className="flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md w-8/12">
        <button
          className={`text-center text-sm w-2/12 ${toggledDR} rounded-l-md p-2`}
          onClick={() => {
            setDetail("DR");
            setActive(!active);
          }}
        >
          {" "}
          Details + Rebalancing{" "}
        </button>
        <button
          className={`text-center text-sm w-2/12 ${toggledHD} rounded-r-md p-2`}
          onClick={() => {
            setDetail("HD");
            setActive(!active);
          }}
        >
          {" "}
          Holding Distribution{" "}
        </button>
      </div>{" "}
      */
      {detail === "DR" ? (
        <DrDetail data={data} />
      ) : (
        <HDDetail data={data} assetAbbr={props.assetAbbr} barChart={false} />
      )}
    </div>
  );
};

const DrDetail = (props: any) => {
  const carddesign = "flex flex-col card mb-2.5 p-3 pr-24";
  const headerdesign = "text-xs text-icongray mb-1";
  const valuedesign = "font-semibold text-base";
  return (
    <>
      <div className="flex flex-row w-1/3 justify-start flex-wrap">
        <div className="flex flex-col ml-3.5 h-full">
          <div className={carddesign}>
            <p className={headerdesign}>Average entry price</p>
            <p className={valuedesign}>
              {" "}
              {formatCurrency(props.data.averageentryprice)}{" "}
            </p>
          </div>
          <div className={carddesign}>
            <p className={headerdesign}> Market price</p>
            <p className={valuedesign}>
              {" "}
              {formatCurrency(props.data.marketprice)}{" "}
            </p>
          </div>
        </div>
        <div className="flex flex-col ml-3.5 mr-1.5 ">
          <div className={carddesign}>
            <p className={headerdesign}> Average exit price </p>
            <p className={valuedesign}>
              {" "}
              {formatCurrency(props.data.averageexitprice)}{" "}
            </p>
          </div>
          <div className={carddesign}>
            <p className={headerdesign}> Total cost</p>
            <p className={valuedesign}>
              {formatCurrency(props.data.totalcost)}{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="border border-green">
        <BarChart data={props.data} height={100} width={200} />
      </div>
    </>
  );
};

//Test HDDetail
const HDDetail = (props: any) => {
  const carddesign = "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3";
  const headerdesign = "flex flex-row text-sm text-icongray mb-1";
  const valuedesign = "font-semibold text-base mr-3";

  return (
    <>
      <div className="flex flex-col w-full justify-start flex-wrap">
        <div className="flex flex-row ml-3.5">
          {props.data.holdings.map((holding: any) => {
            return (
              <div className={carddesign} key={holding.holdingname}>
                {/**<Image
                    src={holding.holdingurl}
                    alt={`${holding.holdingname} icon`}
                    width={500}
                    height={500}
                  />{" "} */}{" "}
                <div className={headerdesign}>
                  {" "}
                  <p className="mr-1.5"> A </p> {holding.holdingname}
                </div>
                <div className="flex flex-row align-middle ">
                  <p className={valuedesign}>
                    {holding.assetvalue} {props.assetAbbr}
                  </p>
                  <p className={`${headerdesign} pt-1`}>
                    ~ {formatCurrency(holding.currencyvalue)}
                  </p>
                </div>
                {props.barChart ? <BarChart /> : null}
              </div>
            );
          })}
        </div>
        <hr />
      </div>
    </>
  );
};

const AgDetail = (props: any) => {
  const carddesign = "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3";
  const headerdesign = "flex flex-row text-sm text-icongray mb-1";
  const valuedesign = "font-semibold text-base mr-3";

  console.log("This are the props in Asset Group ", props);

  return (
    <>
      <div className="flex flex-col w-full justify-start flex-wrap">
        <div className="flex flex-row ml-3.5">
          {props.data.assetgroups.map((group: any) => {
            return (
              <div className={carddesign} key={group.groupname}>
                {/**<Image
                    src={holding.holdingurl}
                    alt={`${holding.holdingname} icon`}
                    width={500}
                    height={500}
                  />{" "} */}{" "}
                <div className={headerdesign}>{group.groupname}</div>
                <div className="flex flex-row align-middle ">
                  <p className={valuedesign}>{group.assetvalue}</p>
                  <p className={`${headerdesign} pt-1`}>
                    ~ {formatCurrency(group.currencyvalue)}
                  </p>
                </div>
                {props.barChart ? <BarChart /> : null}
              </div>
            );
          })}
        </div>
        <hr />
      </div>
    </>
  );
};

export const DerivativeDetailComponent = (props: any) => {
  const [active, setActive] = useState<boolean>(true);
  const [detail, setDetail] = useState<string>("AG");
  const { data, isLoading } = useQuery({
    queryKey: ["detail components", `${props.assetId}`],
    queryFn: async () =>
      await StructureLayer.getDetailAssetData("derivative", props.assetId),
    gcTime: 1000,
    staleTime: 1000,
  });

  const toggledDR =
    active === true ? "text-white bg-blue" : "bg-gray text-black";

  const toggledHD =
    active === false ? "text-white bg-blue" : "bg-gray text-black";

  if (isLoading === true) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-row h-full w-full flex-wrap">
      <div className="flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md w-8/12">
        <button
          className={`text-center text-sm w-2/12 ${toggledDR} rounded-l-md p-2`}
          onClick={() => {
            setDetail("AG");
            setActive(!active);
          }}
        >
          Asset- Groups
        </button>
        <button
          className={`text-center text-sm w-2/12 ${toggledHD} rounded-r-md p-2`}
          onClick={() => {
            setDetail("HD");
            setActive(!active);
          }}
        >
          {" "}
          Holding Distribution{" "}
        </button>
      </div>
      {detail === "AG" ? (
        <AgDetail data={data} />
      ) : (
        <HDDetail data={data} assetAbbr={props.assetAbbr} barChart={false} />
      )}
    </div>
  );
};

export const NFTDetailComponent = (props: any) => {
  const [active, setActive] = useState<boolean>(true);
  const [detail, setDetail] = useState<string>("AG");
  const { data, isLoading } = useQuery({
    queryKey: ["detail components", `${props.assetId}`],
    queryFn: async () =>
      await StructureLayer.getDetailAssetData("nft", props.assetId),
    gcTime: 1000,
    staleTime: 1000,
  });

  const toggledDR =
    active === true ? "text-white bg-blue" : "bg-gray text-black";

  const toggledHD =
    active === false ? "text-white bg-blue" : "bg-gray text-black";

  if (isLoading === true) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-row h-full w-full flex-wrap">
      <div className="flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md w-8/12">
        <button
          className={`text-center text-sm w-2/12 ${toggledDR} rounded-l-md p-2`}
          onClick={() => {
            setDetail("AG");
            setActive(!active);
          }}
        >
          Asset- Groups
        </button>
        <button
          className={`text-center text-sm w-2/12 ${toggledHD} rounded-r-md p-2`}
          onClick={() => {
            setDetail("HD");
            setActive(!active);
          }}
        >
          {" "}
          Holding Distribution{" "}
        </button>
      </div>
      {detail === "AG" ? (
        <AgDetail data={data} />
      ) : (
        <HDDetail data={data} assetAbbr={props.assetAbbr} barChart={false} />
      )}
    </div>
  );
};

const BarChart = (props: any) => {
  const desiredbalance = props.data.desiredbalance;
  const currentbalance = props.data.currentbalance;

  const data: ChartData<"bar"> = {
    labels: [""],
    datasets: [
      {
        label: `current: ${formatCurrency(props.data.currentbalancenumber)}`,
        data: [currentbalance],
        backgroundColor: ["rgba(0, 26, 66, 1)"],
        borderColor: ["rgba(0, 26, 66, 1)"],
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: `desired: ${formatCurrency(props.data.desiredbalancenumber)}`,
        data: [desiredbalance],
        backgroundColor: ["rgba(122, 122, 122, 1)"],
        borderColor: ["rgba(122, 122, 122, 1)"],
        borderWidth: 1,
        borderRadius: 7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    aspectRatio: 2,
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
        align: "center",
      },
      title: {
        display: false,
        text: "Sample Bar Chart",
      },
    },
  };

  return <Bar data={data} options={options} />;
};
