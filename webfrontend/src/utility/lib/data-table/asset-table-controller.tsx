import { useState, useMemo, useEffect } from "react";
import { SmallLoadingSkeleton } from "../data-fetching";
import { DataTable } from "../data-table";
import logger from "../logging/logger";

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

  useEffect(() => {
    logger.info({
      message: "AssetTableController called",
      tableStatus,
      filterType,
      initialDataCount: tableConfig.initial?.length || 0,
    });

    let filtered = tableConfig.initial.filter((asset: any) => {
      return asset[tableConfig.statusFilter] === tableStatus;
    });

    logger.info({
      message: "Applied status filter",
      tableStatus,
      statusFilter: tableConfig.statusFilter,
      filteredCount: filtered.length,
    });

    if (tableStatus === "derivative") {
      if (filterType.perp && filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: any) => asset.assettype === "derivative"
        );
        logger.info({
          message: "Filtered derivatives (perp and future)",
          filteredCount: filtered.length,
        });
      } else if (filterType.perp && !filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: any) =>
            asset.assettype === "derivative" &&
            asset.derivativetype === "perpetual"
        );
        logger.info({
          message: "Filtered derivatives (perpetual only)",
          filteredCount: filtered.length,
        });
      } else if (!filterType.perp && filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: any) =>
            asset.assettype === "derivative" &&
            asset.derivativetype === "future"
        );
        logger.info({
          message: "Filtered derivatives (future only)",
          filteredCount: filtered.length,
        });
      }
    }

    setTableData(filtered);
    setExpandedRow(null);
    logger.info({
      message: "Table data updated",
      tableStatus,
      filteredCount: filtered.length,
    });
  }, [tableStatus, filterType, tableConfig.initial]);

  const col = useMemo(() => {
    const statusConfig = tableConfig.status.find(
      (s: any) => s.status === tableStatus
    );

    logger.debug({
      message: "Columns configured for table",
      tableStatus,
      columnCount: statusConfig.columns?.length || 0,
    });
    return statusConfig.columns;
  }, [tableStatus, tableData]);

  logger.debug({
    message: "Rendering DataTable",
    tableStatus,
    dataCount: tableData.length,
    columnCount: col.length,
    expandedRow,
  });

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
