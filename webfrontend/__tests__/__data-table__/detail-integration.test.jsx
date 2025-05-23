import React from "react";
import '@testing-library/jest-dom'
import { render, screen, act,  fireEvent, waitFor} from "@testing-library/react";
import { TableDetailComponent } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent"
import { HoldingLogoImageContainer, NftDetailImageContainer} from "../../src/utility/lib/helpers/helper-components/image-container";
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching/skeletons/error-skeleton";
import { SmallLoadingSkeleton } from "../../src/utility/lib/data-fetching/skeletons/loading-skeleton";
import { useDetailComponent } from "../../src/utility/lib/data-fetching/client-hooks";
import { RebalancingSetUp } from "../../src/utility/lib/helpers/helper-components/rebalancing-set-up";
import { cryptoMockDetail, derivativeMockDetail, nftMockDetail } from "../testmocks";
import { prefetchDetailComponent } from "../../src/utility/lib/data-fetching/prefetch-hooks";
import { NftsIcon } from "../../public/images";
import logger from '../../src/utility/lib/logging/logger'

jest.mock('../../src/utility/lib/logging/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

import { Bar } from "react-chartjs-2";




jest.mock("../../public/images/icons", ()=> ({
  ShowDetailIcon: jest.fn().mockImplementation(()=> <button onClick={() => console.log("clicked")}> ShowDetail</button> ),
  SortingDataTableIcon: jest.fn().mockImplementation(()=> <p> Sorting </p>),
  PositionDirectionIcon: jest.fn().mockImplementation(() => <p> P </p>)
}))

jest.mock("../../src/utility/lib/helpers/helper-components/rebalancing-set-up", ()=> ({
  RebalancingSetUp: jest.fn().mockImplementation(()=> <div> RB-SetUp </div> ),
}))

jest.mock("../../src/utility/lib/data-fetching/prefetch-hooks", () => ({

  prefetchDetailComponent: jest.fn().mockImplementation(()=> null)
}))

jest.mock( "../../src/utility/lib/data-fetching/client-hooks", () => ({
  useDetailComponent: jest.fn(),
}));
jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn().mockImplementation(()=> <p> Bar...</p>)
}))

jest.mock("../../public/images", () => ({
  NftsIcon: jest.fn().mockImplementation(()=> <p>Nfts Icon</p>)
}))

jest.mock("../../src/utility/lib/helpers/helper-components/image-container", () => ({
  HoldingLogoImageContainer: jest.fn().mockImplementation(()=> <div> Image</div>), 
  NftDetailImageContainer: jest.fn().mockImplementation(()=> null)
}));

jest.mock("../../src/utility/lib/data-fetching/skeletons/loading-skeleton", () => ({
  SmallLoadingSkeleton: jest.fn().mockImplementation(()=> <div> Loading...</div>), 
}));

jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
  SmallErrorSkeleton: jest.fn().mockImplementation(()=> <div> Error Skeleton ... </div>)
}))




jest.mock("use-resize-observer", () => ({
  __esModule: true,
  default: () => ({
    ref: jest.fn(),
  }),
}));

