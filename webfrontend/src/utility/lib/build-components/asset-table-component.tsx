import { useMemo, useState, useRef, useEffect } from "react";
import useResizeObserver from "use-resize-observer";
import AssetTableController from "./asset-table-controller";

type StatusItem<StatusKey extends string> = {
  status: StatusKey;
  statusTitle: string;
  column: object;
};

type FilterItem<StatusKey extends string> = {
  filter: string;
  filterTitle: string;
  filterStatus: StatusKey;
};

type AssetTableConfig<StatusKey extends string> = {
  title: string;
  initial: any[];
  currentValue: number;
  status: StatusItem<StatusKey>[];
  filter: FilterItem<StatusKey>[];
};

/**
 *The AssetTableComponent generates the navigation for more complex datatables.
 * @param config The config object holds the settings for the datatable component, including the following configurations:
 * title: title of the data-table
 * intial: initial data,
 * detail: boolean => wether a detail page is available or not
 * status: array of objects, each object holding the status(used for implementation), statusTitle(rendered on the status buttons), columns(which should be displayed when selecting this status)
 * filter: array of objects, each object holding the filter (used for implementation), statusTitle(rendered on the filter button), filterStatus(the table status where the filter should be visible)
 * @returns A UI giving the possibility to trigger filter or status change functions and the Asset Table Controller.
 */
const AssetTableComponent = ({
  config,
}: {
  config: {
    title: string;
    initial: any;
    detail: boolean;
    status: { status: string; statusTitle: string; columns: object }[];
    filter: {
      filter: string;
      filterTitle: string;
      filterStatus: string;
    }[];
    currentValue?: number;
  };
}) => {
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
