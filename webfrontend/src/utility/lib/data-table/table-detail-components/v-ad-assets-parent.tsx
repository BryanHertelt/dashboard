import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import useResizeObserver from "use-resize-observer";
import {
  SmallErrorSkeleton,
  SmallLoadingSkeleton,
  useDetailComponent,
} from "../../data-fetching";
import { DrDetail, DisDetail } from "../../data-table";
import { HoldingLogoImageContainer, isObject } from "../../helpers";
import { TableDetailProps } from "../types";
type tabType = "DR" | "HD" | "AG";

/**
 * `TableDetailComponent` is a dynamic detail panel component displayed when expanding
 * a row in a data table. It shows in-depth data about an asset including general info,
 * asset groups, and holdings, depending on the asset type.
 *
 * ## Features
 * - Dynamically fetches and displays detail data based on the selected asset and `tableStatus`
 * - Supports multiple views: Details (`DR`), Asset Groups (`AG`), Holdings (`HD`)
 * - Handles loading and error states gracefully
 * - Renders corresponding subcomponents like `DrDetail` and `DisDetail` conditionally
 *
 * ## State Management
 * - `activeDisObj`: Tracks the selected asset group or holding for highlighting/details
 * - `detail`: Currently selected tab ("DR", "AG", "HD")
 * - `currentTab`: Index of the active tab for visual indicator animation
 * - `tabWidth`: Dynamically calculated width for evenly spacing tabs
 *
 * ## Responsive Behavior
 * Uses `useResizeObserver` to calculate and apply dynamic tab widths,
 * enabling a responsive and animated tab-switching experience.
 *
 * @param props - Object of type `TableDetailProps` including:
 * @param props.tableStatus - The type of asset (`"nft"`, `"cryptocurrency"`, `"derivative"`, etc.)
 * @param props.assetId - Unique identifier for the asset
 * @param props.assetName - Name of the asset to be displayed in charts and info cards
 * @param props.assetSymbol - The ticker symbol for the asset
 * @param props.assetUrl - An optional URL or path to an image or external resource for the asset
 * @param props.totalAssetAmount - Total portfolio value of the asset (used for distribution calculation)
 * @param props.currentValue - Current market value of the asset (used in `DrDetail`)
 *
 * @returns A React component rendering the expanded detail panel including:
 * - Loading skeleton (`SmallLoadingSkeleton`) if data is loading
 * - Error skeleton (`SmallErrorSkeleton`) if data fails to load or is malformed
 * - A tabbed navigation and a conditional detail view:
 *   - `DrDetail`: For general metrics (used mainly for cryptocurrency and derivatives)
 *   - `DisDetail`: For asset groups (`AG`) or holdings (`HD`)
 *
 * @example
 * ```tsx
 * <TableDetailComponent
 *   tableStatus="nft"
 *   assetId={101}
 *   assetName="CoolCats NFT"
 *   assetSymbol="CCAT"
 *   assetUrl="/images/ccat.png"
 *   totalAssetAmount={5000}
 *   currentValue={1200}
 * />
 * ```
 */
export const TableDetailComponent = (props: TableDetailProps) => {
  const tS = props.tableStatus;
  const [activeDisObj, setActiveDisObj] = useState<number | null>(null);
  const [detail, setDetail] = useState<tabType>(
    tS === "cryptocurrency" ? "DR" : "AG"
  );
  const tabs: tabType[] = useMemo(() => {
    switch (tS) {
      case "nft":
        return ["AG", "HD"];
      case "derivative":
        return ["AG"];
      default:
        return ["DR", "AG", "HD"];
    }
  }, [tS]);

  const [tabWidth, setTabWidth] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const { data, isLoading, isError } = useDetailComponent(props);

  const handleTabSwitch = useCallback(
    (index: number, button: string) => {
      {
        setActiveDisObj(null);
        const foundTab: tabType | undefined = tabs.find(
          (detail) => detail === button
        );
        if (foundTab) {
          setCurrentTab(tabs.indexOf(foundTab));
        }
        setDetail(tabs[index]);
      }
    },
    [tabs]
  );
  const { ref: tabRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        setTabWidth(width / tabs.length);
      }
    },
  });

  if (isLoading) {
    return <SmallLoadingSkeleton />;
  }

  if (isError) {
    return <SmallErrorSkeleton />;
  } else if (isObject(data) === false || Object.keys(data).length === 0) {
    console.error(
      "Wrong data format or empty Object while calling detailcomponent",
      typeof data
    );
    return <SmallErrorSkeleton />;
  } else {
    return (
      <div className="flex flex-row h-full w-full flex-wrap p-7">
        <nav className="relative flex flex-row w-3/4  justify-start mb-3">
          <div
            className="relative flex flex-row bg-gray rounded-md lg:w3/6 lp:w-3/6 xl:w-1/4 md:w-4/6  sm:w-4/6"
            ref={tabRef}
          >
            {tabs.map((button: string, index) => {
              return (
                <button
                  key={button}
                  style={{ width: tabWidth }}
                  onClick={() => handleTabSwitch(index, button)}
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
            <DrDetail data={data} currentValue={props.currentValue} />
          ) : detail === "AG" ? (
            <DisDetail
              detailData={data.assetgroups}
              tableStatus={props.tableStatus}
              assetname={props.assetName}
              totalAmount={props.totalAssetAmount}
              changeActiveDisObj={(activeDisObj: number | null) =>
                setActiveDisObj(activeDisObj)
              }
              activeDisObj={activeDisObj}
              sltp={props.tableStatus === "derivative" ? data.sltp : []}
            />
          ) : (
            <DisDetail
              detailData={data.holdings}
              tableStatus={props.tableStatus}
              assetname={props.assetName}
              totalAmount={props.totalAssetAmount}
              changeActiveDisObj={(activeDisObj: number | null) =>
                setActiveDisObj(activeDisObj)
              }
              activeDisObj={activeDisObj}
            />
          )}
        </div>
      </div>
    );
  }
};
