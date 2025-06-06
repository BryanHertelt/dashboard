

import { dataColsCurrency, dataColsDerivative, dataColsNft } from "../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols";

export const mockInitial = [
    {
        "symbol": "A",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 1,
        "holdingid": 1,
        "assettype": "cryptocurrency",
        "assetid": 1,
        "assetname": "Bitcoin",
        "assetabbreviation": "BTC",
        "assetamount": 0.5,
        "assetpercentage": 5,
        "assetvalue": 700000,
        "assetmarketprice": 1400000,
        "assetchange24h": 4,
        "profitloss": 1020, 
        "profitlosschange": 20, 
        "assetchange24hourvalue": 35000,
        "assetchange7d": [680000, 690000, 710000, 695000, 700000],
        "notes": "Notes"
    },
    {
      "symbol": "C",
      "portfolioid": 1,
      "userid": 1,
      "groupid": 2,
      "holdingid": 7,
      "assetpercentage": 3,
      "assettype": "derivative",
      "assetid": 12,
      "assetname": "BTCUSDT",
      "derivateexchange":"Bybit" ,
      "positiontype": "open",
      "tradedirection": "long", 
      "derivativetype": "future",
      "leverage": 5,
      "assetvalue": 15000, 
      "size": 15000,
      "entry": 30000,
      "unrealizedpl": 2500,
      "price": 32000,
      "liquidationprice": 25000,
      "margin": 100,
      "tp": 3,
      "sl": 29,
      "profitloss": 1000, 
        "profitlosschange": 26, 
      "settlementdate": "2024-06-15T10:00:00.000Z",
       "notes": "Notes"
    },
    {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 18,
        "assetname": "LTCUSDT",
        "derivateexchange":"Bybit" ,
        "positiontype": "open",
        "tradedirection": "short", 
        "derivativetype": "perpetual",
        "leverage": 15,
        "assetvalue": 50000, 
        "size": 5000,
        "entry": 10,
        "unrealizedpl": -250,
        "price": 95,
        "liquidationprice": 85,
        "margin": 35,
        "tp": 10,
        "sl": null,
        "profitloss": -1030, 
        "profitlosschange": 21, 
        "settlementdate": "",
         "notes": "Notes"
      },
    {
      "symbol": "B",
      "portfolioid": 1,
      "userid": 1,
      "groupid": 2,
      "holdingid": 7,
      "assetpercentage": 3,
      "assettype": "nft",
      "assetid": 312,
      "assetname": "Bored Ape Yacht Club",
      "collectionvalue": 1200,
      "profitloss": 1040, 
        "profitlosschange": 26, 
      "collectionfloorprice": 1200,
      "collectionvalueeth": 1,
      "assetamount": 20,
      "notes": "Notes"
    }, 
    {
      "symbol": "A",
      "portfolioid": 1,
      "userid": 1,
      "groupid": 1,
      "holdingid": 1,
      "assettype": "cryptocurrency",
      "assetid": 2,
      "assetname": "Ethereum",
      "assetabbreviation": "ETH",
      "assetamount": 0.4,
      "assetpercentage": -3,
      "assetvalue": 72000,
      "profitloss": -120, 
      "profitlosschange": -34, 
      "assetchange24h": -2,
      "assetchange24hourvalue": -3500,
      "assetchange7d": [680000, 690000, 710000, 695000, 700000],
      "notes": "Notes"
  },
  {
    "symbol": "C",
    "portfolioid": 1,
    "userid": 1,
    "groupid": 2,
    "holdingid": 7,
    "assetpercentage": 3,
    "assettype": "derivative",
    "assetid": 12,
    "assetname": "USDTUSDC",
    "derivateexchange":"Binance" ,
    "positiontype": "open",
    "tradedirection": "long", 
    "derivativetype": "future",
    "leverage": 3,
    "assetvalue": 1000, 
    "size": 1000,
    "entry": 3020,
    "unrealizedpl": 2501,
    "price": 32020,
    "liquidationprice": 25050,
    "margin": 105,
    "tp": 32,
    "sl": 9,
    "profitloss": -1001, 
      "profitlosschange": -25, 
    "settlementdate": "2024-06-15T10:00:00.000Z",
     "notes": "Notes"
  },
  {
    "symbol": "B",
    "portfolioid": 1,
    "userid": 1,
    "groupid": 2,
    "holdingid": 7,
    "assetpercentage": 3,
    "assettype": "nft",
    "assetid": 312,
    "assetname": "Bored Ae Yacht",
    "collectionvalue": 1210,
    "profitloss": -1340, 
      "profitlosschange": -6, 
    "collectionfloorprice": 1210,
    "collectionvalueeth": 2,
    "assetamount": 10,
    "notes": "Notes"
  }, 
 ]

 export const tableConfig = {
    title: "Assets",
    initial: mockInitial,
    detail: true,
    statusFilter: "assettype",
    status: [
      {
        status: "cryptocurrency",
        statusTitle: "Currencies",
        columns: dataColsCurrency
      },
      {
        status: "nft",
        statusTitle: "NFTs",
        columns: dataColsNft
      },
      {
        status: "derivative",
        statusTitle: "Derivatives",
        columns: dataColsDerivative
      },
    ],
    filter: [
      {
        filter: "perp",
        filterTitle: "Perpetual",
        filterStatus: "derivative",
      },
      {
        filter: "future",
        filterTitle: "Future",
        filterStatus: "derivative",
      },
    ],
    currentValue: 1000,
  };

  export const cryptoMockDetail = 
  {
      "assetId": 1,
    "averageexitprice": 0.0005523,
    "averageentryprice": 62420.49,
    "totalcost": 49811.13,
    "currentbalance": 63.31,
    "currentbalancenumber": 168119.705, 
    "desiredbalancenumber": 16000, 
    "desiredbalance": 36.69,
    "marketprice": 80000,
    "totalvalue": 31335.44,
    "assetgroups": [
              {
    "id": 256,
    "url": "https://example.com/SYGqO",
    "assetvalue": 45,
    "currencyvalue": 64320.75,
    "name": "Something"
  },
              {
    "id": 222,
    "url": "https://example.com/SYGqO",
    "assetvalue": 45,
    "currencyvalue": 64320.75,
    "name": "Fraternal Trust"
  },
        {
    "id": 220,
    "url": "https://example.com/SYGqO",
    "assetvalue": 45,
    "currencyvalue": 64320.75,
    "name": "Fraternal Trust"
  },
    {
    "id": 21,
    "url": "https://example.com/SYGqO",
    "assetvalue": 45,
    "currencyvalue": 64320.75,
    "name": "Fraternal Trust"
  },
  {
    "id": 200,
    "url": "https://example.com/SYGqO",
    "assetvalue": 45,
    "currencyvalue": 64320.75,
    "name": "Fraternal Trust"
  },
  {
    "id": 201,
    "url": "https://example.com/SYGqO",
    "assetvalue": 33,
    "currencyvalue": 64320.75,
    "name": "Equine Stable Holdings"
  },
  {
    "id": 340,
    "url": "https://example.com/SYGqO",
    "assetvalue": 22,
    "currencyvalue": 64320.75,
    "name": "Paternal Wealth Group"
  },
  {
    "id": 92,
    "url": "https://example.com/YyoqS",
    "assetvalue": 55,
    "currencyvalue": 89333.19,
    "name": "High-Risk Pool"
  },
  {
    "id": 90,
    "url": "https://example.com/SYGqO",
    "assetvalue": 67,
    "currencyvalue": 64320.75,
    "name": "Primary Holdings"
  },
  {
    "id": 93,
    "url": "https://example.com/vHXHK",
    "assetvalue": 72,
    "currencyvalue": 15000.00,
    "name": "Trend Assets"
  },
  {
    "id": 10006,
    "url": "https://example.com/vHXHK",
    "assetvalue": 78,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  },
  {
    "id": 10005,
    "url": "https://example.com/vHXHK",
    "assetvalue": 82,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  },
  {
    "id": 10004,
    "url": "https://example.com/vHXHK",
    "assetvalue": 90,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  },
  {
    "id": 10003,
    "url": "https://example.com/vHXHK",
    "assetvalue": 75,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  },
  {
    "id": 10002,
    "url": "https://example.com/vHXHK",
    "assetvalue": 88,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  },
  {
    "id": 10001,
    "url": "https://example.com/vHXHK",
    "assetvalue": 91,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  },
  {
    "id": 10000,
    "url": "https://example.com/vHXHK",
    "assetvalue": 95,
    "currencyvalue": 15750.00,
    "name": "Matriarch Funds"
  }
    ],
  "holdings": [
      {
      "id": 90,
      "url": "https://example.com/SYGqO",
      "assetvalue": 60,
      "currencyvalue": 75655.23,
      "name": "Binance"
    },
    {
      "id": 91,
      "url": "https://example.com/vHXHK",
      "assetvalue": 70,
      "currencyvalue": 10000,
      "name": "Huobi"
    },
     {
      "id": 200,
      "url": "https://example.com/SYGqO",
      "assetvalue": 5,
      "currencyvalue": 75655.23,
      "name": "Bitget"
    },
     {
      "id": 201,
      "url": "https://example.com/SYGqO",
      "assetvalue": 4,
      "currencyvalue": 75655.23,
      "name": "MetaMask"
    },
     {
      "id": 340,
      "url": "https://example.com/SYGqO",
      "assetvalue":20,
      "currencyvalue": 75655.23,
      "name": "Aave"
    },
    {
      "id": 92, 
      "url": "https://example.com/YyoqS",
      "assetvalue": 40,
      "currencyvalue": 80443.96,
      "name": "Polygon"
    }, 
    {
      "id": 93,
      "url": "https://example.com/vHXHK",
      "assetvalue": 60,
      "currencyvalue": 10000,
      "name": "Bybit" 
    }
    ],
    "detailtype": "cryptocurrency"
  }

