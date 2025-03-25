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
    perp: false,
    future: false,
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

  const col = useMemo(() => {
    const { data, format } = getFilteredData(tableStatus);
    return format(data, queryClient, setExpandedRow);
  }, [tableStatus]);

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
      className={` px-3 text-base h-full  ${getButtonClass(status)} rounded-md`}
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
  return (
    <>
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className=" flex flex-row justify-cente h-full items-center text-1xl font-normal pl-2">
            {" "}
            Assets{" "}
          </h1>
        </header>
        <nav className="flex flex-row ">
          {tableStatus === "derivative" ? (
            <div className="flex flex-row justify-center items-center mr-5">
              <button
                className={`${
                  derivativeType.perp === true
                    ? "border-2 px-2 border-black"
                    : ""
                } mr-3`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: !prevState.perp,
                      future: prevState.future,
                    };
                  });
                }}
              >
                {" "}
                Perpetual{" "}
              </button>
              <button
                className={`${
                  derivativeType.future === true
                    ? "border-2 px-2 border-black"
                    : ""
                }`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: prevState.perp,
                      future: !prevState.future,
                    };
                  });
                }}
              >
                {" "}
                Future{" "}
              </button>
            </div>
          ) : null}
          <div className="bg-gray rounded-md">
            <StatusButton status="cryptocurrency" label="Cryptocurrencies" />
            <StatusButton status="nft" label="NFTs" />
            <StatusButton status="derivative" label="Derivatives" />
          </div>
        </nav>
      </div>
      <div className="h-5/6">
        <DataTable
          data={tableData}
          columns={col}
          expandedRow={expandedRow}
          tableStatus={tableStatus}
        />
      </div>
    </>
  );
};

export default AssetTableComponent;
