import { useState, useMemo, useRef, useEffect } from "react";
import useResizeObserver from "use-resize-observer";
import {
  ErrorSkeleton,
  LoadingSkeleton,
} from "@/utility/lib/datafetching/loading-skeleton";
import { useDetailComponent } from "@/utility/lib/datafetching/client-refetch/client-hooks";
import {
  DrDetail,
  Detail,
} from "@/utility/lib/build-components/asset-table-detail-components";
import { isObject } from "@/utility/lib/helpers/helper-functions";
import { HoldingLogoImageContainer } from "@/utility/lib/helpers/image-container";
interface TableDetailProps {
  tableStatus: string | undefined;
  assetId: number;
  currentValue: number;
  totalAssetAmount: number;
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
  const tS = props.tableStatus;
  const [detail, setDetail] = useState<string>(
    tS === "cryptocurrency" ? "DR" : "AG"
  );
  let tabs = ["DR", "AG", "HD"];
  if (tS == "nft") {
    tabs = ["AG", "HD"];
  }
  if (tS == "derivative") {
    tabs = ["AG"];
  }
  const [tabWidth, setTabWidth] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const { data, isLoading, isError } = useDetailComponent(props);
  const designComponents = useMemo(
    () => ({
      carddesign:
        "flex flex-col justify-around card mb-2.5 py-3 px-3 w-full sm:h-20 md:h-20 lp:h-16 lg:h-16 xl:h-16",
      headerdesign:
        "flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray",
      valuedesign:
        "font-semibold text-base mr-3 text-sm sm:text-xs md:text-xs lp:text-xs",
    }),
    []
  );

  const { ref: tabRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        setTabWidth(width / tabs.length);
      }
    },
  });

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
      <div className="flex flex-row h-full w-full flex-wrap p-7">
        <nav className="relative flex flex-row w-3/4  justify-start mb-3">
          <div
            className="relative flex flex-row bg-gray rounded-md lg:w-2/6 lp:w-2/6 xl:w-1/4 md:w-3/6  sm:w-4/6"
            ref={tabRef}
          >
            {tabs.map((button: string, index) => {
              return (
                <button
                  key={button}
                  style={{ width: tabWidth }}
                  onClick={() => {
                    const foundTab: any = tabs.find(
                      (detail) => detail === button
                    );
                    if (foundTab) {
                      setCurrentTab(tabs.indexOf(foundTab));
                    }
                    setDetail(tabs[index]);
                  }}
                  className={`${
                    detail === tabs[index] ? "text-white" : "text-black"
                  } z-50 relative p-2 text-xs overflow-hidden md:text-xs text-center text-black rounded-md`}
                >
                  {button === "DR"
                    ? "Details"
                    : button === "HD"
                    ? "Holdings"
                    : "Asset-Groups"}
                </button>
              );
            })}
            <div
              className="absolute z-5 inset-0 bg-blue rounded-md transition-all "
              style={{
                width: tabWidth,
                translate: `${currentTab * tabWidth}px 0px`,
              }}
            />
          </div>
        </nav>
        <div className=" w-full h-full">
          {detail === "DR" ? (
            <DrDetail
              designComponents={designComponents}
              data={data}
              currentValue={props.currentValue}
            />
          ) : detail === "AG" ? (
            <Detail
              detailData={data.assetgroups}
              tableStatus={props.tableStatus}
              assetname={props.assetName}
              totalAmount={props.totalAssetAmount}
            />
          ) : (
            <Detail
              detailData={data.holdings}
              tableStatus={props.tableStatus}
              assetname={props.assetName}
              totalAmount={props.totalAssetAmount}
            />
          )}
        </div>
      </div>
    );
  }
};
