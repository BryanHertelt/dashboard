"use client";
import { useMemo, useState, useEffect } from "react";
import useResizeObserver from "use-resize-observer";
import AssetTableController from "./asset-table-controller";
import { ReloadHoldingsIcon } from "../../../../public/images/icons";
import logger from "../logging/logger";

import { configType } from "./types";

const AssetTableComponent = ({ config }: { config: configType }) => {
  const [tableStatus, setTableStatus] = useState<string>(
    config.status[0]?.status || ""
  );
  const [tabWidth, setTabWidth] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const start = performance.now();
  useEffect(() => {
    const end = performance.now();
    const duration = end - start;
    logger.info(`DataTable rendered in ${duration.toFixed(2)} ms`);
  }, []);

  if (!config?.status?.length || !config?.filter) {
    logger.error(
      "AssetTableComponent: invalid config: status or filter array is empty or undefined",
      { config }
    );
  }

  const { ref: tabRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        const newTabWidth = width / config.status.length;
        setTabWidth(newTabWidth);
      }
    },
  });

  const defaultFilterObject = useMemo(() => {
    const filterObj = config.filter.reduce((acc, curr) => {
      acc[curr.filter] = true;
      return acc;
    }, {} as Record<string, boolean>);
    logger.debug("AssetTableComponent: default filter object initialized", {
      filterObj,
    });
    return filterObj;
  }, [config.filter]);

  const [filter, setFilter] =
    useState<Record<string, boolean>>(defaultFilterObject);

  const StatusButtons = ({
    status,
    label,
  }: {
    status: string;
    label: string;
  }) => (
    <button
      style={{ width: tabWidth }}
      onClick={() => {
        const foundStatus = config.status.find(
          (object) => object.status === status
        );
        if (foundStatus) {
          setCurrentTab(config.status.indexOf(foundStatus));
          setTableStatus(status);
          logger.info("AssetTableComponent:status tab clicked", {
            status,
            statusTitle: label,
            currentTab: config.status.indexOf(foundStatus),
          });
        }
      }}
      className={`${
        tableStatus === status ? "text-white" : "text-black"
      } z-50 relative px-3 text-xs overflow-hidden md:text-xs text-center h-full text-black rounded-md`}
    >
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
                  setFilter((prevState) => {
                    const newFilter = { ...prevState, [key]: !prevState[key] };
                    logger.info("AssetTableComponent: filter toggled", {
                      filterKey: key,
                      filterTitle,
                      newState: !prevState[key],
                      tableStatus,
                      fullFilterState: newFilter,
                    });
                    return newFilter;
                  });
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

  const AddOnButtons = () => {
    return (
      <>
        {config.addOns.map(
          (
            addOn: { addOnStatus: string; addOnTitle: string },
            index: number
          ) => {
            return (
              <button
                key={index}
                className={`flex mr-3 items-center justify-center rounded-md text-sm w-10 py-1 bg-blue`}
              >
                <ReloadHoldingsIcon />
              </button>
            );
          }
        )}
      </>
    );
  };

  return (
    <div className="pt-5 h-[68vh] border border-transparent">
      <header className="flex flex-row justify-between mb-4 h-9">
        {config.status.length === 1 ? (
          <p className="flex flex-row pl-7 justify-start items-center ">
            {" "}
            {config.status[0].statusTitle}{" "}
          </p>
        ) : (
          <nav className="relative flex flex-row pl-7 w-3/4 justify-start">
            <div
              className="relative flex flex-row bg-gray rounded-md lg:w-2/6 lp:w-2/6 xl:w-1/4 md:w-3/6 sm:w-4/6"
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
                className="absolute z-5 inset-0 bg-blue rounded-md transition-all"
                style={{
                  width: tabWidth,
                  translate: `${currentTab * tabWidth}px 0px`,
                }}
              />
            </div>
          </nav>
        )}
        <div className="flex flex-row w-1/4 justify-end">
          <FilterButtons />
          <AddOnButtons />
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
