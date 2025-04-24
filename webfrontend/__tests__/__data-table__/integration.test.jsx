
import React from "react";
import '@testing-library/jest-dom'
import { render, screen, within, fireEvent, act,waitFor} from "@testing-library/react";
import AssetTableComponent from "../../src/utility/lib/build-components/asset-table-component";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dataColsCurrency, dataColsDerivative, dataColsNft } from "../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import { formatCurrency, formatValue } from "../../src/utility/lib/helpers/helper-functions";
import { LoadingSkeleton, ErrorSkeleton } from "../../src/utility/lib/datafetching/loading-skeleton";
import { ShowDetailIcon, SortingDataTableIcon, PositionDirectionIcon } from "../../public/images/icons";
import { checkIsOnDemandRevalidate } from "next/dist/server/api-utils";
import { TableDetailComponent } from "../../src/utility/lib/design-components/datatables/table-layout/datatable-detail-popup";
import {prefetchDetailComponent} from "../../src/utility/lib/datafetching/client-refetch/prefetch-hooks"


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

const mockPrefetch = jest.fn();
jest.mock("@/utility/lib/datafetching/client-refetch/prefetch-hooks", () => ({
  prefetchDetailComponent: (...args) => mockPrefetch(...args),
}));

jest.mock("../../src/utility/lib/design-components/datatables/table-layout/datatable-detail-popup", () => ({
  TableDetailComponent: jest.fn().mockImplementation(()=> <p> TableDetail Component</p>) 
}));

jest.mock('../../src/utility/lib/datafetching/loading-skeleton', () => ({
  LoadingSkeleton: jest.fn().mockImplementation(() => (
    <div data-testid="loading-skeleton">Loading...</div>
  )),
}));

jest.mock("../../public/images/icons", ()=> ({
  ShowDetailIcon: jest.fn().mockImplementation(()=> <button> ShowDetail</button> ),
  SortingDataTableIcon: jest.fn().mockImplementation(()=> <p> Sorting </p>),
  PositionDirectionIcon: jest.fn().mockImplementation(() => <p> P </p>)
}))

jest.mock("../../src/utility/lib/datafetching/client-refetch/prefetch-hooks", () => ({

  prefetchDetailComponent: jest.fn().mockImplementation(()=> null)
}))

