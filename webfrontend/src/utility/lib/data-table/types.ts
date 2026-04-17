import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Asset, Group, Holding } from "../types/data-fetching-types";

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
    initial: (Asset | Group | Holding)[];
    detail: boolean;
    status: { status: string; statusTitle: string; columns: object[] }[];
    filter: {
      filter: string;
      filterTitle: string;
      filterStatus: string;
    }[];
    addOns : {
      addOnStatus: string; 
      addOnTitle: string; 
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
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    currentValue: number;
    detail: boolean;
    expandedRow?: number | null;
    setExpandedRow?: Dispatch<SetStateAction<number | null>>;
    tableStatus?: string;
  }
  
  
  export type AssetTableConfig<StatusKey extends string> = {
    title: string;
    initial: (Asset | Group | Holding)[];
    currentValue: number;
    status: StatusItem<StatusKey>[];
    filter: FilterItem<StatusKey>[];
  };
  