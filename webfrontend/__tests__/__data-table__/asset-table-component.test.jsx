import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act} from "@testing-library/react"
import { dataColsCurrency, dataColsDerivative, dataColsNft, dataColsGroups } from '../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols'
import useResizeObserver from 'use-resize-observer'
import {AssetTableComponent} from "../../src/utility/lib/data-table"
import AssetTableController from '../../src/utility/lib/data-table/asset-table-controller'
import logger from '../../src/utility/lib/logging/logger'

jest.mock('../../src/utility/lib/logging/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

jest.mock("../../src/utility/lib/data-table/asset-table-controller", () => ({
  __esModule: true,
  default: jest.fn(()=> <div data-test-id="mock-assettable-controller"> Mock </div>)
}));

observeMock = jest.fn();
unobserveMock = jest.fn();

beforeEach(() => {

  global.ResizeObserver = jest.fn().mockImplementation((cb) => {
    resizeCallback = cb; // Capture the callback
    return {
      observe: observeMock,
      unobserve: unobserveMock,
      disconnect: jest.fn(),
    };
  });

  // Mock getBoundingClientRect to return a custom width
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 600, 
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }));
});


const mockInitial = [
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
        "assetchange24h": 5,
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
      "size": 15000,
      "entry": 30000,
      "unrealizedpl": 2500,
      "price": 32000,
      "liquidationprice": 25000,
      "margin": 100,
      "tp": 3,
      "sl": 29,
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
        "size": 5000,
        "entry": 100,
        "unrealizedpl": -250,
        "price": 95,
        "liquidationprice": 85,
        "margin": 35,
        "tp": 10,
        "sl": null,
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
      "collectionfloorprice": 1200,
      "nftcount": 20,
      "notes": "Notes"
    }
 ]