describe("TableDetailComponent", () => {
  afterEach(()=> jest.clearAllMocks())

  describe("table state: nft", () => {
    beforeEach(() => {
      (useDetailComponent).mockReturnValue({
        data: {...nftMockDetail},
        isLoading: false,
        isError: false,
      });
      render(
          <TableDetailComponent
            tableStatus="nft"
            assetId={1}
            currentValue={1000}
            totalAssetAmount={5000}
            assetName="Moonbirds"
            assetSymbol="Moonbirds"
            assetUrl="https://btc.com"
          />
        );
    });
    afterEach(()=> jest.clearAllMocks())

    it("should just show two tabs", () => {
      expect(screen.getByRole("button", {name: /Asset-Groups/i})).toBeInTheDocument()
      expect(screen.getByRole("button", {name: /Holdings/i})).toBeInTheDocument()
    })
    it("should render nft assetgroups", () => {
     const groups = ["OpenSea", "Binance", "Huobi"]
     groups.map((group) => expect(screen.getByText(group)).toBeInTheDocument())
     const nftValue = ["6 NFTs", "3 NFTs", "2 NFTs" ]
     nftValue.map((body) => expect(screen.getByText(body)).toBeInTheDocument())
     const distribution = ["0.12%", "0.06%", "0.04%"]
     distribution.map((dis) => expect(screen.getByText(dis)).toBeInTheDocument())
     const currencyValue = ["~ 120.00 ETH", "~ 7.00 ETH", "~ 5.00 ETH"]
     currencyValue.map((val) => expect(screen.getByText(val)).toBeInTheDocument())
    })
    it("should render detail NFTs", () => {

      const nftDiv = screen.getAllByText("Nfts Icon")
      fireEvent.click(nftDiv[0])
      const nfts = ["Bored Ape...", "CryptoPun...", "Azuki"]
      nfts.map((nft) => expect(screen.getByText(nft)).toBeInTheDocument())

      fireEvent.click(nftDiv[1])
      const otherNfts = ["Crazy Ape...", "Ladybird", "Crazy"]
      otherNfts.map((nft) => expect(screen.getByText(nft)).toBeInTheDocument())
    })

    it("should switch to holdings", () => {
      const holdingsBtn = screen.getByRole("button", {name: /Holdings/i})
      fireEvent.click(holdingsBtn)
      
      expect(screen.getByText("Aave")).toBeInTheDocument()
    })
  })


  describe("table state: derivative", () => {
    beforeEach(() => {
      (useDetailComponent).mockReturnValue({
        data: {...derivativeMockDetail},
        isLoading: false,
        isError: false,
      });
      render(
          <TableDetailComponent
            tableStatus="derivative"
            assetId={1}
            currentValue={1000}
            totalAssetAmount={5000}
            assetName="Moonbirds"
            assetSymbol="Moonbird"
            assetUrl="https://btc.com"
          />
        );
    });
    afterEach(()=> jest.clearAllMocks())

    it("should just show one tabs", () => {
      expect(screen.getByRole("button", {name: /Asset-Groups/i})).toBeInTheDocument()
    })
    it("should render sltp", () => {
      expect(screen.getByText("Partial SL/TP:")).toBeInTheDocument()
      const cardElements = screen.getAllByText("Take Profit").length
      expect(cardElements).toBe(7)
      expect(screen.getByText("SL/TP:")).toBeInTheDocument()
      expect(screen.getByText("-- %")).toBeInTheDocument()
      expect(screen.getByText("10.00%")).toBeInTheDocument()
    })
  })


  describe("table state: cryptocurrency", () => {
    beforeEach(() => {
      (useDetailComponent).mockReturnValue({
        data: {...cryptoMockDetail, assetgroups: cryptoMockDetail.assetgroups.splice(0,2)},
        isLoading: false,
        isError: false,
      });
      render(
          <TableDetailComponent
            tableStatus="cryptocurrency"
            assetId={1}
            currentValue={1000}
            totalAssetAmount={5000}
            assetName="Bitcoin"
            assetSymbol="BTC"
            assetUrl="https://btc.com"
          />
        );
    });
    afterEach(()=> jest.clearAllMocks())
    it("renders critical navigation elements", () => {
      const navs = ["Details", "Asset-Groups", "Holdings"]
      navs.map((navEl)=> expect(screen.getByText(navEl)).toBeInTheDocument())
  
    })
    it("renders the initial correctly", () => {
      const header = ["Average Entry Price", "Market Price", "Average Exit Price", "Total Cost"]
      header.map((header) => expect(screen.getByText(header)).toBeInTheDocument())
      const body = ["$62,420.49", "$80,000.00", "$0.0₂ 55", "$49,811.13"]
      body.map((body) => expect(screen.getByText(body)).toBeInTheDocument()) 
    });
    it("calls rebalancing set up with the right arguments", () => {
      expect(RebalancingSetUp).toHaveBeenCalled()
      const callArgs = RebalancingSetUp.mock.calls[0][0]
      const expectedArgs =  {"assetId": 1, "currentValue": 1000, "data": {"currentbalance": 63.31, "desiredbalance": 36.69}}
      expect(callArgs).toEqual(expectedArgs)
    })
    it("renders DisDetail(Asset-Groups)", () => {
      const groupsBtn = screen.getByRole("button", {name: /Asset-Groups/i})
      fireEvent.click(groupsBtn)
      expect(Bar).toHaveBeenCalled()
    })

    it("renders DisDetail(Holdings)", () => {
      const holdingsBtn = screen.getByRole("button", {name: /Holdings/i})
      fireEvent.click(holdingsBtn)
    
    })

  })


describe("loading state", () => {
  beforeEach(() => {
    (useDetailComponent).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(
        <TableDetailComponent
          tableStatus="cryptocurrency"
          assetId={1}
          currentValue={1000}
          totalAssetAmount={5000}
          assetName="Bitcoin"
          assetSymbol="BTC"
          assetUrl="https://btc.com"
        />
      );
  });
  it("renders loading", () => {
    expect(SmallLoadingSkeleton).toHaveBeenCalled()
  })
})

describe("error state", () => {

  it("renders error, when hook returns error", () => {

      (useDetailComponent).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });
      render(
          <TableDetailComponent
            tableStatus="cryptocurrency"
            assetId={1}
            currentValue={1000}
            totalAssetAmount={5000}
            assetName="Bitcoin"
            assetSymbol="BTC"
            assetUrl="https://btc.com"
          />
        );
    expect(logger.error).toHaveBeenCalledWith("TableDetailComponent: detail fetch failed", {"data": undefined, "isError": true})
    expect(SmallErrorSkeleton).toHaveBeenCalled()
  })
  it("renders error, when wrong data is passed", () => {
    (useDetailComponent).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(
        <TableDetailComponent
          tableStatus="cryptocurrency"
          assetId={1}
          currentValue={1000}
          totalAssetAmount={5000}
          assetName="Bitcoin"
          assetSymbol="BTC"
          assetUrl="https://btc.com"
        />
      );
      expect(logger.error).toHaveBeenCalledWith("TableDetailComponent: wrong data format or empty Object while calling detailcomponent", {"data": [], "dataType": "object"})
  expect(SmallErrorSkeleton).toHaveBeenCalled()
  })
  it("renders error, when detaildata for certain state is not given", () => {
    (useDetailComponent).mockReturnValue({
      data: {...derivativeMockDetail, assetgroups: []},
      isLoading: false,
      isError: false,
    });
    render(
        <TableDetailComponent
          tableStatus="derivative"
          assetId={1}
          currentValue={1000}
          totalAssetAmount={5000}
          assetName="Bitcoin"
          assetSymbol="BTC"
          assetUrl="https://btc.com"
        />
      );
      expect(logger.error).toHaveBeenCalledWith("DisDetailData: no detail data in disdetail component")
      expect(SmallErrorSkeleton).toHaveBeenCalled()
  })
})

});
let resizeCallback; 

