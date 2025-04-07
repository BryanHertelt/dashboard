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

const AssetTableController = ({
  initial,
  currentValue,
  tableStatus,
  derivativeType,
}: {
  initial: any[];
  currentValue: number;
  tableStatus: "nft" | "cryptocurrency" | "derivative";
  derivativeType: { perp: boolean; future: boolean };
}) => {
  const [tableData, setTableData] = useState(initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
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

  const realStatus = tableData.map((asset) => asset.assettype);

  for (let i = 0; i < tableData.length; i++) {
    if (tableStatus != realStatus[i]) {
      return <LoadingSkeleton />;
    }
  }

  console.log("table data", tableData);

  return (
    <div>
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

export default AssetTableController;
