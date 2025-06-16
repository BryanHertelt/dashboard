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

export interface TimeFrameResponseObject{
  x: string, 
  y: number
}

export interface QueryConstructorInterfaceDistribution {
  qKey: string[];
  initialData?: PortfolioResponseObject[] | AssetResponseObject[] | TimeFrameResponseObject[] ;
  slug: string;
  staleTime?: number;
  queryFunction: any; 
  cacheTime?: number;
  searchquery?: string;
}

export interface QueryConstructorInterfaceChart {
  qKey: string[];
  initialData: PortfolioResponseObject[] | AssetResponseObject[] | TimeFrameResponseObject[] ;
  slug?: string;
  staleTime?: number
  cacheTime?: number;
  searchquery: string; 
  scope: string
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
  ollectionName: string;
  collectionValue: number;
  collectionFloorPrice: number;
  nftCount: number;
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


// new Types 
interface BaseAsset {
  symbol: string;
  scope: "asset" | "group" | "holding"
  portfolioid: number;
  userid: number;
  groupid: number;
  holdingid: number;
  assettype: 'nft' | 'derivative' | 'cryptocurrency';
  assetid: number;
  assetname: string;
  assetpercentage?: number;
  profitloss: number;
  profitlosschange: number;
  notes?: string;
}

export interface NFTAsset extends BaseAsset {
  assettype: 'nft';
  collectionvalue: number;
  collectionvalueeth: number;
  collectionfloorprice: number;
  assetamount: number;
}

export interface DerivativeAsset extends BaseAsset {
  assettype: 'derivative';
  derivativeexchange: string;
  positiontype: 'open' | 'closed';
  tradedirection: 'long' | 'short';
  derivativetype: 'perpetual' | 'futures' | string;
  leverage: number;
  assetvalue: number;
  entry: number;
  unrealizedpl: number;
  price: number;
  liquidationprice: number;
  margin: number;
  tp: number;
  sl: number;
  settlementdate: string;
}

export interface CryptoAsset extends BaseAsset {
  assettype: 'cryptocurrency';
  assetabbreviation: string;
  assetamount: number;
  assetvalue: number;
  assetmarketprice: number;
  assetchange24h: number;
  assetchange24hourvalue: number;
  assetchange7d: number[];
}

export interface DistributionCrypto extends CryptoAsset {
  distribution: number, 
  color:string
}
export interface DistributionNFT extends NFTAsset {
  distribution: number, 
  color: string
}

export interface DistributionDerivative extends DerivativeAsset {
  distribution: number, 
  color: string
}

export type Asset = NFTAsset | DerivativeAsset | CryptoAsset;
export type DistributionAsset = DistributionCrypto | DistributionDerivative | DistributionNFT

 interface OtherCryptoChart  {
  value: number,
  label: string, 
  distribution: number 
}
interface OtherNFTChart  {
  value: number , 
  label:string, 
  distribution: number 
}
interface OtherDerivativeChart {
  value: number, 
  label: string, 
  distribution: number
}

export type OtherAssetsChart = OtherCryptoChart | OtherNFTChart | OtherDerivativeChart 

interface MainCryptoChart {
distribution: number, 
label: string
}
interface MainNFTChart  {
  distribution: number, 
label: string
}
interface MainDerivativeChart{
  distribution: number, 
  label: string
}

export type MainAssetsChart = MainCryptoChart | MainNFTChart | MainDerivativeChart


export interface QueryConstructorInterface {
  qKey: string[], 
  slug: string,
  staleTime: number,
  queryFunction: Function, 
  distributionScope: "all" | "group" | "holding", 
  cacheTime?: number,
  initialData?: Asset[] | AssetGroups | AssetHoldings, 
}

export interface MutationConstructorInterface {
mutationFn: Function, 
holdingId: string, 
onSuccess: Function, 
onError: Function, 
queryClient: any, 
setSyncStatus: Function, 
}

export type AssetGroups = {
  portfolioid: number;
  currentvalue: number;
  groups: Group[];
};

export interface Group{
  scope:"holding" | "group" | "asset"
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
  profitloss: number, 
  profitlosschange: number, 
  description: string;
};

export interface DistributionGroup extends Group {
distribution: number,
color: string
}

export type AssetHoldings = {
  portfolioid: number;
  currentvalue: number;
  holdings: Holding[];
};

export interface Holding {
  scope: "holding" | "group" | "asset";
  holdingid: number;
  portfolioid: number;
  custom: boolean, 
  symbol: string, 
  userid: number;
  holdingname: string;
  assetcount: number;
  holdingvalue: number;
  holdingpercentage: number;
  holdingchange24h: number;
  holdingchange24hvalue: number;
  holdingchange7d: number[];
  profitloss: number;
  profitlosschange: number;
  description: string;
};

export interface DistributionHolding extends Holding {
  distribution: number;
  color: string;
}