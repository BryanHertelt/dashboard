import { formatValue } from "../../helpers";
import { NftDetailImageContainer } from "./image-container";

interface NftItem {
  name: string;
  nfturl: string;
  nftvalue: number;
}

interface NftDistributionElement {
  id: number;
  nfts: NftItem[];
}

export const ExposeNfts = ({ data }: { data: NftDistributionElement }) => {
  console.log("data", data);
  const distributionElement = data;
  return (
    <div
      key={distributionElement.id}
      className="flex flex-row w-full flex-wrap justify-start pb-5"
    >
      {distributionElement.nfts.map((nft: NftItem) => {
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
