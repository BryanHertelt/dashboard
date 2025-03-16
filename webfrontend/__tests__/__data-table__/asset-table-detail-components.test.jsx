import '@testing-library/jest-dom'
import {HdDetail, AgDetail, DrDetail } from "../../src/utility/lib/build-components/asset-table-detail-components";
import {render, screen, fireEvent} from "@testing-library/react";
import { HoldingLogoImageContainer } from '../../src/utility/lib/helpers/image-container';
import { formatCurrency, formatValue} from '../../src/utility/lib/helpers/helper-functions';
import { BarChartRebalancing, HoldingBarChart } from '../../src/utility/lib/design-components/charts/bar-charts';
import { ExposeNfts } from '../../src/utility/lib/helpers/nft-container';



jest.mock("../../src/utility/lib/helpers/image-container", () => ({
HoldingLogoImageContainer: jest.fn(),
NftDetailImageContainer: jest.fn().mockImplementation(() => null)
}))

jest.mock("../../src/utility/lib/helpers/nft-container", () => ({
  ExposeNfts: jest.fn().mockImplementation(() => null),
  }))


jest.mock("../../src/utility/lib/helpers/helper-functions", () => ({
    formatValue: jest.fn((number)=> {
        if(isNaN(Number(number))){
          console.error("Type error in formatValue")
          return("")
        }
        const formattedValue = Number(number).toFixed(2)
      
        return formattedValue
      }),
    formatCurrency: jest.fn((number)=> {
        if(isNaN(Number(number))){
          console.error("Type error in formatCurrency")
          return("")
        }
      const formattedCurrency = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(number)); 
      return formattedCurrency
      })
})) 


jest.mock("../../src/utility/lib/design-components/charts/barcharts", () => ({
HoldingBarChart: jest.fn().mockImplementation(()=> null),
BarChartRebalancing: jest.fn().mockImplementation(()=> null)
}))

const designComponents= {
    carddesign: "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3 w-64 h-20",
    headerdesign: "flex flex-row text-sm text-icongray mb-1",
    valuedesign: "font-semibold text-base mr-3",
  }

