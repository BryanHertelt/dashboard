jest.mock("../src/utility/lib/datafetching/loading-skeleton", () => ({
    ErrorSkeleton: jest.fn().mockImplementation(()=> null), 
    LoadingSkeleton: jest.fn().mockImplementation(() => null)
}))

import {TableDetailComponent} from "../src/utility/lib/design-components/datatables/table-layout/data-datatable-detail-popup"
import { DrDetail, AgDetail, HdDetail } from "../src/utility/lib/build-components/asset-table-detail-components"
import {useDetailComponent} from "../src/utility/lib/datafetching/client-refetch/fetching-detail-component"
import { render, screen, fireEvent } from "@testing-library/react"
import {ErrorSkeleton, LoadingSkeleton} from "../src/utility/lib/datafetching/loading-skeleton"

jest.mock("../src/utility/lib/build-components/asset-table-detail-components", () => ({
    DrDetail: jest.fn().mockImplementation(()=> null), 
    HdDetail: jest.fn().mockImplementation(()=> null),
    AgDetail: jest.fn().mockImplementation(()=> null),
    }))

jest.mock("../src/utility/lib/datafetching/client-refetch/fetching-detail-component", () => ({
        useDetailComponent: jest.fn().mockImplementation(()=> mock)
        }))
const mockNFTs={
    "assetId": 323,
    "holdings": [
        {
            "holdingurl": "https://www.example.com/binance.png",
            "nftcount": 6,
            "assetvalue": 120,
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
            "holdingurl": "https://www.example.com/huobi.png",
            "nftcount": 3,
            "assetvalue": 7,
            "name": "Binance",
            "id":"156", 
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
            "id":"133", 
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
    "assetgroups": [
        {
           "id":"193" ,
            "name": "Metaverse Tokens",
            "nftcount": 3,
            "assetvalue": 10,
            "positionsize": "20%",
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
        },
        {
            "name": "Gaming Tokens",
            "id": 132,
            "nftcount": 3,
            "assetvalue": 1,
            "positionsize": "30%",
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
        },
        {
            "id": 152,
            "name": "Ethereum Ecosystem",
            "nftcount": 5,
            "assetvalue": 2.3145,
            "positionsize": "50%",
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
const mockDerivatives= {
        "assetId": 12,
        "assettype": "derivative",
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
const mockCryptoResponse= {
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
const designComponents={
    carddesign: "flex flex-col card mb-2.5 ml-3.5 p-3 pr-3 w-64 h-20",
    headerdesign: "flex flex-row text-sm text-icongray mb-1",
    valuedesign: "font-semibold text-base mr-3",
  }

describe("TableDetailComponent", () => {

describe("loading state", () => {
    const mock = {
         data: undefined, 
        error: null, 
        isError: false, 
        isLoading: true, 
    }
    beforeEach(() => {
        jest.clearAllMocks();
        useDetailComponent.mockImplementation(()=> mock)
        render(<TableDetailComponent assetId={1} assetName="BTC" tableStatus="cryptocurrency" />);
    });

it("calls Loading State", () => {
    expect(LoadingSkeleton).toHaveBeenCalled()
})   
})
describe("error state", () => {
    const mock = {
        data: undefined, 
       error: null, 
       isError: true, 
       isLoading: false, 
   }
   beforeEach(() => {
       jest.clearAllMocks();
       useDetailComponent.mockImplementation(()=> mock)
       const status = ["cryptocurrency", "derivative", "nft"]
       status.map((status)=> {
           render(<TableDetailComponent assetId={1} assetName="BTC" tableStatus={status} />);
       })
   });

it("calls ErrorSkeleton", () => {
   expect(ErrorSkeleton).toHaveBeenCalled()
})   
})
describe("wrong data format", () => {
    const mock={
        data: [], 
        error: null, 
        isError: false, 
        isLoading: false
    }
    beforeEach(() => {
        jest.clearAllMocks();
        useDetailComponent.mockImplementation(()=> mock)
        const status = ["cryptocurrency", "derivative", "nft"]
        status.map((status)=> {
            render(<TableDetailComponent assetId={1} assetName="BTC" tableStatus={status} />);
        })
    });
it("checks if item is object", () => {
    expect(ErrorSkeleton).toHaveBeenCalledTimes(3)
})
})
describe("Crypto State", () => {
    const mock={
        data: mockCryptoResponse, 
        error: null, 
        isError: false, 
        isLoading: false
    }
    beforeEach(() => {
        jest.clearAllMocks();
        useDetailComponent.mockImplementation(()=> mock)
        render(<TableDetailComponent assetId={1} assetName="BTC" tableStatus="cryptocurrency" />);
    });
    afterEach(()=> {
        jest.clearAllMocks()
    })
it("does not do unexpected UI changes", () => {
    const {container} = render(<TableDetailComponent assetId={1} assetName="BTC" tableStatus="cryptocurrency" />);
    expect(container).toMatchSnapshot()
})
it("initial render contains DrDetail", () => {
    expect(DrDetail).toHaveBeenCalledTimes(1)
    expect(DrDetail).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining(mockCryptoResponse), 
        designComponents: designComponents
    }), expect.any(Object))
})
it("button click triggers Holding Detail to be rendered", () => {
    const button = screen.getByRole("button", { name: /Holding Distribution/i })
    fireEvent.click(button)
    expect(HdDetail).toHaveBeenCalled()
    expect(HdDetail).toHaveBeenCalledWith(expect.objectContaining({
        assetname: "BTC", 
        data: expect.arrayContaining(mockCryptoResponse.holdings), 
        designComponents: designComponents

    }), expect.any(Object)
    )
})

it("button click triggers DrDetail to be rendered", () => {
   const button = screen.getByRole("button", { name: /Details \+ Rebalancing/i });
    fireEvent.click(button)
    expect(DrDetail).toHaveBeenCalled()
    expect(DrDetail).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining(mockCryptoResponse), 
        designComponents: designComponents
    }), expect.any(Object))
})
})
})

const testCases = [
    { name: "Derivative", mockData: mockDerivatives, tableStatus: "derivative" },
    { name: "NFT", mockData: mockNFTs, tableStatus: "nft" }
];

describe.each(testCases)("$name State", ({ mockData, tableStatus }) => {
    const mock = {
        data: mockData,
        error: null,
        isError: false,
        isLoading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useDetailComponent.mockImplementation(() => mock);
        render(<TableDetailComponent assetId={1} assetName="BTC" tableStatus={tableStatus} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("does not do unexpected UI changes", () => {
        const { container } = render(
            <TableDetailComponent assetId={1} assetName="BTC" tableStatus={tableStatus} />
        );
        expect(container).toMatchSnapshot();
    });

    it("initial render contains AgDetail", () => {
        expect(AgDetail).toHaveBeenCalledTimes(1);
        expect(AgDetail).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining(mockData.assetgroups),
                designComponents: designComponents
            }),
            expect.any(Object)
        );
    });

    it("button click triggers Holding Detail to be rendered", () => {
        if(tableStatus != "derivative"){
            const button = screen.getByRole("button", { name: /Holding Distribution/i });
            fireEvent.click(button);
            expect(HdDetail).toHaveBeenCalled();
            expect(HdDetail).toHaveBeenCalledWith(
                expect.objectContaining({
                    assetname: "BTC",
                    data: expect.arrayContaining(mockData.holdings),
                    designComponents: designComponents
                }),
                expect.any(Object)
            );
        }
    });
    it("button click triggers AgDetail to be rendered", () => {
        if(tableStatus != "derivative"){
            const button = screen.getByRole("button", {name: /Asset Group Distribution/i})
            fireEvent.click(button)
            expect(AgDetail).toHaveBeenCalled(); 
            expect(AgDetail).toHaveBeenCalledWith(
                expect.objectContaining({
                    assetname: "BTC", 
                    data: expect.arrayContaining(mockData.assetgroups), 
                    designComponents:designComponents
                }), 
                expect.any(Object)
            )
        }
    })
});






