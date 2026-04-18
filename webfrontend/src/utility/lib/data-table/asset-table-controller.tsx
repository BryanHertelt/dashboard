import React from "react";
import { useState, useMemo, useEffect } from "react";
import { DataTable } from "../data-table";
import logger from "../logging/logger";
import { configType } from "./types";
import { ColumnDef } from "@tanstack/react-table";
import { Asset, Group, Holding } from "../types/data-fetching-types";

/**
 * `AssetTableController` is a container component responsible for
 * filtering and managing asset table data based on the selected status
 * and active filters. It processes the data and passes it along with
 * the appropriate configuration to the `DataTable` component for rendering.
 *
 * ### Props
 * @param tableStatus - The currently selected status tab (e.g., "cryptocurrency", "derivative", "nft").
 * @param tableConfig - Configuration object including:
 * - `initial`: the raw, unfiltered dataset.
 * - `status`: status tab configurations with column definitions.
 * - `filter`: filter button definitions tied to specific statuses.
 * - `currentValue` (optional): current market value or similar numerical metric.
 * @param filterType - A key-value map representing active filters,
 *   such as `{ perp: true, future: false }`.
 *
 * ### Internal State
 * - `tableData` - Holds the currently filtered list of assets shown in the table.
 * - `expandedRow: number | null` - Tracks the currently expanded row in the table, if any.
 *
 * ### Behavior
 * - Applies the `tableStatus` and `filterType` values to filter the raw `initial` data.
 * - Updates internal `tableData` state accordingly when filters or status change.
 * - Automatically resets expanded rows when filters/status update.
 * - Computes the columns to render based on the current status configuration.
 *
 * @returns A rendered `DataTable` containing the filtered asset data,
 * configured columns, and UI interaction for expanding table rows.
 */
const AssetTableController = ({
  tableStatus,
  tableConfig,
  filterType,
}: {
  tableStatus: string;
  tableConfig: configType;
  filterType: Record<string, boolean>;
}): React.ReactElement => {
  const [tableData, setTableData] = useState(tableConfig.initial);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  /**
   * Applies filtering logic whenever the table status or filter settings change.
   * Filters data based on the `statusFilter` key in the config, and handles special
   * logic for derivative assets.
   */
  useEffect(() => {
    logger.info(
      { tableStatus, filterType, initialDataCount: tableConfig.initial?.length || 0 },
      "AssetTableController: called"
    );

    let filtered = tableConfig.initial.filter((asset: Asset | Group | Holding) => {
      if (tableConfig.statusFilter === "") {
        return asset;
      }
      return asset[tableConfig.statusFilter] === tableStatus;
    });

    logger.debug(
      { tableStatus, statusFilter: tableConfig.statusFilter, filteredCount: filtered.length },
      "AssetTableController: applied status filter"
    );

    if (tableStatus === "derivative") {
      if (filterType.perp && filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: Asset | Group | Holding) => "assettype" in asset && asset.assettype === "derivative"
        );
      } else if (filterType.perp && !filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: Asset | Group | Holding) =>
            "assettype" in asset && asset.assettype === "derivative" &&
            "derivativetype" in asset && asset.derivativetype === "perpetual"
        );
        logger.debug({ filteredCount: filtered.length }, "Filtered derivatives (future only)");
      } else if (!filterType.perp && filterType.future) {
        filtered = tableConfig.initial.filter(
          (asset: Asset | Group | Holding) =>
            "assettype" in asset && asset.assettype === "derivative" &&
            "derivativetype" in asset && asset.derivativetype === "future"
        );
        logger.debug({ filteredCount: filtered.length }, "Filtered derivatives (future only)");
      }
    }

    setTableData(filtered);
    setExpandedRow(null);
    logger.info(
      { tableStatus, filteredCount: filtered.length },
      "AssetTableController: table data updated"
    );
  }, [tableStatus, filterType, tableConfig.initial]);

  const col: ColumnDef<Asset | Group | Holding>[] | undefined = useMemo(() => {
    const statusConfig = tableConfig.status.find(
      (s) => s.status === tableStatus
    );

    logger.info(
      { tableStatus, columnCount: statusConfig?.columns?.length || 0 },
      "AssetTableController: columns configured for table"
    );
    return statusConfig?.columns;
  }, [tableStatus, tableData]);

  logger.debug(
    { tableStatus, dataCount: tableData.length, columnCount: col?.length, expandedRow },
    "AssetTableController: rendering DataTable"
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
        detail={tableConfig.detail}
      />
    </div>
  );
};

export default AssetTableController;