describe("HdDetail", () => {
    describe("renders cryptocurrency state properly", () => {
        const assetname="BTC"; 
        const data= [
           {
           "holdingurl": "https://example.com/SYGqO",
           "assetvalue": 97814.0,
           "currencyvalue": 75655.23,
           "holdingdistribution": 45,
           "name": "Binance"
         },
         {
           "holdingurl": "https://example.com/vHXHK",
           "assetvalue": 4028.68,
           "currencyvalue": 10000,
           "holdingdistribution": 3,
           "name": "Huobi"
         },
         {
           "holdingurl": "https://example.com/YyoqS",
           "assetvalue": 6646.08,
           "currencyvalue": 80443.96,
           "holdingdistribution": 5,
           "name": "Polygon"
         }, 
         {
           "holdingurl": "https://example.com/vHXHK",
           "assetvalue": 4048.68,
           "currencyvalue": 10000,
           "holdingdistribution": 4,
           "name": "Bybit" 
         }
         ] 
         const tableStatus = "cryptocurrency"
      beforeEach(()=>{
        render(<HdDetail data={data} tableStatus={tableStatus} assetname={assetname} designComponents={designComponents} />)
      })

      afterEach(()=> jest.clearAllMocks())

      it("does not change unexpected", () => {
        const { container } = render(<HdDetail data={data} tableStatus={tableStatus} assetname={assetname} designComponents={designComponents}/>) 
        expect(container).toMatchSnapshot(); 
      })

      it("renders all relevant data for cryptocurrencies", () => {
        data.map((holding)=> {
            expect(screen.getByText(holding.name)).toBeInTheDocument() 
            expect(screen.getByText(`${formatValue(holding.assetvalue)} ${assetname}`))
        })
        expect(HoldingLogoImageContainer).toHaveBeenCalledTimes(4)
      })
      it("renders HoldingBarChart with correct Props", () => {
        expect(HoldingBarChart).toHaveBeenCalledTimes(1)
        expect(HoldingBarChart).toHaveBeenCalledWith(expect.objectContaining({
          data: expect.arrayContaining(data)
        }), expect.any(Object))
    })
    it("does not call exposeNFTs", () => {
        expect(ExposeNfts).not.toHaveBeenCalled()
    })

    }) 

    describe("renders all relevant data for nft state", () => {
        const data= [
            {
                "holdingurl": "https://www.example.com/binance.png",
                "nftcount": 6,
                "assetvalue": 120,
                "name": "OpenSea",
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
                "holdingurl": "https://www.example.com/huobi.png",
                "nftcount": 3,
                "assetvalue": 7,
                "name": "Binance",
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
                "holdingurl": "https://www.example.com/polygon.png",
                "nftcount": 2,
                "assetvalue": 5,
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
         const designComponents= {
            carddesign: "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3 w-64 h-20",
            headerdesign: "flex flex-row text-sm text-icongray mb-1",
            valuedesign: "font-semibold text-base mr-3",
          }
          const tableStatus = "nft"
          const assetname = "Ethereum"

          beforeEach(()=>{
            jest.clearAllMocks() 
            render(<HdDetail data={data} tableStatus={tableStatus} assetname={assetname} designComponents={designComponents} />)
          })
          afterEach(()=> {
            jest.clearAllMocks()
          })

          it("does not have unexpected UI changes", () => {
            const { container } = render(<HdDetail data={data} tableStatus={tableStatus} assetname={assetname} designComponents={designComponents}/>) 
            expect(container).toMatchSnapshot(); 
          })
          it("renders all relevant data for the nft state", () => {
            data.map((holding)=> {
                expect(screen.getByText(holding.name)).toBeInTheDocument()
                expect(screen.getByText(`${holding.nftcount} NFTs`)).toBeInTheDocument() 
                expect(
                    screen.getByText(new RegExp(`~\\s*${formatValue(holding.assetvalue)}\\s*ETH`, "i"))
                  ).toBeInTheDocument();             
            })
          })

          it("calls exposeNFTs with correct arguments", () => {
            expect(ExposeNfts).toHaveBeenCalled()
            expect(ExposeNfts).toHaveBeenCalledWith(
                expect.objectContaining({
                  data: expect.objectContaining({
                    "assetvalue": 7, "name": "Binance", 
                    "holdingurl": "https://www.example.com/huobi.png", 
                    "nftcount": 3, "nfts": [
                        {"name": "Crazy Ape", "nfturl": "https://www.example.com/bayc.png",  "nftvalue": 15.5}, 
                        {"name": "Ladybird", "nfturl": "https://www.example.com/cryptopunks.png","nftvalue": 20.3}, 
                        {"name": "Crazy", "nfturl": "https://www.example.com/azuki.png", "nftvalue": 8.7}]
                  })
                }), expect.any(Object)
            )
          })
          it("does not render the Holding Bar", () => {
            expect(HoldingBarChart).not.toHaveBeenCalled()
          })

          it("changes Holdings based on selected holding", () => {
            const textElement = screen.getByText(/OpenSea/i); 
            const div = textElement.closest("div"); // Finds the closest div wrapping the text
            fireEvent.click(div);
  
            expect(ExposeNfts).toHaveBeenCalled()
            expect(ExposeNfts).toHaveBeenCalledWith(
              expect.objectContaining({
                data: expect.objectContaining(          {
                  "holdingurl": "https://www.example.com/binance.png",
                  "nftcount": 6,
                  "assetvalue": 120,
                  "name": "OpenSea",
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
              })
              }), expect.any(Object)
          )

          })

    })
  });

describe("AgDetail", () => {

    describe("nft state", () => {
        const mockNFTs = [
            {
               "id":193,
                "name": "Metaverse Tokens",
                "nftcount": 3,
                "assetvalue": 10,
                "positionsize": "20%",
                "nfts": []
            },
            {
                "name": "Gaming Tokens",
                "id": 132,
                "nftcount": 2,
                "assetvalue": 1,
                "positionsize": "30%",
                "nfts": []
            },
            {
                "id": 152,
                "name": "Ethereum Ecosystem",
                "nftcount": 1,
                "assetvalue": 2.3145,
                "positionsize": "50%",
                "nfts": []
            }
        ]
        beforeEach(()=>{
            jest.clearAllMocks() 
            render(<AgDetail data={mockNFTs} tableStatus={"nft"} designComponents={designComponents} />)
          })
          afterEach(()=> {
            jest.clearAllMocks()
          })

    it("does not have unexpected UI changes", () => {
        const {container} = render(<AgDetail data={mockNFTs} tableStatus={"nft"} designComponents={designComponents} />)
        expect(container).toMatchSnapshot(); 
    })
    it("renders all relevant data for the nft state", () => {
        mockNFTs.map((group)=> {
            expect(screen.getByText(group.name)).toBeInTheDocument()
            expect(screen.getByText(`${group.nftcount} NFTs`)).toBeInTheDocument() 
            expect(
                screen.getByText(new RegExp(`~\\s*${formatValue(group.assetvalue)}\\s*ETH`, "i"))
              ).toBeInTheDocument();             
        }) }) 
it("calls exposeNFTs with correct arguments", () => {
    expect(ExposeNfts).toHaveBeenCalled()
    expect(ExposeNfts).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            "name": "Gaming Tokens",
            "id": 132,
            "nftcount": 2,
            "assetvalue": 1,
            "positionsize": "30%",
            "nfts": []
          })
        }),expect.any(Object)
    )
  })
  it("changes NFTs based on selected group", () => {
    const textElement = screen.getByText(/Metaverse Tokens/i); 
    const div = textElement.closest("div"); // Finds the closest div wrapping the text
    fireEvent.click(div);

    expect(ExposeNfts).toHaveBeenCalled()
    expect(ExposeNfts).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining(
          {
            "id":193,
             "name": "Metaverse Tokens",
             "nftcount": 3,
             "assetvalue": 10,
             "positionsize": "20%",
             "nfts": []
         }
        )
      }), expect.any(Object)
  )

  })
}) 
describe("derivative state", () => {
    const mockDerivatives= [
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


    beforeEach(()=> {
        jest.clearAllMocks() 
        render(<AgDetail data={mockDerivatives} tableStatus={"derivative"} designComponents={designComponents} assetname={"5XBTCUSDT"}/> )
    })
    afterEach(()=> jest.clearAllMocks)

    it("does not have unexpected UI changes", () => {
        const {container} = render(<AgDetail data = {mockDerivatives} tableStatus={"derivatives"} designComponents={designComponents} assetname={"5XBTCUSDT"}/>)
        expect(container).toMatchSnapshot()
    })
    it("renders relevant data for derivatives", ()=> {
      screen.getAllByText("5XBTCUSDT").forEach((element) => {
        expect(element).toBeInTheDocument();
    });
    
        mockDerivatives.map((group)=> {
    expect(screen.getByText(group.name)).toBeInTheDocument() 
    expect(screen.getByText((content) => content.includes(`~ ${formatCurrency(group.currencyvalue)}`))).toBeInTheDocument();

        })
    })
    it("does not call exposeNFTs", () => {
      expect(ExposeNfts).not.toHaveBeenCalled()
    })
})
}) 


