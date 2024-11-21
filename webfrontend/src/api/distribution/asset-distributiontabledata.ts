export type CryptoCurrencyResponseObject = {
    symbol: string, 
    assettype: string, 
    id: string, 
    assetname: string, 
    assetabbreviation: string, 
    assetamount: number, 
    assetpercentage: number, 
    assetpercentagevalue: number
    assetvalue: number, 
    assetmarketprice: number, 
    assetchange24h: number, 
    assetchange7d: number[],
    notes: string
}

export type AssetGroupResponseObject = {
  id: string , 
  groupname: string, 
  assetcount: number , 
  groupvalue: number, 
  grouppercentage: number, 
  groupchange24h: number , 
  groupchange24hvalue: number , 
  groupchange7d: number[], 
  description: string
}

export type HoldingsResponseObject = {
  id: string , 
  holdingname: string, 
  assetcount: number , 
  holdingvalue: number, 
  holdingpercentage: number, 
  holdingchange24h: number , 
  holdingchange24hvalue: number , 
  holdingchange7d: number[], 
  description: string
}

export const cryptocurrencyMockData: CryptoCurrencyResponseObject[] = [
    {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eadlk4jas1dwq2et478",
        assetname: "Bitcoin",
        assetabbreviation: "BTC", 
        assetamount: 10,
        assetpercentage: 23,
        assetpercentagevalue: 299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h: 7,
        assetchange7d: [890000, 880000, 887000, 8500000, 890000],
        notes: "Notes"
      }, 
      {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eadlk4ja24fwq2et478",
        assetname: "Ethereum",
        assetabbreviation: "ETH", 
        assetamount: 10,
        assetpercentage: 23,
        assetpercentagevalue: 299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h: 7,
        assetchange7d: [890000, 880000, 887000, 8500000, 890000],
        notes: "Notes"
      }, 
      {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eadlk4jasdget478",
        assetname: "BNB",
        assetabbreviation: "BNB", 
        assetamount: 10,
        assetpercentage: -23,
        assetpercentagevalue: -299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h:7,
        assetchange7d: [890000, 880000, 2000, 8500000, 890000],
        notes: "Notes"
      }, 
      {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eaasfvss1dwq2et478",
        assetname: "Dogecoin",
        assetabbreviation: "DOGE", 
        assetamount: 10,
        assetpercentage: 23,
        assetpercentagevalue: 299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h: 7,
        assetchange7d: [890000, 880000, 887000, 8500000, 890000],
        notes: "Notes"
      }, 
      {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eadlk4jas1asgvx478",
        assetname: "Solana",
        assetabbreviation: "SOL", 
        assetamount: 10,
        assetpercentage: 23,
        assetpercentagevalue: 299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h: 7,
        assetchange7d: [890000, 880000, 887000, 8500000, 890000],
        notes: "Notes"
      }, 
      {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eadlk4jas1asfy234",
        assetname: "Tether",
        assetabbreviation: "USDT", 
        assetamount: 10,
        assetpercentage: 23,
        assetpercentagevalue: 299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h: 7,
        assetchange7d: [890000, 880000, 887000, 8500000, 890000],
        notes: "Notes"
      }, 

      {
        symbol: "A",
        assettype : "Cryptocurrency",
        id: "eadlk4jasflkyjvklwq38",
        assetname: "Tron",
        assetabbreviation: "TRX", 
        assetamount: 10,
        assetpercentage: 23,
        assetpercentagevalue: 299, 
        assetvalue: 890000,
        assetmarketprice: 89000,
        assetchange24h: 7,
        assetchange7d: [890000, 880000, 897000, 8500000, 890000],
        notes: "Notes"
      }
]

export const assetGroupData: AssetGroupResponseObject[] = [
  {
    id: "we342asfja" , 
    groupname: "Asset Group 1", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we342asdffja" , 
    groupname: "Asset Group 2", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we342a3sffja" , 
    groupname: "Asset Group 3", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: -21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we342asxsdfa" , 
    groupname: "Asset Group 4", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we342asxsfqa" , 
    groupname: "Asset Group 5", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we342aasdfqa" , 
    groupname: "Asset Group 6", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "asfe342asfja" , 
    groupname: "Asset Group 7", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we342axfgq2fja" , 
    groupname: "Asset Group 8", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we34xfawcfsfja" , 
    groupname: "Asset Group 9", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  },
  {
    id: "we34jkol9fja" , 
    groupname: "Asset Group 10", 
    assetcount: 10 , 
    groupvalue: 2300 , 
    grouppercentage: 10 , 
    groupchange24h: 21 , 
    groupchange24hvalue: 1700 , 
    groupchange7d: [890000, 880000, 897000, 8500000, 890000], 
    description: "description"
  }
]

export const holdingsData: HoldingsResponseObject[] = [
  {
      id: "we342asfja" , 
      holdingname: "Holding 1", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342sfdvsfja" , 
      holdingname: "Holding 2", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342asfghja" , 
      holdingname: "Holding 3", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342asfyxcdja" , 
      holdingname: "Holding 4", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342asf2sdja" , 
      holdingname: "Holding 5", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342asfjaff" , 
      holdingname: "Holding 6", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "wey3fa42asfja" , 
      holdingname: "Holding 7", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342asf3ddd" , 
      holdingname: "Holding 8", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we342akfksfja" , 
      holdingname: "Holding 9", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    },
    {
      id: "we3yc42asxcfja" , 
      holdingname: "Holding 10", 
      assetcount: 13 , 
      holdingvalue: 2340 , 
      holdingpercentage: 10 , 
      holdingchange24h: 22 , 
      holdingchange24hvalue: 1700 , 
      holdingchange7d: [890000, 87000, 897000, 8501000, 890030], 
      description: "description"
    }
]

