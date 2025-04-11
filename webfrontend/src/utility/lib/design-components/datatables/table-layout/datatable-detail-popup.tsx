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

  console.log(props.assetId);

  const { data, isLoading, isError } = useDetailComponent(props);
  const designComponents = useMemo(
    () => ({
      carddesign:
        "flex flex-col justify-around card mb-2.5 py-3 px-3 w-64 sm:h-20 md:h-20 lp:h-16 lg:h-16 xl:h-16",
      headerdesign:
        "flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray",
      valuedesign:
        "font-semibold text-base mr-3 text-sm sm:text-xs md:text-xs lp:text-xs",
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
          <p className="p-4 ml-4 text-icongray">Asset Group Distribution</p>
        ) : (
          <nav className="flex flex-row justify-between items-center w-full">
            <div className="relative flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md md:w-8/12 sm:w-8/12 lp:w-4/12">
              <div
                role="Rebalancing-Switcher"
                className={`absolute bg-blue z-10 transition-transform duration-200 ease-in-out rounded-md text-white flex items-center justify-center ${
                  detail === "HD" ? "translate-x-full" : "translate-x-0"
                } sm:w-3/12 md:w-3/12 lp:w-4/12 h-10`}
              />
              <button
                className="relative z-5 bg-gray text-center sm:w-3/12 md:w-3/12 lp:w-4/12 md:text-xs lp:text-xs h-10 rounded-l-md p-2 sm:text-xs"
                onClick={() => {
                  setDetail(
                    props.tableStatus === "cryptocurrency" ? "DR" : "AG"
                  );
                }}
              >
                <p
                  className={`relative z-10 ${
                    detail === "DR" || detail === "AG"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {props.tableStatus === "cryptocurrency"
                    ? "Details"
                    : "Asset Groups"}
                </p>
              </button>
              {/* Right button */}
              <button
                className="relative z-5 text-center md:text-xs lp:text-xs h-10 bg-gray rounded-r-md p-2 sm:text-xs sm:w-3/12 md:w-3/12 lp:w-4/12"
                onClick={() => {
                  setDetail("HD");
                }}
              >
                <p
                  className={`relative z-10 ${
                    detail === "HD" ? "text-white" : "text-black"
                  }`}
                >
                  Holdings
                </p>
              </button>
            </div>
            <div className="h-12 md:w-10 sm:w-10 lp:w-1/4 lp:ml-12 xl:w-1/4 xl:ml-20 lg:p-2 lg:items-center flex flex-row justify-end items-end p-1 m-1">
              <HoldingLogoImageContainer
                url={props.assetUrl}
                alt="Collection icon"
                placeholder="CP"
              />
            </div>
          </nav>
        )}
        <div className=" w-full ">
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
      </div>
    );
  }
};