jest.mock("use-resize-observer", () => ({
  __esModule: true,
  default: jest.fn((params) => {
    resizeCallback = params.onResize;
    return { ref: jest.fn() }; // simulate the returned ref
  }),
}));

describe("AssetTableComponent - tabRef and ResizeObserver", () => {
  it("should assign tabRef and calculate tabWidth on mount", async () => {
    // Prevent mutation of the original array
    const mockData = {
      ...cryptoMockDetail,
      assetgroups: cryptoMockDetail.assetgroups.slice(0, 3),
      holdings: [],
      sltp: [],
    };

    // Mock useDetailComponent
    (useDetailComponent).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    render(
      <TableDetailComponent
        tableStatus="cryptocurrency"
        assetId={1}
        currentValue={1000}
        totalAssetAmount={5000}
        assetName="Bitcoin"
        assetSymbol="BTC"
        assetUrl="https://btc.com"
      />
    );

    // Trigger ResizeObserver callback
    act(() => {
      resizeCallback({ width: 600 });
    });

    // Wait for buttons and assert width
    await waitFor(() => {
      const btnNames = [
        { name: /Details/i },
        { name: /Asset-Groups/i },
        { name: /Holdings/i },
      ];
      const buttons = btnNames.map(({ name }) =>
        screen.getByRole("button", { name })
      );

      buttons.forEach((btn) => {
        expect(btn).toHaveStyle("width: 200px");
      });
    });
  });
});
