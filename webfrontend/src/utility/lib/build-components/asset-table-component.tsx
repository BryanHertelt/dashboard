import { useMemo, useState } from "react";
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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
      onClick={() => {
        setTableStatus(status);
        setExpandedRow(null);
      }}
      className="relative px-3 text-base h-full text-black rounded-md"
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
        <nav className="flex flex-row px-7">
          <div className="flex items-center mr-2 w-full">
            <FilterButtons />
          </div>
          <div className="relative flex flex-row bg-gray rounded-md">
            {config.status.map((statusConfig) => (
              <div key={statusConfig.status}>
                <StatusButtons
                  status={statusConfig.status}
                  label={statusConfig.statusTitle}
                />
              </div>
            ))}
          </div>
        </nav>
      </div>
      <div>
        <div className="h-96">
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