export const derivativeMockDetail= 
  {
      "assetId": 12,
      "assettype": "derivative",
      "sltp":{"sl": null,  "tp": 10, "partial": [{"id": 1,  "quantity": 50, "tp": 1720, "sl" : 1720 },{"id": 2, "quantity": 20, "tp": 1720, "sl" : null },{"id": 3,  "quantity": 50, "tp": 1720, "sl" : 1720 },{"id": 4,  "quantity": 50, "tp": 1720, "sl" : 1720 },{"id": 5,  "quantity": 50, "tp": 1720, "sl" : 1720 },{"id": 6,  "quantity": 50, "tp": 1720, "sl" : 1720 },{"id": 7 ,  "quantity": 50, "tp": 1720, "sl" : 1720 }]},
      "holdings": [
          {
              "id": 200,
              "holdingurl": "https://www.example.com/binance.png",
              "assetvalue": 5000,
              "currencyvalue": 10000,
              "name": "Binance"
          },
          {
              "id": 201,
              "holdingurl": "https://www.example.com/huobi.png",
              "assetvalue": 3000,
              "currencyvalue": 6000,
              "name": "Huobi"
          },
          {
              "id": 202,
              "holdingurl": "https://www.example.com/polygon.png",
              "assetvalue": 2000,
              "currencyvalue": 4000,
              "name": "Polygon"
          }
      ],
      "assetgroups": [
          {
              "name": "DeFi Assets",
              "assetvalue": 7000,
              "currencyvalue": 14000,
              "positionsize": "35%",
              "id": 203
          },
          {
              "name": "Layer 1 Coins",
              "assetvalue": 5000,
              "currencyvalue": 10000,
              "positionsize": "25%",
              "id": 204
          },
          {
              "name": "Stablecoins",
              "assetvalue": 8000,
              "currencyvalue": 16000,
              "positionsize": "40%",
              "id": 205
          }
      ]
  }

