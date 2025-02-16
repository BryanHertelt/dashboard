"use client";
import { DataTable } from "@/utility/extlib/datatable/data-table";
import useDistributionData from "@/utility/lib/distribution/hooks/distributionHook";
import {
  formatDataColsCurrency,
  formatDataColsNft,
  formatDataColsDerivative,
} from "@/utility/lib/dataformatters/formatdatacols";
import { useState, useEffect } from "react";

const DetailTableComponent = (props: any) => {
  const [tableStatus, setTableStatus] = useState("cryptocurrency");
  const [tableData, setTableData] = useState(props.initial);
  const [col, setCol] = useState<any>(formatDataColsCurrency(props.initial));
  const [header, setHeader] = useState("Cryptocurrencies");

  const { processedQueryData, isLoading }: any = useDistributionData([
    {
      qKey: ["AssetAD", `${tableStatus}`],
      slug: "assets",
      searchquery: `assettype=${tableStatus}`,
      staleTime: 0, // Keep data fresh until you manually invalidate
      cacheTime: 1000 * 60 * 5,
    },
  ]);

  useEffect(() => {
    if (tableStatus === "nft") {
      const newTableData = processedQueryData[0].data;
      if (newTableData !== tableData) {
        setTableData(newTableData);
        setCol(formatDataColsNft(newTableData));
        setHeader("NFTs");
      }
    }
    if (tableStatus === "cryptocurrency") {
      const newTableData = processedQueryData[0].data;
      if (newTableData !== tableData) {
        setTableData(newTableData);
        setCol(formatDataColsCurrency(newTableData));
        setHeader("Cryptocurrencies");
      }
    }
    if (tableStatus === "derivative") {
      const newTableData = processedQueryData[0].data;
      if (newTableData !== tableData) {
        setTableData(newTableData);
        setCol(formatDataColsDerivative(newTableData));
        setHeader("Derivatives");
      }
    }
  }, [tableStatus, processedQueryData, tableData]);

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
