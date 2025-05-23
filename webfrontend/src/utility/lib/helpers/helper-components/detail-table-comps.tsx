import { HoldingLogoImageContainer } from "../../helpers";
import { NftsIcon } from "../../../../../public/images";
import { formatValue, formatCurrency } from "../../helpers";
import { NftDetailImageContainer } from "../../helpers";
import logger from "../../logging/logger";

/**
 * `InfoCards` is a visual component that renders a list of distribution summary cards
 * for NFT or asset holdings. It displays metadata including the asset name, value, percentage distribution,
 * and a color indicator used in associated charts.
 * Navigation:
 * 1. Navigate to Asset Distribution
 * 2. Expand the detail component.
 * 3. Switch to Holdings or Asset Groups.
 * 4. These cards are described in the component below.
 *
 * For NFTs, a button is shown to allow toggling which distribution object is actively selected.
 *
 * ### Props
 * @param data - A nested array of distribution objects containing asset metadata (e.g., name, url, value).
 * @param tableStatus - Current table context (e.g., "nft", "cryptocurrency"); determines layout and labels.
 * @param barData - Chart data used to extract background colors for cards.
 * @param assetname - Name of the asset shown in the card (used in formatting).
 * @param changeActiveDisObj - Callback function to set the currently selected distribution object.
 * @param activeDisObj - ID of the currently active/selected distribution object.
 *
 * ### Behavior
 * - Flattens the nested input data array.
 * - Displays logo, name, value, currency, and distribution percentage.
 * - Color swatch indicates corresponding chart bar color.
 * - Optional toggle button appears for NFTs to highlight a selected item.
 *
 * @returns A list of flexbox cards displaying key holding data with optional interactivity.
 */
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
  logger.info("InfoCards called");
  logger.debug("InfoCards: active Object", activeDisObj);

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

/**
 * `StopLossCards` displays stop-loss and take-profit (SL/TP) values, including partial SL/TP settings,
 * in a compact, readable card format. Each partial configuration includes a quantity and individual SL/TP values.
 *
 * Navigation:
 * 1. Navigate to asset distribution.
 * 2. Select derivatives in the asset table.
 * 3. Expand the detail
 *
 *
 * ### Props
 * @param sltp - SL/TP configuration object.
 * @param sltp.sl - Main stop-loss percentage (nullable).
 * @param sltp.tp - Main take-profit percentage (nullable).
 * @param sltp.partial - An array of partial SL/TP settings.
 * @param sltp.partial[].id - Unique identifier.
 * @param sltp.partial[].quantity - Quantity for this partial position.
 * @param sltp.partial[].tp - Partial take-profit value.
 * @param sltp.partial[].sl - Partial stop-loss value.
 *
 * ### Behavior
 * - Renders overall SL/TP percentages if provided.
 * - Iterates through `partial` array to render a series of SL/TP cards with quantity information.
 * - Displays color-coded profit/loss values for clarity.
 *
 * @returns A vertically stacked set of SL/TP value cards.
 */
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
  logger.info("StopLossCards called");
  return (
    <div className="w-full">
      <span className="flex flex-row gap-2 mb-2 ">
        <p>SL/TP:</p>
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

/**
 * `DetailNfts` displays a horizontal list of NFT cards within an expanded detail component.
 * Each NFT is shown with its image, name, and ETH value. Designed for use inside detailed views
 * of NFT distribution objects.
 *
 * Navigation:
 * 1. Navigate to asset distribution.
 * 2. Select nfts in the asset table.
 * 3. Expand the detail.
 * 4. Click on one asset group.
 *
 * ### Props
 * @param data - An object containing a list of NFTs to display.
 * @param data.id - Unique ID of the distribution group (used as key).
 * @param data.nfts - List of NFT objects in the distribution.
 * @param data.nfts[].name - Name of the NFT.
 * @param data.nfts[].nfturl - Image URL for the NFT.
 * @param data.nfts[].nftvalue - Value of the NFT in ETH.
 *
 * ### Behavior
 * - Renders each NFT with image, truncated name (if necessary), and formatted ETH value.
 * - Visually separates each NFT with a vertical border, except for the first one.
 *
 * @returns A flex-wrapped horizontal list of NFT display cards.
 */
export const DetailNfts = ({ data }: { data: any }) => {
  const distributionElement = data;
  logger.info("DetailNfts called");
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
