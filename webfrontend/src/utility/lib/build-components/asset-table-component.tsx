"use client";
import { DataTable } from "@/utility/lib/design-components/datatables/table-layout/data-table";
import {
  formatDataColsCurrency,
  formatDataColsNft,
  formatDataColsDerivative,
} from "@/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { LoadingSkeleton } from "../datafetching/loading-skeleton";

type TableStatus = "nft" | "cryptocurrency" | "derivative";

const AssetTableComponent = ({
  initial,
  currentValue,
}: {
  initial: any[];
  currentValue: number;
}) => {
  const [tableStatus, setTableStatus] = useState<TableStatus>("cryptocurrency");
  const [tableData, setTableData] = useState(initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [derivativeType, setDerivativeType] = useState<any>({
    perp: true,
    future: true,
  });
  const queryClient = useQueryClient();

  const getFilteredData = (status: TableStatus) => {
    const tableOptions = {
      nft: {
        data: initial.filter((asset) => asset.assettype === "nft"),
        format: formatDataColsNft,
      },
      cryptocurrency: {
        data: initial.filter((asset) => asset.assettype === "cryptocurrency"),
        format: formatDataColsCurrency,
      },
      derivative: {
        data: initial.filter((asset) => {
          if (derivativeType.perp === true && derivativeType.future === true) {
            return asset.assettype === "derivative";
          } else if (
            derivativeType.perp === true &&
            derivativeType.future === false
          ) {
            return (
              asset.assettype === "derivative" &&
              asset.derivativetype === "perpetual"
            );
          } else if (
            derivativeType.perp === false &&
            derivativeType.future === true
          ) {
            return (
              asset.assettype === "derivative" &&
              asset.derivativetype === "future"
            );
          } else {
            return asset.assettype === "derivative";
          }
        }),
        format: formatDataColsDerivative,
      },
    };
    return tableOptions[status];
  };

  useEffect(() => {
    const { data } = getFilteredData(tableStatus);
    setTableData(data);
  }, [tableStatus, derivativeType]);

  console.log("expandedRow", expandedRow);
  const col = useMemo(() => {
    const { data, format } = getFilteredData(tableStatus);
    return format(data, queryClient, setExpandedRow);
  }, [tableStatus, derivativeType]);

  const getButtonClass = (status: string) =>
    tableStatus === status ? "bg-blue text-white" : "text-black";

  const StatusButton = ({
    status,
    label,
  }: {
    status: TableStatus;
    label: string;
  }) => (
    <button
      onClick={() => {
        setTableStatus(status);
        setExpandedRow(null);
      }}
      className={` px-3 text-base h-full transition-all duration-500 ease-in-out ${getButtonClass(
        status
      )} rounded-md `}
    >
      {label}
    </button>
  );

  const realStatus = tableData.map((asset) => asset.assettype);

  for (let i = 0; i < tableData.length; i++) {
    if (tableStatus != realStatus[i]) {
      return <LoadingSkeleton />;
    }
  }

  console.log("table data", tableData);

  return (
    <div className="card pt-5">
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className=" flex flex-row justify-cente h-full items-center text-1xl font-normal px-7">
            {" "}
            Assets{" "}
          </h1>
        </header>
        <nav className="flex flex-row px-7">
          {tableStatus === "derivative" ? (
            <div className="flex flex-row justify-center items-center mr-5 w-40">
              <button
                className={`${
                  derivativeType.perp === true
                    ? "border-2 px-2 border-icongray"
                    : "px-2 border-2 border-white"
                } flex mr-3 items-center justify-center rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp:
                        prevState.future !== false
                          ? !prevState.perp
                          : prevState.perp,
                      future: prevState.future,
                    };
                  });
                }}
                disabled={derivativeType.future === false}
              >
                Perpetuals
              </button>

              <button
                className={`${
                  derivativeType.future === true
                    ? "border-2 px-2 border-icongray"
                    : "px-2 w-20 border-2 border-white"
                } rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: prevState.perp,
                      future:
                        prevState.perp !== false
                          ? !prevState.future
                          : prevState.future,
                    };
                  });
                }}
                disabled={derivativeType.perp === false}
              >
                Future
              </button>
            </div>
          ) : null}
          <div className=" flex flex-row bg-gray rounded-md">
            <StatusButton status="cryptocurrency" label="Cryptocurrencies" />
            <StatusButton status="nft" label="NFTs" />
            <StatusButton status="derivative" label="Derivatives" />
          </div>
        </nav>
      </div>
      <div className="shadow-flyzerShadow rounded-md ">
        <DataTable
          data={tableData}
          columns={col}
          expandedRow={expandedRow}
          tableStatus={tableStatus}
          currentValue={currentValue}
        />
      </div>
    </div>
  );
};

export default AssetTableComponent;
