"use client";
import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/utility/lib/design-components/datatables/table-layout/data-table";
import LoadingSkeleton from "../loading";
import { useQueryClient } from "@tanstack/react-query";
import {
  formatDataColsCurrency,
  formatDataColsDerivative,
  formatDataColsNft,
} from "@/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";

const initialData = [
  {
    symbol: "C",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 7,
    assetpercentage: 3,
    assettype: "derivative",
    assetid: 13,
    assetname: "ETHUSDT",
    derivateexchange: "Binance",
    positiontype: "open",
    tradedirection: "long",
    derivativetype: "perpetual",
    leverage: 10,
    size: 10000,
    entry: 2000,
    unrealizedpl: -500,
    price: 1900,
    liquidationprice: 1800,
    margin: 50,
    tp: 21,
    sl: 18.5,
    settlementdate: "",
    notes: "Notes",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 1,
    assettype: "cryptocurrency",
    assetid: 1,
    assetname: "Bitcoin",
    assetabbreviation: "BTC",
    assetamount: 300000000000,
    assetvalue: 70000,
    assetmarketprice: 1400000,
    assetchange24h: 5,
    assetchange24hourvalue: 100,
    assetchange7d: [680000, 690000, 710000, 695000, 700000],
    notes: "Notes",
  },
  {
    symbol: "B",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 7,
    assetpercentage: 3,
    assettype: "nft",
    assetid: 568,
    assetname: "Pudgy Penguins",
    collectionvalue: 450,
    collectionfloorprice: 400,
    nftcount: 10,
    notes: "Notes",
  },
  {
    symbol: "C",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 7,
    assetpercentage: 3,
    assettype: "derivative",
    assetid: 12,
    assetname: "BTCUSDT",
    derivateexchange: "Bybit",
    positiontype: "open",
    tradedirection: "long",
    derivativetype: "future",
    leverage: 5,
    size: 15000,
    entry: 30000,
    unrealizedpl: 2500,
    price: 32000,
    liquidationprice: 25000,
    margin: 100,
    tp: 3,
    sl: 29,
    settlementdate: "2024-06-15T10:00:00.000Z",
    notes: "Notes",
  },
];

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

type AssetTableComponentProps<StatusKey extends string> = {
  config: AssetTableConfig<StatusKey>;
};

const formatAgeCols = (initial: any) => {
  return [
    {
      accessorKey: "age",
      header: "Some other age",
    },
    {
      accessorKey: "name",
      header: "Some other name",
    },
  ];
};

const initial = [
  {
    age: 1,
    name: "fritz",
    dog: "Martin",
    cat: "Fat Cat",
  },
  {
    age: 2,
    name: "peter",
    dog: "Martin",
    cat: "Thin Cat",
  },
  {
    age: 3,
    name: "sam",
    dog: "Marting",
    cat: "Sick cat",
  },
];

const formatCatCols = (initial: any) => {
  return [
    {
      accessorKey: "cat",
      header: "Stupid Cat",
    },
    {
      accessorKey: "dog",
      header: "Stupid dog",
    },
  ];
};