const queryClient = new QueryClient();
const renderWithClient = (ui) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

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
      "nftcount": 20,
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
      "assetvalue": -72000,
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
    "nftcount": 10,
    "notes": "Notes"
  }, 
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
  const checkItem = (item ) => {
    const td = screen.getByText(item).closest("td")
    expect(within(td).getByText(item)).toBeInTheDocument()
  }

  const checkItemNotInDocument = (item) => {
    expect(screen.queryByText(item)).not.toBeInTheDocument();
  };

  describe("integration test with working config", () => {

    describe('tableStatus: cryptocurrency', () => {
      afterEach(()=> jest.clearAllMocks())
      beforeEach(()=>  renderWithClient(
        <AssetTableComponent config={tableConfig} />
      ) )

        it("renders the header", () => {
          expect(screen.getByText("Asset")).toBeInTheDocument()
          expect(screen.getByText("Value/Amount")).toBeInTheDocument()
          expect(screen.getByText("Percentage")).toBeInTheDocument()
          expect(screen.getByText("Change 24h")).toBeInTheDocument()
          expect(screen.getByText("P/L")).toBeInTheDocument()
          })
          it("renders the body", () => {
              const name = screen.getByText("Bitcoin").closest("td");
              expect(within(name).getByText("Bitcoin")).toBeInTheDocument(); 


              checkItem("Bitcoin")
              checkItem(mockInitial[0].assetamount)
              const assetvalue  = screen.getByText(mockInitial[0].assetamount).closest("td");
              expect(within(assetvalue).getByText("$700,000.00")).toBeInTheDocument()
              checkItem(`${formatValue(mockInitial[0].assetpercentage)} %`)
              checkItem(`${formatValue(mockInitial[0].assetchange24h)} %`)
              checkItem(formatCurrency(mockInitial[0].profitloss))
              const profitloss = screen.getByText(formatCurrency(mockInitial[0].profitloss)).closest("td")
              const pldivbtc = within(profitloss).getByText(`(${formatValue(mockInitial[0].profitlosschange)}%)`).closest("p")
              expect(pldivbtc).toHaveClass("text-green")
              expect(within(profitloss).getByText(`(${formatValue(mockInitial[0].profitlosschange)}%)`)).toBeInTheDocument()

              const profitlosseth = screen.getByText(formatCurrency(120)).closest("td")
              const pldiveth = within(profitlosseth).getByText(`(${formatValue(34)}%)`).closest("p")
              expect(pldiveth).toHaveClass("text-red")
              expect(within(profitlosseth).getByText(`(${formatValue(34)}%)`)).toBeInTheDocument()
          })
      });

      describe("tableStatus: nft", () => {
        beforeEach(()=>{ 
          renderWithClient(
          <AssetTableComponent config={tableConfig} />
        )
        const nftButton =  screen.getByRole("button", {name: /NFTs/i}); 
        expect(nftButton).toBeInTheDocument()
        act(() => {
          fireEvent.click(nftButton)
        });

      })
        afterEach(()=> jest.clearAllMocks())
        it("renders header", () => {
          expect(screen.getByText("Collection")).toBeInTheDocument()
          expect(screen.getByText("Value")).toBeInTheDocument()
          expect(screen.getByText("Floor Price")).toBeInTheDocument()
          expect(screen.getByText("Amount")).toBeInTheDocument()
              })
                
              it("renders table body", () => {
                  checkItem(mockInitial[3].assetname)
                  checkItem(new RegExp(`${mockInitial[3].collectionfloorprice} ETH`)) 
                  checkItem(formatCurrency(mockInitial[3].collectionvalue))

              const collectionvalue = screen.getByText(formatCurrency(mockInitial[3].collectionvalue)).closest("td")
              expect(within(collectionvalue).getByText(`1.00 ETH`)).toBeInTheDocument()

                  checkItem(mockInitial[3].nftcount)
                  checkItem(formatCurrency(mockInitial[3].profitloss))
          
                  const profitloss = screen.getByText(formatCurrency(mockInitial[3].profitloss)).closest("td")
                  expect(within(profitloss).getByText(`(${formatValue(mockInitial[3].profitlosschange)}%)`)).toBeInTheDocument()


              const lossnft = screen.getByText(formatCurrency(1340)).closest("td")
              const lossdivnft = within(lossnft).getByText(`(${formatValue(6)}%)`).closest("p")
              expect(lossdivnft).toHaveClass("text-red")
              expect(within(lossdivnft).getByText(`(${formatValue(6)}%)`)).toBeInTheDocument()
              });

      })

      describe("tableStatus: derivative", () => {
        beforeEach(()=>{ 
          renderWithClient(
          <AssetTableComponent config={tableConfig} />
        )
        const derivativeBtn =  screen.getByRole("button", {name: /Derivatives/i}); 
        expect(derivativeBtn).toBeInTheDocument()
        act(() => {
          fireEvent.click(derivativeBtn)
        });

      })
      afterEach (()=> jest.clearAllMocks())

              it("renders the header", () => {
                expect(screen.getByText("Symbol")).toBeInTheDocument()
                expect(screen.getByText("Entry")).toBeInTheDocument()
                expect(screen.getByText("Liq. Price")).toBeInTheDocument()
                expect(screen.getByText("Margin")).toBeInTheDocument()
                    })
                
                    it("renders the body", () => {
                      checkItem("BTCUSDT")
                      checkItem("LTCUSDT")
                      checkItem(formatCurrency(mockInitial[1].entry))
                      checkItem(formatCurrency(mockInitial[2].entry))
                      checkItem(formatCurrency(mockInitial[1].entry))
                      checkItem(formatCurrency(mockInitial[2].liquidationprice))
                      checkItem(formatCurrency(mockInitial[1].liquidationprice))
                      checkItem(formatCurrency(mockInitial[2].margin))
                      checkItem(formatCurrency(mockInitial[1].margin)) 
                      checkItem(formatCurrency(mockInitial[1].profitloss))
          
                      const profitlossfuture = screen.getByText(formatCurrency(mockInitial[1].profitloss)).closest("td")
                      expect(within(profitlossfuture).getByText(`(${formatValue(mockInitial[1].profitlosschange)}%)`)).toBeInTheDocument()


                      checkItem(formatCurrency(1030))
          
                      const profitlossperp = screen.getByText(formatCurrency(1030)).closest("td")
                      const pldivperp = within(profitlossperp).getByText(`(${formatValue(21)}%)`).closest("p")
                      expect(pldivperp).toHaveClass("text-red")
                      expect(within(profitlossperp).getByText(`(${formatValue(21)}%)`)).toBeInTheDocument()

                      const lossfuture = screen.getByText(formatCurrency(1001)).closest("td")
                      const lossdivf = within(lossfuture).getByText(`(${formatValue(25)}%)`).closest("p")
                      expect(lossdivf).toHaveClass("text-red")
                      expect(within(lossdivf).getByText(`(${formatValue(25)}%)`)).toBeInTheDocument()
                      
              
                    })


                    it("renders just futures", async () => {
                      const filterBtn = screen.getByRole("button", { name: /Future/i });
                      expect(filterBtn).toBeInTheDocument();
                      act(() => {
                        fireEvent.click(filterBtn);
                      });
                      await act(async () => {
                        await waitFor(() => {
                          checkItem("LTCUSDT");
                          checkItem(formatCurrency(mockInitial[2].entry));
                          checkItem(formatCurrency(mockInitial[2].liquidationprice));
                          checkItem(formatCurrency(mockInitial[2].margin));
                          checkItemNotInDocument("BTCUSDT");
                        });
                      });
                    });
                    
                    it("renders just perps", async () => {
                      const filterBtn = screen.getByRole("button", { name: /Perpetual/i });
                      expect(filterBtn).toBeInTheDocument();
                      act(() => {
                        fireEvent.click(filterBtn);
                      });
                      await act(async () => {
                        await waitFor(() => {
                          checkItem("BTCUSDT");
                          checkItem(formatCurrency(mockInitial[1].entry));
                          checkItem(formatCurrency(mockInitial[1].liquidationprice));
                          checkItem(formatCurrency(mockInitial[1].margin));
                          checkItemNotInDocument("LTCUSDT");
                        });
                      });
                    });
      })
  })

  describe("detail function", () => {
    beforeEach(()=>{ 
      renderWithClient(
      <AssetTableComponent config={tableConfig} />
    )}) 

    afterEach(()=> {
      jest.clearAllMocks()
    })
    it("expands detail if clicked on row", () => {
      const showDetail = screen.getAllByRole("button", {name: /ShowDetail/i})
      expect(showDetail[0]).toBeInTheDocument()
      act(() => {
        fireEvent.click(showDetail[0])
      });
      expect(TableDetailComponent).toHaveBeenCalledWith({"assetId": 1, "assetName": "BTC", "assetUrl": "A", "currentValue": 1000, "tableStatus": "cryptocurrency"}, {})

      expect(showDetail[1]).toBeInTheDocument()
      act(() => {
        fireEvent.click(showDetail[1])
      });
      expect(TableDetailComponent).toHaveBeenCalledWith({"assetId": 2, "assetName": "ETH", "assetUrl": "A", "currentValue": 1000, "tableStatus": "cryptocurrency"}, {})
    })
    it("prefetches data on mouse hover", async () => {
      const showDetail = screen.getAllByRole("button", { name: /ShowDetail/i });
      expect(showDetail[0]).toBeInTheDocument();
      await act(async () => {
        fireEvent.mouseOver(showDetail[0]);
        await waitFor(() => {
          expect(prefetchDetailComponent).toHaveBeenCalledWith("cryptocurrency", 1, {});
        });
      });
      expect(showDetail[1]).toBeInTheDocument();
      await act(async () => {
        fireEvent.mouseOver(showDetail[1]);
        await waitFor(() => {
          expect(prefetchDetailComponent).toHaveBeenCalledWith("cryptocurrency", 2, {});
        });
      });
    });
  })

  describe("AssetTableComponent - tabRef and ResizeObserver", () => {
    it("should assign tabRef and calculate tabWidth on mount", async() => {
      renderWithClient(<AssetTableComponent config={tableConfig} />);

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
        //not all buttons have width of 200 
        const btnNames = [{name: /Currencies/i}, {name: /NFTs/i},{name: /Derivatives/i}]
        const btns = btnNames.map((buttonSelector) => screen.getByRole("button", buttonSelector))
        btns.forEach((btn) => {
          expect(btn).toHaveStyle("width: 200px"); 
        });
      });
    }); 
  });







