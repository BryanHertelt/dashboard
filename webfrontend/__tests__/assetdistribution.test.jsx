import { render, waitFor, screen } from "@testing-library/react";
import AssetDistribution from "../src/app/tracker/(distribution)/asset-distribution/page";
import { StructureLayer } from "../src/api/layer";
import AssetDistributionComponent from "@/app/tracker/(distribution)/_components/ADcomp";
import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";

const mockPortfolioResponse = [
  {
    portfolioid: 1,
    userid: 1,
    name: "Portfolio 1",
    currentvalue: 102000,
    change7d: [750000, 800000, 900000, 860000, 900000, 950000, 1000000],
    change7dpercentage: [5.2, 5.3, 8.4, 2, 6.8, 7.2, 1.9],
    change3d: [900000, 925000, 950000, 940000, 950000, 100000],
    change3dpercentage: [5.2, 5.3, 8.4, 2, 6.8, 7.2, 1.9],
    change24h: [950000, 960000, 955000, 950000, 970000, 1000000],
    change24hpercentage: [5.2, 5.3, 8.4, 2, 6.8, 7.2, 1.9],
    change12h: [950000, 970000, 975000, 980000, 995000, 1000000],
    change12hpercentage: [5.2, 5.3, 8.4, 2, 6.8, 7.2, 1.9],
    change4h: [995000, 995314, 997613, 998999, 998600, 1000000],
    change4hpercentage: [5.2, 5.3, 8.4, 2, 6.8, 7.2, 1.9],
    change1h: [998600, 999500, 999400, 999600, 9997000, 1000000],
    change1hpercentage: [5.2, 5.3, 8.4, 2, 6.8, 7.2, 1.9],
    costbasis: [600000, 600000, 600000, 650000, 650000, 650000, 700000],
    id: "d6cc",
  },
];

const mockAssetResponse = [
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 1,
    assettype: "cryptocurrency",
    assetid: 1,
    assetname: "Bitcoin",
    assetabbreviation: "BTC",
    assetamount: 10,
    assetpercentage: 23,
    assetpercentagevalue: 299,
    assetvalue: 890000,
    assetmarketprice: 89000,
    assetchange24h: 7,
    assetchange7d: [890000, 880000, 887000, 8500000, 890000],
    notes: "Notes",
    id: "afd9",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 8,
    assettype: "cryptocurrency",
    assetid: 2,
    assetname: "Ethereum",
    " assetabbreviation": "ETH",
    assetamount: 10,
    assetpercentage: 23,
    assetpercentagevalue: 299,
    assetvalue: 890000,
    assetmarketprice: 89000,
    assetchange24h: 7,
    assetchange7d: [890000, 880000, 887000, 8500000, 890000],
    notes: "Notes",
    id: "40dd",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 3,
    assettype: "cryptocurrency",
    assetid: 3,
    assetname: "BNB",
    assetabbreviation: "BNB",
    assetamount: 10,
    assetpercentage: -23,
    assetpercentagevalue: -299,
    assetvalue: 890000,
    assetmarketprice: 89000,
    " assetchange24h": 7,
    assetchange7d: [890000, 880000, 2000, 8500000, 890000],
    notes: "Notes",
    id: "a416",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 1,
    assettype: "cryptocurrency",
    assetid: 4,
    assetname: "Dogecoin",
    assetabbreviation: "DOGE",
    assetamount: 10,
    " assetpercentage": 23,
    assetpercentagevalue: 299,
    assetvalue: 890000,
    assetmarketprice: 89000,
    assetchange24h: 7,
    assetchange7d: [890000, 880000, 887000, 8500000, 890000],
    notes: "Notes",
    id: "a97f",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 1,
    holdingid: 5,
    assettype: "cryptocurrency",
    assetid: 5,
    assetname: "Solana",
    assetabbreviation: "SOL",
    assetamount: 10,
    assetpercentage: 23,
    assetpercentagevalue: 299,
    assetvalue: 890000,
    assetmarketprice: 89000,
    assetchange24h: 7,
    assetchange7d: [890000, 880000, 887000, 8500000, 890000],
    notes: "Notes",
    id: "ccdf",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 8,
    assettype: "cryptocurrency",
    assetid: 6,
    assetname: "Tether",
    assetabbreviation: "USDT",
    assetamount: 10,
    assetpercentage: 23,
    assetpercentagevalue: 299,
    assetvalue: 890000,
    assetmarketprice: 89000,
    assetchange24h: 7,
    assetchange7d: [890000, 880000, 887000, 8500000, 890000],
    notes: "Notes",
    id: "3486",
  },
  {
    symbol: "A",
    portfolioid: 1,
    userid: 1,
    groupid: 2,
    holdingid: 7,
    assettype: "cryptocurrency",
    assetid: 7,
    assetname: "Tron",
    assetabbreviation: "TRX",
    " assetamount": 10,
    assetpercentage: 23,
    assetpercentagevalue: 299,
    " assetvalue": 890000,
    " assetmarketprice": 89000,
    assetchange24h: 7,
    assetchange7d: [890000, 880000, 897000, 8500000, 890000],
    " notes": "Notes",
    id: "d6b0",
  },
];