export default function BuilderPage() {
  const currentValue = 70000;

  const tableConfig = {
    title: "Assets",
    initial: initialData,
    detail: true,
    statusFilter: "assettype",
    status: [
      {
        status: "cryptocurrency",
        statusTitle: "Cryptocurrencies",
        columns: formatDataColsCurrency,
      },
      {
        status: "nft",
        statusTitle: "NFTs",
        columns: formatDataColsNft,
      },
      {
        status: "derivative",
        statusTitle: "Derivatives",
        columns: formatDataColsDerivative,
      },
    ],
    filter: [
      {
        filter: "perp",
        filterTitle: "Perpetual",
        filterStatus: "derivative",
      },
      {
        filter: "future",
        filterTitle: "Future",
        filterStatus: "derivative",
      },
    ],
    currentValue: currentValue,
  };

  return (
    <div className="mt-9 border border-none w-full mb-10 h-5/6">
      <AssetTableComponent config={tableConfig} />
    </div>
  );
}

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

  const filterObject: Record<string, boolean> = config.filter.reduce(
    (acc, curr) => {
      acc[curr.filter] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );
  const [filter, setFilter] = useState<Record<string, boolean>>(filterObject);

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
      className={`relative px-3 text-base h-full text-black rounded-md `}
    >
      {label}
    </button>
  );

  const FilterButtons = () => {
    const keys = Object.keys(filter);

    return (
      <>
        {config.filter.map(({ filter: key, filterTitle, filterStatus }) => {
          if (filterStatus === tableStatus) {
            const otherKeys = config.filter
              .filter(({ filterStatus: status }) => status === tableStatus)
              .map(({ filter }) => filter)
              .filter((k) => k !== key);

            const otherActive = otherKeys.some((k) => filter[k]);

            return (
              <button
                key={key}
                className={`${
                  filter[key]
                    ? "border-2 px-2 border-icongray"
                    : "px-2 border-2 border-white"
                } flex mr-3 items-center justify-center rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setFilter((prevState: any) => ({
                    ...prevState,
                    [key]: !prevState[key],
                  }));
                }}
                disabled={!(otherActive || !filter[key])}
              >
                {filterTitle}
              </button>
            );
          } else {
            return null;
          }
        })}
      </>
    );
  };

  console.log("config", config.initial);

  return (
    <div className="card pt-5">
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className=" flex flex-row justify-center h-full items-center text-1xl font-normal px-7">
            {config.title}
          </h1>
        </header>
        <nav className="flex flex-row px-7">
          <div className="flex flex-row justify-center items-center mr-2 w-full">
            <FilterButtons />
          </div>
          <div className=" relative flex flex-row bg-gray rounded-md">
            {config.status.map((statusConfig) => {
              return (
                <div key={statusConfig.status}>
                  <StatusButtons
                    status={statusConfig.status}
                    label={statusConfig.statusTitle}
                  />
                </div>
              );
            })}
          </div>
        </nav>
      </div>
      <AssetTableController
        tableStatus={tableStatus}
        tableConfig={config}
        filterType={filter}
      />
    </div>
  );
};

const AssetTableController = ({
  tableStatus,
  tableConfig,
  filterType,
}: {
  tableStatus: string;
  tableConfig: any;
  filterType: Record<string, boolean>;
}) => {
  const [tableData, setTableData] = useState(tableConfig.initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let filtered = tableConfig.initial.filter((asset: any) => {
      return asset[tableConfig.statusFilter] === tableStatus;
    });

    console.log("filtered", filtered);

    if (tableStatus === "derivative") {
      if (filterType.perp && filterType.future) {
        // both active, no need to filter further
        filtered = tableConfig.initial.filter(
          (asset: any) => asset.assettype === "derivative"
        );
      } else if (filterType.perp && !filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: any) =>
            asset.assettype === "derivative" &&
            asset.derivativetype === "perpetual"
        );
      } else if (!filterType.perp && filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: any) =>
            asset.assettype === "derivative" &&
            asset.derivativetype === "future"
        );
      }
    }

    setTableData(filtered);
    setExpandedRow(null);
  }, [tableStatus, filterType, tableConfig.initial]);

  console.log("filtered after", tableData);

  const col = useMemo(() => {
    const statusConfig = tableConfig.status.find(
      (s: any) => s.status === tableStatus
    );
    if (!statusConfig) return [];
    if (tableConfig.detail === true) {
      console.log("CALLED");
      return statusConfig.columns(tableData, queryClient, setExpandedRow);
    } else {
      console.log("called");
      return statusConfig.columns(tableData);
    }
  }, [tableStatus, tableData, queryClient]);

  console.log("col", col);

  const realStatus = tableData.map(
    (asset: any) => asset[tableConfig.statusFilter]
  );

  for (let i = 0; i < tableData.length; i++) {
    if (tableStatus != realStatus[i]) {
      return <LoadingSkeleton />;
    }
  }

  console.log("tableData", tableData);

  return (
    <div>
      <div className="shadow-flyzerShadow rounded-md ">
        <DataTable
          data={tableData}
          columns={col}
          expandedRow={expandedRow}
          tableStatus={tableStatus}
          currentValue={tableConfig.currentValue}
        />
      </div>
    </div>
  );
};
