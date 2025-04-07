import AssetTableController from "./asset-table-controller";
import { useState, useRef } from "react";
type TableStatus = "nft" | "cryptocurrency" | "derivative";

const AssetTableComponent = ({
  initial,
  currentValue,
}: {
  initial: any[];
  currentValue: number;
}) => {
  const [tableStatus, setTableStatus] = useState<TableStatus>("cryptocurrency");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [derivativeType, setDerivativeType] = useState<any>({
    perp: true,
    future: true,
  });

  const StatusButton = ({
    status,
    label,
  }: {
    status: TableStatus;
    label: string;
  }) => (
    <button
      onClick={() => {
        setTableStatus(status);
        setExpandedRow(null);
      }}
      className={`relative px-3 text-base h-full text-black rounded-md `}
    >
      {label}
    </button>
  );

  return (
    <div className="card pt-5">
      <div className="flex flex-row justify-between mb-4 h-9">
        <header>
          <h1 className=" flex flex-row justify-center h-full items-center text-1xl font-normal px-7">
            {" "}
            Assets{" "}
          </h1>
        </header>
        <nav className="flex flex-row px-7">
          {tableStatus === "derivative" ? (
            <div className="flex flex-row justify-center items-center mr-5 w-40">
              <button
                className={`${
                  derivativeType.perp === true
                    ? "border-2 px-2 border-icongray"
                    : "px-2 border-2 border-white"
                } flex mr-3 items-center justify-center rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp:
                        prevState.future !== false
                          ? !prevState.perp
                          : prevState.perp,
                      future: prevState.future,
                    };
                  });
                }}
                disabled={derivativeType.future === false}
              >
                Perpetuals
              </button>

              <button
                className={`${
                  derivativeType.future === true
                    ? "border-2 px-2 border-icongray"
                    : "px-2 w-20 border-2 border-white"
                } rounded-md text-sm px-3 py-1`}
                onClick={() => {
                  setDerivativeType((prevState: any) => {
                    return {
                      perp: prevState.perp,
                      future:
                        prevState.perp !== false
                          ? !prevState.future
                          : prevState.future,
                    };
                  });
                }}
                disabled={derivativeType.perp === false}
              >
                Future
              </button>
            </div>
          ) : null}
          <div className=" relative flex flex-row bg-gray rounded-md">
            <StatusButton status="cryptocurrency" label="Cryptocurrencies" />
            <StatusButton status="nft" label="NFTs" />
            <StatusButton status="derivative" label="Derivatives" />
          </div>
        </nav>
      </div>
      <AssetTableController
        initial={initial}
        currentValue={currentValue}
        tableStatus={tableStatus}
        derivativeType={derivativeType}
      />
    </div>
  );
};

export default AssetTableComponent;
