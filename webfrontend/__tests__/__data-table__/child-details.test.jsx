
import '@testing-library/jest-dom'
import { DisDetail, DrDetail} from "../../src/utility/lib/build-components/asset-table-detail-components";
import { formatValue, formatCurrency, formatDecimals } from '../../src/utility/lib/helpers/helper-functions';
import { render } from '@testing-library/react';
import { InfoCards, DetailNfts, StopLossCards } from '../../src/utility/lib/helpers/helper-detail-table';
import { RebalancingSetUp } from '../../src/utility/lib/design-components/rebalancing-set-up/rebalancing-set-up';
import { HoldingLogoImageContainer } from '../../src/utility/lib/helpers/image-container';
import { Bar } from 'react-chartjs-2';
import { screen } from '@testing-library/react';
import { DerivativesIcon } from '../../public/images';
import { ErrorSkeleton } from '../../src/utility/lib/datafetching/loading-skeleton';

jest.mock("../../src/utility/lib/helpers/helper-detail-table", () => ({
    DetailNfts: jest.fn().mockImplementation(() => <p> Expose NFTs </p>), 
    InfoCards: jest.fn().mockImplementation(()=> <p> Info Cards</p>), 
    StopLossCards: jest.fn().mockImplementation((derivativeMockDetail)=> <p>Stop Loss Cards </p>)
}))

jest.mock("react-chartjs-2", () => ({
    Bar: jest.fn().mockImplementation(() => <p> Bar Chart </p>) 
}))


jest.mock("../../src/utility/lib/design-components/rebalancing-set-up/rebalancing-set-up", () => ({
    RebalancingSetUp: jest.fn().mockImplementation(()=> <p> Rebalancing Set up</p>)
}))

jest.mock("../../src/utility/lib/datafetching/loading-skeleton", () => ({
    ErrorSkeleton: jest.fn().mockImplementation(() => <p> Error occured </p>)
}))



jest.mock("../../src/utility/lib/helpers/image-container", () => ({
    HoldingLogoImageContainer: jest.fn().mockImplementation(() => <p> Holding Logo Image Container </p> )
}))


const mockDetail = 
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

const derivativeMockDetail= 
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

const nftMockDetail = [
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

]


