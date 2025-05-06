import { HoldingLogoImageContainer } from "./image-container";
import { NftsIcon } from "../../../../public/images";
import { formatValue, formatCurrency } from "./helper-functions";
import { NftDetailImageContainer } from "./image-container";

export const InfoCards = ({
  data,
  tableStatus,
  barData,
  assetname,
  changeActiveDisObj,
  activeDisObj,
}: {
  data: any[];
  tableStatus: string | undefined;
  barData: { data: any; options: any };
  assetname: string | undefined;
  changeActiveDisObj: Function;
  activeDisObj: number | null;
}) => {
  const flatArray = data.flat();

  return flatArray.map((disObj: any, index: number) => {
    const active =
      tableStatus != "nft" || disObj.name === "Others"
        ? "hidden"
        : disObj.id === activeDisObj
        ? "text-blue"
        : "text-icongray";

    return (
      <div
        className={` flex flex-col flex-grow justify-around card mb-2 w-1/4 py-3 px-3 sm:h-20 md:h-20 lp:h-16 lg:h-16 xl:h-16`}
        key={disObj.id}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray">
            <div className="mr-1.5">
              <HoldingLogoImageContainer
                url={disObj.url}
                alt={`${disObj.name} Logo in Asset Detail Component`}
                placeholder={"HL"}
              />{" "}
            </div>{" "}
            {disObj.name}
          </div>
          <div className="flex flex-row items-center">
            <button
              className={` ${active} mr-1 text-base`}
              onClick={() =>
                activeDisObj === disObj.id
                  ? changeActiveDisObj(null)
                  : changeActiveDisObj(disObj.id)
              }
            >
              {" "}
              <NftsIcon />{" "}
            </button>
            <span
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: !disObj.other
                  ? barData.data.datasets[index].backgroundColor
                  : "#D9D9D9",
              }}
            />
          </div>
        </div>
        <div className="flex flex-row align-middle">
          <>
            <div
              className={`flex flex-row font-semibold mr-3 text-sm sm:text-xs md:text-xs lp:text-xs `}
            >
              <p className="mr-1">
                {tableStatus === "nft"
                  ? `${disObj.assetvalue} NFTs`
                  : `${formatValue(disObj.assetvalue)} ${assetname}`}
              </p>
              <p
                className={`flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray border-r-2 mr-1 pr-1 font-normal`}
              >
                ~{" "}
                {tableStatus === "nft"
                  ? `${formatValue(disObj.currencyvalue)} ETH`
                  : formatCurrency(disObj.currencyvalue)}
              </p>{" "}
              <p
                className={`flex flex-row text-sm sm:text-xs md:text-xs lp:text-xs text-icongray font-normal `}
              >
                {" "}
                {formatValue(Number(disObj.distribution))}%
              </p>
            </div>{" "}
          </>
        </div>
      </div>
    );
  });
};

export const StopLossCards = ({
  sltp,
}: {
  sltp:
    | {
        sl: number | null;
        tp: number | null;
        partial: {
          id: number;
          quantity: number;
          tp: number | null;
          sl: number | null;
        }[];
      }
    | undefined;
}) => {
  return (
    <div className="w-full">
      <span className="flex flex-row gap-2 mb-2 ">
        {" "}
        SL/TP:{" "}
        <p className="pl-1 text-red">
          {" "}
          {formatValue(Number(sltp?.sl === null ? NaN : Number(sltp?.sl)))} %
        </p>
        /{" "}
        <p className="text-green">
          {formatValue(Number(sltp?.tp === null ? NaN : Number(sltp?.tp)))}%{" "}
        </p>
      </span>
      <p className="mb-2">
        {" "}
        {sltp?.partial.length != 0 ? "Partial SL/TP:" : null}{" "}
      </p>
      <div className="flex flex-row gap-3 overflow-scroll w-full mb-2">
        {sltp?.partial?.map((parEl) => {
          return (
            <div
              className="flex flex-col bg-gray px-3 pt-3 pb-2 rounded-md"
              key={parEl.id}
            >
              <div className="flex flex-row w-full ">
                <span className="flex flex-col justify-center items-start w-full border-r border-icongray mr-2 pr-2">
                  <p className="w-28 text-xs text-icongray mb-1">
                    {" "}
                    Take Profit
                  </p>{" "}
                  <p className="text-green">
                    {" "}
                    {formatCurrency(parEl.tp != null ? Number(parEl.tp) : NaN)}
                  </p>
                </span>
                <span className="flex flex-col justify-center items-end w-full ">
                  <p className="w-28 text-end text-xs text-icongray mb-1">
                    {" "}
                    Stop Loss
                  </p>{" "}
                  <p className="text-red">
                    {" "}
                    {formatCurrency(parEl.sl != null ? Number(parEl.sl) : NaN)}
                  </p>
                </span>
              </div>
              <span className="flex flex-row justify-center items-center mt-1 w-full">
                <p className="flex flex-row justify-end items-center text-xs text-icongray pr-1 w-1/2 h-full text-end">
                  Qty
                </p>
                <p className="flex flex-row justify-start items-center text-black font-semibold w-1/2 h-full">
                  {" "}
                  {parEl.quantity}
                </p>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DetailNfts = ({ data }: { data: any }) => {
  console.log("data", data);
  const distributionElement = data;
  return (
    <div
      key={distributionElement.id}
      className="flex flex-row w-full flex-wrap justify-start pb-5"
    >
      {distributionElement.nfts.map((nft: any) => {
        return (
          <div
            key={nft.name}
            className={`flex flex-row  mr-2 ${
              distributionElement.nfts.indexOf(nft) == 0
                ? ""
                : "border-l-2 border-l-gray"
            }`}
          >
            {
              <NftDetailImageContainer
                url={nft.nfturl}
                alt={`${nft.name} Image in Detail Component`}
                placeholder={"Pic"}
              />
            }
            <div className="flex flex-col">
              <p className="font-semibold text-black">
                {nft.name.length < 9
                  ? nft.name
                  : `${nft.name.substring(0, 9)}...`}
              </p>
              <p className="text-icongray"> {formatValue(nft.nftvalue)} ETH </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