export const nftMockDetail = {
  assetgroups: [
  {
      "url": "https://www.example.com/binance.png",
      "assetvalue": 6,
      "currencyvalue": 120,
      "name": "OpenSea",
      "id": 253, 
      "nfts":[
          {
              "name": "Bored Ape Yacht Club",
              "nfturl": "https://www.example.com/bayc.png",
              "nftvalue": 15.5
          },
          {
              "name": "CryptoPunks",
              "nfturl": "https://www.example.com/cryptopunks.png",
              "nftvalue": 20.3
          },
          {
              "name": "Azuki",
              "nfturl": "https://www.example.com/azuki.png",
              "nftvalue": 8.7
          }
      ]
  },
  {
      "url": "https://www.example.com/huobi.png",
      "assetvalue": 3,
      "currencyvalue": 7,
      "name": "Binance",
      "id":156, 
      "nfts": [
          {
              "name": "Crazy Ape",
              "nfturl": "https://www.example.com/bayc.png",
              "nftvalue": 15.5
          },
          {
              "name": "Ladybird",
              "nfturl": "https://www.example.com/cryptopunks.png",
              "nftvalue": 20.3
          },
          {
              "name": "Crazy",
              "nfturl": "https://www.example.com/azuki.png",
              "nftvalue": 8.7
          }
      ]
  },
  {
      "url": "https://www.example.com/polygon.png",
      "assetvalue": 2,
      "currencyvalue": 5,
      "id":133, 
      "name": "Huobi", 
      "nfts": [
          {
              "name": "Bored Ape Yacht Club",
              "nfturl": "https://www.example.com/bayc.png",
              "nftvalue": 15.5
          },
          {
              "name": "CryptoPunks",
              "nfturl": "https://www.example.com/cryptopunks.png",
              "nftvalue": 20.3
          },
          {
              "name": "Azuki",
              "nfturl": "https://www.example.com/azuki.png",
              "nftvalue": 8.7
          }
      ]
  }
],
holdings: [
  {
    "url": "https://www.example.com/polygon.png",
    "assetvalue": 2,
    "currencyvalue": 5,
    "id":133, 
    "name": "Aave", 
    "nfts": [
        {
            "name": "Bored Ape Yacht Club",
            "nfturl": "https://www.example.com/bayc.png",
            "nftvalue": 15.5
        },
        {
            "name": "CryptoPunks",
            "nfturl": "https://www.example.com/cryptopunks.png",
            "nftvalue": 20.3
        },
        {
            "name": "Azuki",
            "nfturl": "https://www.example.com/azuki.png",
            "nftvalue": 8.7
        }
    ]
}
]
}


export const DoughnutMock = jest.fn(({ data, options, plugins }) => {
  const mockChart = {
    draw: jest.fn(),
  };

  if (simulateHover && options?.onHover) {
    const mockHoverEvent = {};
    const mockElements = [{ datasetIndex: 0, index: 2 }];
    options.onHover(mockHoverEvent, mockElements, mockChart);
  }

  return <p> DoughnutMock </p> ;
});