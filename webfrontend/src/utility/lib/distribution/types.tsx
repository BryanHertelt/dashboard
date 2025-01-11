export interface QueryConstructorInterface {
  qKey: string[];
  initialData: PortfolioResponseObject[] | AssetResponseObject[];
  slug: string;
  searchquery: string;
}

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
