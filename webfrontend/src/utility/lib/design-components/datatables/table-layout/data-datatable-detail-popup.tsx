import { useState, useMemo } from "react";
import {
  ErrorSkeleton,
  LoadingSkeleton,
} from "@/utility/lib/datafetching/loading-skeleton";
import { useDetailComponent } from "@/utility/lib/datafetching/client-refetch/fetching-detail-component";
import {
  DrDetail,
  HdDetail,
  AgDetail,
} from "@/utility/lib/build-components/asset-table-detail-components";
import { isObject } from "@/utility/lib/helpers/helper-functions";
interface TableDetailProps {
  tableStatus: string | undefined;
  assetId: number;
  assetName?: string;
  assetSymbol?: string;
}

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

  const toggledStyles = useMemo(
    () => ({
      first: active ? "text-white bg-blue" : "bg-gray text-black",
      second: !active ? "text-white bg-blue" : "bg-gray text-black",
    }),
    [active]
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
        <div className="flex flex-row m-1 mb-2.5 p-1 pr-1 ml-3.5 rounded-md md:w-8/12 sm:w-8/12 lp:w-8/12">
          <button
            className={`text-center md:text-xs lp:text-sm h-10 md:w-4/12 lp:w-3/12 ${toggledStyles.first} rounded-l-md p-2 sm:text-xs sm:w-4/12`}
            onClick={() => {
              setDetail(props.tableStatus === "cryptocurrency" ? "DR" : "AG");
              setActive((prev) => !prev);
            }}
          >
            {props.tableStatus === "cryptocurrency"
              ? "Details + Rebalancing"
              : "Asset Group Distribution"}
          </button>
          <button
            className={`text-center md:text-xs lp:text-sm h-10 md:w-4/12 lp:w-3/12 ${toggledStyles.second} rounded-r-md p-2 sm:text-xs  sm:w-4/12`}
            onClick={() => {
              setDetail("HD");
              setActive((prev) => !prev);
            }}
          >
            Holding Distribution
          </button>
        </div>
        {detail === "DR" ? (
          <DrDetail designComponents={designComponents} data={data} />
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
