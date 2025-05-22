import { useMemo, useState, useRef, useEffect } from "react";
import useResizeObserver from "use-resize-observer";
import AssetTableController from "./asset-table-controller";
import logger from "../logging/logger";

import { StatusItem, FilterItem, configType } from "./types";

/**
 * `AssetTableComponent` renders a tabbed and filterable interface for viewing different
 * types of asset tables, based on a provided configuration object.
 *
 * It dynamically builds status tabs and context-aware filters, updates the internal table status,
 * and passes configuration and state to the `AssetTableController` for applying the filter and status objects selected in this component.
 *
 * This component renders the UI for the user to use the AssetTableController. The controller applies filters, status and everything else selected
 * here to the actual dataset and passes it down to the DataTable, which takes care of rendering.
 *
 * ### State Variables:
 * - `tableStatus`: Tracks the currently active table/status view.
 * - `tabWidth`: Dynamically calculated width of each tab button for layout.
 * - `currentTab`: Index of the currently active status tab.
 * - `filter`: Object storing boolean values for each active/inactive filter by key.
 *
 * ### Subcomponents:
 * - `StatusButtons`: Renders each status as a tab, updating `tableStatus` and `currentTab` on click.
 * - `FilterButtons`: Dynamically renders filter buttons that are context-sensitive to `tableStatus`.
 *
 * @component
 * @param } props
 * @param  props.config - Configuration object containing:
 *   - `status`: Array of status objects (each with `status` and `statusTitle`)
 *   - `filter`: Array of filter objects (each with `filter`, `filterTitle`, and `filterStatus`)
 *
 * @returns A UI component displaying status-based asset tables with interactive tabs and filters.
 *
 * @example
 * <AssetTableComponent config={assetTableConfig} />
 */
const AssetTableComponent = ({ config }: { config: configType }) => {
  const [tableStatus, setTableStatus] = useState<string>(
    config.status[0].status
  );
  const [tabWidth, setTabWidth] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<number>(0);

  const { ref: tabRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        setTabWidth(width / config.status.length);
      }
    },
  });

  const defaultFilterObject = useMemo(() => {
    return config.filter.reduce((acc, curr) => {
      acc[curr.filter] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }, [config.filter]);

  const [filter, setFilter] =
    useState<Record<string, boolean>>(defaultFilterObject);

  /**
   *
   * @param status - containing information about the status
   * @returns
   */
  const StatusButtons = ({
    status,
    label,
  }: {
    status: string;
    label: string;
  }) => (
    <button
      style={{
        width: tabWidth,
      }}
      onClick={() => {
        const foundStatus = config.status.find(
          (object) => object.status === status
        );

        if (foundStatus) {
          setCurrentTab(config.status.indexOf(foundStatus));
        }
        setTableStatus(status);
      }}
      className={`${
        tableStatus === status ? "text-white" : "text-black"
      } z-50 relative px-3 text-xs overflow-hidden md:text-xs text-center h-full text-black rounded-md`}
    >
      {" "}
      {label}
    </button>
  );

  const FilterButtons = () => {
    return (
      <>
        {config.filter.map(({ filter: key, filterTitle, filterStatus }) => {
          if (filterStatus === tableStatus) {
            const otherKeys = config.filter
              .filter(({ filterStatus }) => filterStatus === tableStatus)
              .map(({ filter }) => filter)
              .filter((keys) => keys !== key);

            const otherActive = otherKeys.some((keys) => filter[keys]);

            return (
              <button
                key={key}
                className={`${
                  filter[key]
                    ? "border-2 border-icongray"
                    : "border-2 border-white"
                } flex mr-3 items-center justify-center rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setFilter((prevState) => ({
                    ...prevState,
                    [key]: !prevState[key],
                  }));
                }}
                disabled={!(otherActive || !filter[key])}
              >
                {filterTitle}
              </button>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <div className="pt-5">
      <header className="flex flex-row justify-between mb-4 h-9">
        <nav className="relative flex flex-row pl-7 w-3/4  justify-start ">
          <div
            className="relative flex flex-row bg-gray rounded-md lg:w-2/6 lp:w-2/6 xl:w-1/4 md:w-3/6  sm:w-4/6"
            ref={tabRef}
          >
            {config.status.map((statusConfig) => (
              <div key={statusConfig.status}>
                <StatusButtons
                  status={statusConfig.status}
                  label={statusConfig.statusTitle}
                />
              </div>
            ))}
            <div
              className="absolute z-5 inset-0 bg-blue rounded-md transition-all "
              style={{
                width: tabWidth,
                translate: `${currentTab * tabWidth}px 0px`,
              }}
            />
          </div>
        </nav>
        <div className=" flex flex-row w-1/4  justify-end">
          <FilterButtons />
        </div>
      </header>
      <div>
        <div className="h-full card">
          <AssetTableController
            tableStatus={tableStatus}
            tableConfig={config}
            filterType={filter}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetTableComponent;