beforeEach(() => {
  StructureLayer.fetchDistributionUnits.mockClear();
});

// Mock the StructureLayer module
jest.mock("../src/api/layer", () => ({
  StructureLayer: {
    fetchDistributionUnits: jest.fn((...args) => {
      console.log("Mock called with args:", args);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({mockPortfolioResponse, mockAssetResponse}),
      });
    }),
  },
}));

jest.mock("../src/app/tracker/(distribution)/_components/ADcomp", () => {
  return jest.fn(() => <div>Mocked AssetDistributionComponent</div>);
});

describe("AssetDistribution", () => {
  it("should call fetchDistributionUnits with correct arguments for portfolio", async () => {
    StructureLayer.fetchDistributionUnits
    .mockResolvedValueOnce(mockPortfolioResponse)
    .mockResolvedValueOnce(mockAssetResponse);
    jest.mock("../src/app/tracker/(distribution)/_components/ADcomp", () => {
      return jest.fn(() => <div>Mocked AssetDistributionComponent</div>);
    });
    // Mock resolved values for both API calls
    await StructureLayer.fetchDistributionUnits
      .mockResolvedValue(mockPortfolioResponse) // Mock portfolio response
      .mockResolvedValue(mockAssetResponse); // Mock asset response

    const AssetDistributionComponent = await AssetDistribution();
    render(AssetDistributionComponent);

    await waitFor(() => {
      expect(StructureLayer.fetchDistributionUnits).toHaveBeenCalledTimes(2);
      expect(StructureLayer.fetchDistributionUnits).toHaveBeenCalledWith(
        "portfolios",
        `portfolioid=1`
      );
      expect(StructureLayer.fetchDistributionUnits).toHaveBeenCalledWith(
        "assets",
        `assettype=cryptocurrency`
      );
    });
  });
  it("Passes responses to AssetDistributionComponent as props", async () => {
  
   const assetDistribution =  await AssetDistribution()
   render(assetDistribution)

    expect(AssetDistributionComponent).toHaveBeenCalledWith(
      {
        portfolioResponse: mockPortfolioResponse,
        assetResponse: mockAssetResponse,
      },
      {}
    );
  });
  it("Should return failed array if the mock fails", async()=> {
await StructureLayer.fetchDistributionUnits
.mockRejectedValueOnce(["failed"])
.mockRejectedValueOnce(["failed"])

const assetDistribution = await AssetDistribution() 
render(assetDistribution)

expect(AssetDistributionComponent).toHaveBeenCalledWith(
  {portfolioResponse: ["failed"], 
    assetResponse: ["failed"]
  }, 
  {}
)
  })
it("should return first login if there are no assets provided", async()=> {
  await StructureLayer.fetchDistributionUnits
  .mockResolvedValue(mockPortfolioResponse)
  .mockResolvedValue([])

render(<FirstLogin />)

const text = screen.findByText("Add your first holding")

  expect(text).toBeInTheDocument

})
it("should render a sorry message if portfolio array is empty", async()=> {
  await StructureLayer.fetchDistributionUnits
  .mockResolvedValue([])
  .mockResolvedValue(mockAssetResponse)

  const assetDistribution = await AssetDistribution() 
  render(assetDistribution)
const text = screen.findByText("We are sorry, but there have to be an internal server error.")
expect(text).toBeInTheDocument
})
});
