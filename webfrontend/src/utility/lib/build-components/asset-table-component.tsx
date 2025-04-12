import { useMemo, useState, useRef, useEffect } from "react";
import AssetTableController from "./asset-table-controller";

type StatusItem<StatusKey extends string> = {
  status: StatusKey;
  statusTitle: string;
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

const AssetTableComponent = <StatusKey extends string>({
  config,
}: {
  config: {
    title: string;
    initial: any;
    detail: boolean;
    status: { status: string; statusTitle: string; columns: Function }[];
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
  const tabRef = useRef<HTMLDivElement | null>(null);
  const [tabWidth, setTabWidth] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);

  const updateWidth = () => {
    if (tabRef.current) {
      const parentWidth = tabRef.current.getBoundingClientRect().width;
      const numberOfButtons = config.status.length;
      const newButtonWidth = parentWidth / numberOfButtons;
      setTabWidth(newButtonWidth);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateWidth);
    if (tabRef.current) {
      resizeObserver.observe(tabRef.current);
    }

    return () => {
      if (tabRef.current) {
        resizeObserver.unobserve(tabRef.current);
      }
    };
  }, [config.status.length]);

  const defaultFilterObject = useMemo(() => {
    return config.filter.reduce((acc, curr) => {
      acc[curr.filter] = true;
      return acc;
    }, {} as Record<string, boolean>);
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
      style={{
        width: tabWidth,
      }}
      onClick={() => {
        const foundStatus = config.status.find(
          (object) => object.status === status
        );
        if (foundStatus) {
          setCurrentTab(config.status.indexOf(foundStatus));
        } else {
          // Handle the case where the status is not found
          console.error(`Status "${status}" not found.`);
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
              .filter((k) => k !== key);

            const otherActive = otherKeys.some((k) => filter[k]);

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
    <div className="card pt-5">
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className="flex items-center text-1xl font-normal px-7">
            {config.title}
          </h1>
        </header>
        <nav className="relative flex flex-row pr-7 w-3/4 justify-end ">
          <div className="flex items-end mr-2">
            <FilterButtons />
          </div>
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
      </div>
      <div>
        <div className="h-full">
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
