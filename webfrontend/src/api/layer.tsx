export interface PortfolioDataInterface {
  portfolioid: number;
  userid: number;
  name: string;
  currentvalue: number;
  change7d: number[];
  change7dpercentage: number[];
  change3d: number[];
  change3dpercentage: number[];
  change24h: number[];
  change24hpercentage: number[];
  change12h: number[];
  change12hpercentage: number[];
  change4h: number[];
  change4hpercentage: number[];
  change1h: number[];
  change1hpercentage: number[];
  costbasis: number[];
}
export interface CryptocurrencyDataInterface {
  symbol: string;
  portfolioid: number;
  userid: number;
  groupid: number;
  holdingid: number;
  assettype: string;
  assetid: number;
  assetname: string;
  assetabbreviation: string;
  assetamount: number;
  assetpercentage: number;
  assetvalue: number;
  assetmarketprice: number;
  assetchange24h: number;
  assetchange7d: number[];
  notes: string;
  id?: string;
}
export interface NFTDataInterface {
  Symbol: string;
  portfolioid: number;
  userid: number;
  groupid: number;
  holdingid: number;
  assettype: string;
  assetid: number;
  CollectionName: string;
  CollectionValue: number;
  CollectionFloorPrice: number;
  NftCount: number;
}
export interface DerivativesDataInterface {
  Symbol: string;
  portfolioid: number;
  userid: number;
  groupid: number;
  holdingid: number;
  assettype: string;
  assetid: number;
  DerivativeName: string;
  PositionType: string;
  DerivativeType: string;
  leverage: number;
  Size: number;
  Entry: number;
  UnrealizedPL: number;
  Price: number;
  LiquidationPrice: number;
  Margin: number;
  TP: number;
  SL: number;
  SettlementDate: string | null;
}
export type AssetDataType =
  | CryptocurrencyDataInterface
  | NFTDataInterface
  | DerivativesDataInterface;
export interface AssetGroupDataInterface {
  groupid: number;
  portfolioid: number;
  userid: number;
  groupname: string;
  assetcount: number;
  groupvalue: number;
  grouppercentage: number;
  groupchange24h: number;
  groupchange24hvalue: number;
  groupchange7d: number[];
  description: string;
  id?: string;
}
export interface HoldingsDataInterface {
  holdingid: number;
  portfolioid: number;
  userid: number;
  holdingname: string;
  assetcount: number;
  holdingvalue: number;
  holdingpercentage: number;
  holdingchange24h: number;
  holdingchange24hvalue: number;
  holdingchange7d: number[];
  description: string;
  id?: string;
}

export const StructureLayer = {
  fetchDistributionUnits: async function (slug: string, searchquery: string) {
    const possibleSlugs = [
      "users",
      "portfolios",
      "assets",
      "assetgroups",
      "holdings",
    ];
    if (possibleSlugs.includes(slug)) {
      try {
        let rawdata = await fetch(
          `http://localhost:4000/${slug}?${searchquery}`,
          // while dev, need fast data updates, replace with cache strategy in build
          { cache: "no-store" }
        );
        if (!rawdata.ok) {
          throw new Error("API is not reachable");
        }
        let data = await rawdata.json();
        if (
          !Array.isArray(data) ||
          !data.every((item) => typeof item === "object" && item !== "null")
        ) {
          throw new Error(
            "Invalid response format: response isn't an array of objects"
          );
        }
        return data;
      } catch (error) {
        console.error("Error occured in fetchDistribution Units " + `${error}`);
        return ["failed"];
      }
    } else {
      console.error(`${slug} is not a valid resource`);
      return ["failed"];
    }
  },
};
