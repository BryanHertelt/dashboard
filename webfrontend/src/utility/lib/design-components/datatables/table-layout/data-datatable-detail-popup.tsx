import { useState, useMemo } from "react";
import {
  ErrorSkeleton,
  LoadingSkeleton,
} from "@/utility/lib/datafetching/loading-skeleton";
import { useDetailComponent } from "@/utility/lib/datafetching/client-refetch/client-hooks";
import {
  DrDetail,
  HdDetail,
  AgDetail,
} from "@/utility/lib/build-components/asset-table-detail-components";
import { isObject } from "@/utility/lib/helpers/helper-functions";
import { HoldingLogoImageContainer } from "@/utility/lib/helpers/image-container";
interface TableDetailProps {
  tableStatus: string | undefined;
  assetId: number;
  currentValue: number;
  assetName?: string;
  assetSymbol?: string;
  assetUrl?: string;
}

/**
 * The component handles the user interaction inside of the detailled pop up, when expanding the datatable row.
 * It also handles loading and error states for the detailled pop up.
 * All parameters are given as props from the parent component.
 * @param tableStatus
 * @param assetId
 * @param assetName
 * @param assetSymbol
 * @param assetUrl
 * @returns The detailled popup, when expanding a datatable row.
 */
export const TableDetailComponent = (props: TableDetailProps) => {
  const [detail, setDetail] = useState<string>(
    props.tableStatus === "cryptocurrency" ? "DR" : "AG"
  );
  const [active, setActive] = useState<boolean>(true);

  const { data, isLoading, isError } = useDetailComponent(props);
  const designComponents = useMemo(
    () => ({
      carddesign: "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3 w-64 h-20",
      headerdesign: "flex flex-row text-sm text-icongray mb-1",
      valuedesign: "font-semibold text-base mr-3",
    }),
    []
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorSkeleton />;
  } else if (isObject(data) === false || Object.keys(data).length === 0) {
    console.error(
      "Wrong data format or empty Object while calling detailcomponent",
      typeof data
    );
    return <ErrorSkeleton />;
  } else {
    return (
      <div className="flex flex-row h-full w-full flex-wrap">
        {props.tableStatus === "derivative" ? (
          <p className="p-4 ml-4 text-icongray"> Asset Group Distribution</p>
        ) : (
          <>
            <div className="flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md md:w-8/12 sm:w-8/12 lp:w-8/12">
              <div
                className={`absolute flex bg-blue w-10 h-10 ${
                  active ? "ml-1" : "ml-48"
                } transition-all duration-300 rounded-md h-10 md:w-3/12 lp:w-52 text-white items-center justify-center`}
              >
                {props.tableStatus === "cryptocurrency" && detail === "DR"
                  ? "Details + Rebalancing"
                  : detail === "HD"
                  ? "Holding Distribution"
                  : "Asset Group Distribution"}
              </div>
              <button
                className={`text-center md:text-xs lp:text-sm h-10 md:w-4/12 lp:w-3/12 bg-gray text-black rounded-l-md p-2 sm:text-xs sm:w-4/12`}
                onClick={() => {
                  setDetail(
                    props.tableStatus === "cryptocurrency" ? "DR" : "AG"
                  );
                  setActive((prev) => !prev);
                }}
              >
                <p>
                  {props.tableStatus === "cryptocurrency"
                    ? "Details + Rebalancing"
                    : "Asset Group Distribution"}
                </p>
              </button>
              <button
                className={` text-center  md:text-xs lp:text-sm h-10 md:w-4/12 lp:w-3/12 bg-gray text-black rounded-r-md p-2 sm:text-xs  sm:w-4/12`}
                onClick={() => {
                  setDetail("HD");
                  setActive((prev) => !prev);
                }}
              >
                Holding Distribution
              </button>
            </div>
            <div className="h-12 md:w-10 sm:w-10 lp:w-1/4 lp:ml-12 xl:w-1/4 xl:ml-20 lg:p-2 lg:items-center flex flex-row justify-end items-centerp-1 m-1">
              <HoldingLogoImageContainer
                url={props.assetUrl}
                alt="Collection icon"
                placeholder="CP"
              />
            </div>
          </>
        )}
        {detail === "DR" ? (
          <DrDetail
            designComponents={designComponents}
            data={data}
            currentValue={props.currentValue}
          />
        ) : detail === "AG" ? (
          <AgDetail
            data={data.assetgroups}
            tableStatus={props.tableStatus}
            assetname={props.assetName}
            designComponents={designComponents}
          />
        ) : (
          <HdDetail
            data={data.holdings}
            tableStatus={props.tableStatus}
            assetname={props.assetName}
            designComponents={designComponents}
          />
        )}
      </div>
    );
  }
};
