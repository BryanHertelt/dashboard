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

const DetailTableComponent = ({ initial }: { initial: any[] }) => {
  const [tableStatus, setTableStatus] = useState<TableStatus>("cryptocurrency");
  const [tableData, setTableData] = useState(initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [header, setHeader] = useState("Cryptocurrencies");
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
        data: initial.filter((asset) => asset.assettype === "derivative"),
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
  }, [tableStatus]);

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
      className={`mr-5 px-2 text-base h-5/6 ${getButtonClass(
        status
      )} rounded-md`}
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
        <nav className="flex flex-row justify-around">
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

export default DetailTableComponent;
