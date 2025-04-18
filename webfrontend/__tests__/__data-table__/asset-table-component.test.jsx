import '@testing-library/jest-dom'
import AssetTableComponent from "../../src/utility/lib/build-components/asset-table-component"
import { render, screen, fireEvent, waitFor} from "@testing-library/react"
import { formatDataColsCurrency, formatDataColsDerivative, formatDataColsNft } from "../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols"

import AssetTableController from '../../src/utility/lib/build-components/asset-table-controller'


// Place this at the top of your test file (before describe)
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

// Assign to global so it's available before render
global.ResizeObserver = MockResizeObserver;

jest.mock("../../src/utility/lib/build-components/asset-table-controller", () => ({
  __esModule: true,
  default: jest.fn(()=> <div data-test-id="mock-assettable-controller"> Mock </div>)
}));

jest.mock("../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols", () => ({
  formatDataColsCurrency: jest.fn().mockImplementation(() => <div> test </div>),
  formatDataColsDerivative: jest.fn().mockImplementation(() => <div> test </div>),
  formatDataColsNft: jest.fn().mockImplementation(() => <div> test </div>),
}));

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
        columns: formatDataColsCurrency,
      },
      {
        status: "nft",
        statusTitle: "NFTs",
        columns: formatDataColsNft,
      },
      {
        status: "derivative",
        statusTitle: "Derivatives",
        columns: formatDataColsDerivative,
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
    it("renders all Buttons", () => {
      const currencyButton = screen.getByRole("button", {name: /Currencies/i}); 
      expect(currencyButton).toBeInTheDocument()
      const nftButton =  screen.getByRole("button", {name: /NFTs/i}); 
      expect(nftButton).toBeInTheDocument()
      const derivativeButton = screen.getByRole("button", {name: /Derivatives/i}); 
      expect(derivativeButton).toBeInTheDocument()
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
    it("should observe the tab container with ResizeObserver", () => {
      const observeSpy = jest.spyOn(MockResizeObserver.prototype, "observe");
    
      render(<AssetTableComponent config={config} />);
    
      expect(observeSpy).toHaveBeenCalled();
    });
    
    })