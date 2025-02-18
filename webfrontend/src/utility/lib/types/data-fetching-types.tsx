export interface ADcompPropsType {
  portfolioResponse: PortfolioResponseObject[];
  assetResponse: AssetResponseObject[];
}

export interface PortfolioResponseObject {
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

export interface AssetResponseObject {
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
  assetpercentagevalue: number;
  assetvalue: number;
  assetmarketprice: number;
  assetchange24h: number;
  assetchange7d: number[];
  notes: string;
}

export interface QueryConstructorInterface {
  qKey: string[];
  initialData?: PortfolioResponseObject[] | AssetResponseObject[];
  slug: string;
  searchquery: string;
  staleTime: number;
  cacheTime?: number;
}
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