const tableConfig = {
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

describe("AssetTableComponent initialises AssetTableController", () => {
    beforeEach(()=> {
        render(<AssetTableComponent config={tableConfig} />)
    })

    afterEach(()=> {
      jest.clearAllMocks()
    })
  describe("handles status changes as specified in config", () => {
    afterEach(()=> {
      jest.clearAllMocks()
    })
    it("renders all Buttons if status > 1", () => {
      const currencyButton = screen.getByRole("button", {name: /Currencies/i}); 
      expect(currencyButton).toBeInTheDocument()
      const nftButton =  screen.getByRole("button", {name: /NFTs/i}); 
      expect(nftButton).toBeInTheDocument()
      const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
      expect(derivativeButton).toBeInTheDocument()
    })
    it("renders just one button if status = 1", () => {
      jest.clearAllMocks()
      const newTableConfig = {
        ...tableConfig, 
        status: [
          {
            statusTitle: "Asset-Groups", 
            statusFilter: "", 
            columns: dataColsGroups
          }
        ]
      }
      render(<AssetTableComponent config={newTableConfig} />)
      expect(screen.getByText("Asset-Groups")).toBeInTheDocument()
    })
    it("currency", () => {
      const currencyButton = screen.getByRole("button", {name: /Currencies/i}); 
      expect(currencyButton).toBeInTheDocument()
      fireEvent.click(currencyButton);
        expect(AssetTableController).toHaveBeenCalledWith(
          expect.objectContaining({ tableStatus: "cryptocurrency" }),
          {}
      );
    })
    it("nft", () => {
      const nftButton =  screen.getByRole("button", {name: /NFTs/i}); 
      expect(nftButton).toBeInTheDocument()
      fireEvent.click(nftButton);
        expect(AssetTableController).toHaveBeenCalledWith(
          expect.objectContaining({ tableStatus: "nft" }),
          {}
      );
    })
    it("derivative", () => {
      const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
      fireEvent.click(derivativeButton);
        expect(AssetTableController).toHaveBeenCalledWith(
          expect.objectContaining({ tableStatus: "derivative" }),
          {}
      );
    })


    describe("logs correctly", () => {
      beforeEach(() => jest.clearAllMocks())
      afterEach(()=> jest.clearAllMocks())
    it("correctly logs when invalid config", () => {
      const newConfig = {...tableConfig, status: [], filter: []}
      render(<AssetTableComponent config={newConfig}/>)
      expect(logger.error).toHaveBeenCalledWith("AssetTableComponent: invalid config: status or filter array is empty or undefined", {"config": {"currentValue": 1000, "detail": true, "filter": [], "initial": [{"assetabbreviation": "BTC", "assetamount": 0.5, "assetchange24h": 5, "assetchange24hourvalue": 35000, "assetchange7d": [680000, 690000, 710000, 695000, 700000], "assetid": 1, "assetmarketprice": 1400000, "assetname": "Bitcoin", "assetpercentage": 5, "assettype": "cryptocurrency", "assetvalue": 700000, "groupid": 1, "holdingid": 1, "notes": "Notes", "portfolioid": 1, "symbol": "A", "userid": 1}, {"assetid": 12, "assetname": "BTCUSDT", "assetpercentage": 3, "assettype": "derivative", "derivateexchange": "Bybit", "derivativetype": "future", "entry": 30000, "groupid": 2, "holdingid": 7, "leverage": 5, "liquidationprice": 25000, "margin": 100, "notes": "Notes", "portfolioid": 1, "positiontype": "open", "price": 32000, "settlementdate": "2024-06-15T10:00:00.000Z", "size": 15000, "sl": 29, "symbol": "C", "tp": 3, "tradedirection": "long", "unrealizedpl": 2500, "userid": 1}, {"assetid": 18, "assetname": "LTCUSDT", "assetpercentage": 3, "assettype": "derivative", "derivateexchange": "Bybit", "derivativetype": "perpetual", "entry": 100, "groupid": 2, "holdingid": 7, "leverage": 15, "liquidationprice": 85, "margin": 35, "notes": "Notes", "portfolioid": 1, "positiontype": "open", "price": 95, "settlementdate": "", "size": 5000, "sl": null, "symbol": "C", "tp": 10, "tradedirection": "short", "unrealizedpl": -250, "userid": 1}, {"assetid": 312, "assetname": "Bored Ape Yacht Club", "assetpercentage": 3, "assettype": "nft", "collectionfloorprice": 1200, "collectionvalue": 1200, "groupid": 2, "holdingid": 7, "nftcount": 20, "notes": "Notes", "portfolioid": 1, "symbol": "B", "userid": 1}], "status": [], "statusFilter": "assettype", "title": "Assets"}})
    })
    })
  
    })
    describe("handles filter as expected", () => {
      beforeEach(()=> {
        const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
        fireEvent.click(derivativeButton);
      })
      afterEach(()=> {
        jest.clearAllMocks()
      })

      it("renders Button", () => {
        const  perpBtn = screen.getByRole("button", {name: /Perpetual/i})
        const futureBtn = screen.getByRole("button", {name: /Future/i})
        expect(perpBtn).toBeInTheDocument() 
        expect(futureBtn).toBeInTheDocument()
      })
    })


    describe("handles status changes as specified in the config", () => {
      afterEach(() => jest.clearAllMocks())

    it("handles perp filter", () => {
      const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
      fireEvent.click(derivativeButton);
      const  perpBtn = screen.getByRole("button", {name: /Perpetual/i})
      fireEvent.click(perpBtn)
      expect(AssetTableController.mock.calls[2]).toEqual([
        expect.objectContaining({
          filterType: { future: true, perp: false }
        }),
        {}
      ]);
    })
    it("handles future filter ", () => {
      const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
      fireEvent.click(derivativeButton);
      const futureBtn = screen.getByRole("button", {name: /Future/i})
      fireEvent.click(futureBtn)
      expect(AssetTableController.mock.calls[2]).toEqual([
        expect.objectContaining({
          filterType: { future: false, perp: true }
        }),
        {}
      ]);
    })

    it("does not allow both unselected", () => {
      const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
      fireEvent.click(derivativeButton);
      const  perpBtn = screen.getByRole("button", {name: /Perpetual/i})
      const futureBtn = screen.getByRole("button", {name: /Future/i})
      fireEvent.click(perpBtn)
      fireEvent.click(futureBtn)
      expect(AssetTableController.mock.calls[2]).toEqual([
        expect.objectContaining({
          filterType: { future: true, perp: false }
        }),
        {}
      ]);
    })
    })
    })




    describe("AssetTableComponent - tabRef and ResizeObserver", () => {
      it("should assign tabRef and calculate tabWidth on mount", async() => {
        render(<AssetTableComponent config={tableConfig} />);
  
        const navDiv = screen.getByRole("navigation").querySelector("div");
    
        act(() => {
          resizeCallback([
            {
              target: navDiv,
              contentRect: { width: 500 }, 
            },
          ], {});
        });
    
        await waitFor(() => {
          const btnNames = [{name: /Currencies/i}, {name: /NFTs/i},{name: /Derivatives/i}]
          const btns = btnNames.map((buttonSelector) => screen.getByRole("button", buttonSelector))
          btns.forEach((btn) => {
            expect(btn).toHaveStyle("width: 166.66666666666666px"); 
          });
        });
      }); 
    });

  