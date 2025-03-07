import { formatValue } from "./helper-functions";
import { NftDetailImageContainer } from "./image-container";

export const ExposeNfts = (props: any) => {
  const distributionElement = props.data;
  return (
    <div
      key={distributionElement.id}
      className="flex flex-row w-full flex-wrap justify-start pl-5 pb-5"
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
