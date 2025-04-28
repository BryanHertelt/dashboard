import { useState, useMemo, useEffect } from "react";
import { LoadingSkeleton } from "../datafetching/loading-skeleton";
import { DataTable } from "../design-components/datatables/table-layout/data-table";

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
  const [expandedRow, setExpandedRow] = useState<number | null>(0);

  useEffect(() => {
    let filtered = tableConfig.initial.filter((asset: any) => {
      return asset[tableConfig.statusFilter] === tableStatus;
    });

    if (tableStatus === "derivative") {
      if (filterType.perp && filterType.future) {
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
    setExpandedRow(0);
  }, [tableStatus, filterType, tableConfig.initial]);

  const col = useMemo(() => {
    const statusConfig = tableConfig.status.find(
      (s: any) => s.status === tableStatus
    );

    if (!statusConfig) return [];

    return statusConfig.columns;
  }, [tableStatus, tableData]);

  const realStatus = tableData.map(
    (asset: any) => asset[tableConfig.statusFilter]
  );

  return (
    <div className="">
      <DataTable
        data={tableData}
        columns={col}
        expandedRow={expandedRow}
        tableStatus={tableStatus}
        currentValue={tableConfig.currentValue}
        setExpandedRow={setExpandedRow}
      />
    </div>
  );
};

export default AssetTableController;
