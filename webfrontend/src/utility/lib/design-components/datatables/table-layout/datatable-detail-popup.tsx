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
          <p className="p-4 ml-4 text-icongray">Asset Group Distribution</p>
        ) : (
          <>
            <div className="relative flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md md:w-8/12 sm:w-8/12 lp:w-8/12">
              {/* Blue switcher div */}
              <div
                role="Rebalancing-Switcher"
                className={`absolute bg-blue z-50 transition-transform duration-500 ease-in-out rounded-md text-white flex items-center justify-center ${
                  detail === "HD" ? "translate-x-full" : "translate-x-0"
                } sm:w-4/12 md:w-4/12 lp:w-3/12 h-10`}
              >
                {props.tableStatus === "cryptocurrency" && detail === "DR"
                  ? "Details"
                  : detail === "HD"
                  ? "Holding Distribution"
                  : "Asset Group Distribution"}
              </div>
              {/* Left button */}
              <button
                className="relative z-0 bg-gray text-center sm:w-4/12 md:w-4/12 lp:w-3/12 md:text-xs lp:text-sm h-10 text-black rounded-l-md p-2 sm:text-xs"
                onClick={() => {
                  setDetail(
                    props.tableStatus === "cryptocurrency" ? "DR" : "AG"
                  );
                }}
              >
                <p>
                  {props.tableStatus === "cryptocurrency"
                    ? "Details"
                    : "Asset Group Distribution"}
                </p>
              </button>
              {/* Right button */}
              <button
                className="relative z-0 text-center md:text-xs lp:text-sm h-10 bg-gray text-black rounded-r-md p-2 sm:text-xs sm:w-4/12 md:w-4/12 lp:w-3/12"
                onClick={() => {
                  setDetail("HD");
                }}
              >
                <p>Holding Distribution</p>
              </button>
            </div>
            <div className="h-12 md:w-10 sm:w-10 lp:w-1/4 lp:ml-12 xl:w-1/4 xl:ml-20 lg:p-2 lg:items-center flex flex-row justify-end items-center p-1 m-1">
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