describe("DisDetail", () => {
    const originalInnerWidth = window.innerWidth
    const originalProps = {
        detailData: mockDetail.assetgroups, 
        tableStatus: "cryptocurrency", 
        totalAmount: 300, 
        assetname: "BTC", 
        changeActiveDisObj: () => null, 
        activeDisObj: null, 
        sltp: undefined
    }

    beforeEach(()=> {
        jest.clearAllMocks()
    })

    afterEach(()=> {
        window.innerWidth = originalInnerWidth
    })
        it("renders Bar with processed bar data", () => {
            window.innerWidth = 1200
            render(<DisDetail {...originalProps}/>)
            expect(Bar).toHaveBeenCalled()
            expect(screen.getByText("Bar Chart")).toBeInTheDocument()
            const callArg = Bar.mock.calls[0][0]
            const otherDataSet = callArg.data.datasets.find((dataset)=> dataset.label === "Others")
            expect(otherDataSet.data).toEqual([33.33333333333333])
            expect(callArg.data.datasets.length).toBe(15)
            expect(Bar).toHaveBeenCalledWith(callArg, {})
        })
        it("renders InfoCards with processed card data", () => {
            window.innerWidth = 1200
            render(<DisDetail {...originalProps}/>)
            expect(InfoCards).toHaveBeenCalled()
            expect(screen.getByText("Info Cards")).toBeInTheDocument()
            const callArg = InfoCards.mock.calls[0][0]
            const receivedIds = callArg.data.map(item => item.id)
            const expectedIds = [
                10000,
                10001,
                10004,
                10002,
                10005,
                10006,
                10003,
                93,
                90,
                92,
                256,
                222,
                220,
                21,
                undefined
              ];
              expect(receivedIds).toEqual(expectedIds)
            const receivedDistributionData = callArg.data.map(item => item.distribution)
            const expectedDistributionData = [
                 31.666666666666664,
                 30.333333333333336,
                 30,
                 29.333333333333332,
                 27.333333333333332,
                 26,
                 25,
                 24,
                 22.333333333333332,
                 18.333333333333332,
                 15,
                 15,
                 15,
                 15,
                 undefined,
            ]
            expect(receivedDistributionData).toEqual(expectedDistributionData)
        })
        it("not render Derivative and ExpandNFT", () => {
            window.innerWidth = 1200
            render(<DisDetail {...originalProps}/>)
            expect(StopLossCards).not.toHaveBeenCalled()
            expect(DetailNfts).not.toHaveBeenCalled()
        })
        it("correctly adapts width for bar chart", () => {
            window.innerWidth = 1099
            render(<DisDetail {...originalProps}/>)
            expect(Bar).toHaveBeenCalled()
            const callArg = Bar.mock.calls[0][0]
            expect(callArg.data.datasets.length).toBe(10)
        })

        it("does not split into others, when screen width is beneath 1100 and array.length is beneath 10", () => {
           const newMock = mockDetail.assetgroups.splice(0,10)
            window.innerWidth = 1099
            render(<DisDetail {...{...originalProps, detailData: newMock}} /> )
            const callArg = Bar.mock.calls[0][0]
            const otherDataSet = callArg.data.datasets.find((dataset)=> dataset.label === "Others")
            expect(otherDataSet).toBe(undefined)
        })
        it("does not split into others, when screen width is above 1100 and array.length is beneath 15", () => {
            const newMock = mockDetail.assetgroups.splice(0,14)
            window.innerWidth = 1200
            render((<DisDetail {...{...originalProps, detailData: newMock}} /> ))
            const callArg = Bar.mock.calls[0][0]
            const otherDataSet = callArg.data.datasets.find((dataset)=> dataset.label === "Others")
            expect(otherDataSet).toBe(undefined)
        })
        it("renders DerivativeDetail, if tableStatus === derivative", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: derivativeMockDetail.holdings, tableStatus: "derivative", sltp:derivativeMockDetail.sltp}} /> ))
            expect(StopLossCards).toHaveBeenCalled()
        })
        it("renders NFT Details, if tableStatus === nft ", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps,detailData: nftMockDetail , tableStatus: "nft", activeDisObj: 1}} /> ))
            expect(DetailNfts).toHaveBeenCalled()

        })
        it("does not render NFT Detail, if no detail card is selected", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: nftMockDetail,  tableStatdus: "nft", activeDisObj: null}} /> ))
            expect(DetailNfts).not.toHaveBeenCalled()  
        })
        it("handles empty detailData", ()=> {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: [],  tableStatdus: "nft", activeDisObj: null}} /> ))
            expect(screen.getByText("Error occured")).toBeInTheDocument()
        })
        
})

describe("DrDetail", () => {

    beforeEach(()=> jest.clearAllMocks())
    afterEach(()=> jest.clearAllMocks())

    it("renders cardData as expected", () => {
        render(<DrDetail data={mockDetail} currentValue={265550} /> )

            expect(screen.getByText("Average Entry Price")).toBeInTheDocument()
            expect(screen.getByText("Market Price")).toBeInTheDocument()
            expect(screen.getByText("Average Exit Price")).toBeInTheDocument()
            expect(screen.getByText("Total Cost")).toBeInTheDocument()

    
          expect(screen.getByText(formatCurrency(mockDetail.averageentryprice)))
          expect(screen.getByText(formatCurrency(mockDetail.marketprice)))
          expect(screen.getByText(formatCurrency(mockDetail.averageexitprice)))
          expect(screen.getByText(formatCurrency(mockDetail.totalcost)))
    
    })

    it("calls Rebalancing Set Up with correct arguments", ()=> {
        render(<DrDetail data={mockDetail} currentValue={265550} /> )
        expect(RebalancingSetUp).toHaveBeenCalled()
        const callArg = RebalancingSetUp.mock.calls[0][0]
        const desiredArg = {"assetId": 1, "currentValue": 265550, "data": {"currentbalance": 63.31, "desiredbalance": 36.69}}
        expect(callArg).toEqual(desiredArg)
    })

})

