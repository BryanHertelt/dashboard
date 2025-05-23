import { ColumnDef } from "@tanstack/react-table";

export type StatusItem<StatusKey extends string> = {
    status: StatusKey;
    statusTitle: string;
    column: object;
  };
  
  export type FilterItem<StatusKey extends string> = {
    filter: string;
    filterTitle: string;
    filterStatus: StatusKey;
  };
  
  export type configType = {
    statusFilter: string
    initial: any[];
    detail: boolean;
    status: { status: string; statusTitle: string; columns: object[] }[];
    filter: {
      filter: string;
      filterTitle: string;
      filterStatus: string;
    }[];
    currentValue: number;
    title?: string;
  };

  export interface TableDetailProps {
    tableStatus: string | undefined;
    assetId: number;
    currentValue: number;
    totalAssetAmount: number;
    assetName?: string;
    assetSymbol?: string;
    assetUrl?: string;
  }

  export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<any, TValue>[];
    data: any;
    currentValue: number;
    detail: boolean; 
    expandedRow?: number | null;
    setExpandedRow?: any;
    tableStatus?: string;
  }
  
  
  export type AssetTableConfig<StatusKey extends string> = {
    title: string;
    initial: any[];
    currentValue: number;
    status: StatusItem<StatusKey>[];
    filter: FilterItem<StatusKey>[];
  };
  