describe("DrDetail", () => {
  const rebalancingMock = {
    "assetId": 1,
  "averageexitprice": 16642.13,
  "averageentryprice": 62420.49,
  "totalcost": 49811.13,
  "currentbalance": 63.31,
  "currentbalancenumber": 12233, 
  "desiredbalancenumber": 16000, 
  "desiredbalance": 36.69,
  "marketprice": 21334.88,
  "totalvalue": 31335.44,
  "holdings": [
    {
    "id": 90,
    "holdingurl": "https://example.com/SYGqO",
    "assetvalue": 97814.0,
    "currencyvalue": 75655.23,
    "holdingdistribution": 45,
    "name": "Binance"
  },
  {
    "id": 91,
    "holdingurl": "https://example.com/vHXHK",
    "assetvalue": 40428.68,
    "currencyvalue": 10000,
    "holdingdistribution": 3,
    "name": "Huobi"
  },
  {
    "id": 92, 
    "holdingurl": "https://example.com/YyoqS",
    "assetvalue": 6646.08,
    "currencyvalue": 80443.96,
    "holdingdistribution": 5,
    "name": "Polygon"
  }, 
  {
    "id": 93,
    "holdingurl": "https://example.com/vHXHK",
    "assetvalue": 40428.68,
    "currencyvalue": 10000,
    "holdingdistribution": 4,
    "name": "Bybit" 
  }
  ],
  "holdingdistribution": 93.37,
  "detailtype": "cryptocurrency"
}
beforeEach(()=> {
  jest.clearAllMocks() 
  render(<DrDetail data = {rebalancingMock} designComponents={designComponents}/>)
})

afterEach(()=> jest.clearAllMocks())

it("does not have unexpected UI changes", () => {
  const {container} = render(<DrDetail data = {rebalancingMock} designComponents={designComponents}/>)
  expect(container).toMatchSnapshot()
})
it("renders all cards as expected", () => {
  expect(screen.getByText("Average Entry Price")).toBeInTheDocument()
  expect(screen.getByText("Market Price")).toBeInTheDocument()
  expect(screen.getByText("Average Exit Price")).toBeInTheDocument()
  expect(screen.getByText("Total Cost")).toBeInTheDocument()
})
it("renders all card values as expected", () => {
expect(screen.getByText(formatCurrency(rebalancingMock.averageentryprice)))
expect(screen.getByText(formatCurrency(rebalancingMock.marketprice)))
expect(screen.getByText(formatCurrency(rebalancingMock.averageexitprice)))
expect(screen.getByText(formatCurrency(rebalancingMock.totalcost)))
})
it("calls BarChartRebalancing with right arguments", () => {
  expect(BarChartRebalancing).toHaveBeenCalledTimes(1)
  expect(BarChartRebalancing).toHaveBeenCalledWith({
theme: "details",
data: expect.objectContaining({
  currentbalance: rebalancingMock.currentbalance,
  currentbalancenumber:rebalancingMock.currentbalancenumber ,
  desiredbalance: rebalancingMock.desiredbalance,
  desiredbalancenumber:rebalancingMock.desiredbalancenumber,
})
  }, expect.any(Object))
})
})