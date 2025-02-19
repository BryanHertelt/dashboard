"use client";
import { DataTable } from "@/utility/lib/design-components/datatables/table-layout/data-table";
import {
  formatDataColsCurrency,
  formatDataColsNft,
  formatDataColsDerivative,
} from "@/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import { useState, useEffect } from "react";
import { AssetDataType } from "../types/data-fetching-types";
import { DerivativesDataInterface } from "../types/data-fetching-types";
import { CryptocurrencyDataInterface } from "../types/data-fetching-types";
import { NFTDataInterface } from "../types/data-fetching-types";

interface initialTableComponentData {
  initial: AssetDataType[];
}

const DetailTableComponent = (props: initialTableComponentData) => {
  const [tableStatus, setTableStatus] = useState("cryptocurrency");
  const [tableData, setTableData] = useState(props.initial);
  const [col, setCol] = useState<any>(formatDataColsCurrency(props.initial));
  const [header, setHeader] = useState("Cryptocurrencies");

  useEffect(() => {
    if (tableStatus === "nft") {
      const newData = props.initial.filter(
        (asset) => asset.assettype === "nft"
      );
      if (newData !== tableData) {
        setTableData(newData);
        setCol(formatDataColsNft(newData));
        setHeader("NFTs");
      }
    }
    if (tableStatus === "cryptocurrency") {
      const newData = props.initial.filter(
        (asset) => asset.assettype === "cryptocurrency"
      );
      if (newData !== tableData) {
        setTableData(newData);
        setCol(formatDataColsCurrency(newData));
        setHeader("Cryptocurrencies");
      }
    }
    if (tableStatus === "derivative") {
      const newData = props.initial.filter(
        (asset) => asset.assettype === "derivative"
      );
      if (newData !== tableData) {
        setTableData(newData);
        setCol(formatDataColsDerivative(newData));
        setHeader("Derivatives");
      }
    }
  }, [tableStatus]);

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
          <button
            onClick={() => setTableStatus("cryptocurrency")}
            className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md"
          >
            {" "}
            Cryptocurrencies{" "}
          </button>
          <button
            onClick={() => {
              setTableStatus("nft");
            }}
            className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md"
          >
            {" "}
            NFTs{" "}
          </button>
          <button
            onClick={() => setTableStatus("derivative")}
            className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md"
          >
            {" "}
            Derivatives{" "}
          </button>
        </nav>
      </div>
      <div>
        <DataTable columns={col} data={tableData} />
      </div>
    </>
  );
};

export default DetailTableComponent;
