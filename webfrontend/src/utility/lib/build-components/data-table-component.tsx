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

const TableComponent = ({ initial }: { initial: any[] }) => {
  const [tableStatus, setTableStatus] = useState<TableStatus>("cryptocurrency");
  const [tableData, setTableData] = useState(initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [header, setHeader] = useState("Cryptocurrencies");
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
        header: "NFTs",
      },
      cryptocurrency: {
        data: initial.filter((asset) => asset.assettype === "cryptocurrency"),
        format: formatDataColsCurrency,
        header: "Cryptocurrencies",
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
        header: "Derivatives",
      },
    };
    return tableOptions[status];
  };

  useEffect(() => {
    const { data, header } = getFilteredData(tableStatus);
    setTableData(data);
    setHeader(header);
  }, [tableStatus, derivativeType]);

  const col = useMemo(() => {
    const { data, format } = getFilteredData(tableStatus);
    return format(data, setExpandedRow, queryClient);
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
      onClick={() => setTableStatus(status)}
      className={` px-2 text-base h-full  ${getButtonClass(status)} rounded-md`}
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
      <div className="flex flex-row justify-between mb-7">
        <header>
          <h1 className="font-semibold text-xl">{header}</h1>
          <p className="text-icongray">
            You can see all your {header.toLowerCase()} here.
          </p>
        </header>
        <nav className="flex flex-row">
          {tableStatus === "derivative" ? (
            <div>
              <button
                className={`${
                  derivativeType.perp === true ? "border border-black" : ""
                }`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: !prevState.perp,
                      future: prevState.future,
                    };
                  });
                  console.log(
                    "This is the prev state, when clicking on perp",
                    derivativeType
                  );
                }}
              >
                {" "}
                Perpetual{" "}
              </button>
              <button
                className={`${
                  derivativeType.future === true ? "border border-black" : ""
                }`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: prevState.perp,
                      future: !prevState.future,
                    };
                  });
                  console.log(
                    "This is the prev state, when clicking on perp",
                    derivativeType
                  );
                }}
              >
                {" "}
                Future{" "}
              </button>
            </div>
          ) : null}
          <StatusButton status="cryptocurrency" label="Cryptocurrencies" />
          <StatusButton status="nft" label="NFTs" />
          <StatusButton status="derivative" label="Derivatives" />
        </nav>
      </div>
      <div>
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

export default TableComponent;
