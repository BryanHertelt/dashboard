
import React from "react";
import '@testing-library/jest-dom'
import { render, screen, within, fireEvent, act,waitFor} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShowDetailIcon, SortingDataTableIcon, PositionDirectionIcon } from "../../public/images/icons";
import { mockInitial, tableConfig, detailMockCryptoResponse, detailMockDerivatives, detailMockNFTs } from "../testmocks";
import { AssetTableComponent } from "../../src/utility/lib/data-table";
import { dataColsCurrency, dataColsDerivative, dataColsNft } from "../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols";
import { formatCurrency } from "../../src/utility/lib/helpers/helper-functions/formatCurrency";
import { formatValue } from "../../src/utility/lib/helpers/helper-functions/formatValue";
import { SmallLoadingSkeleton } from "../../src/utility/lib/data-fetching/skeletons/loading-skeleton";
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching/skeletons/error-skeleton";
import { TableDetailComponent } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent";
import { prefetchDetailComponent } from "../../src/utility/lib/data-fetching/prefetch-hooks";
import { RebalancingSetUp } from "../../src/utility/lib/helpers/helper-components/rebalancing-set-up";
import { DrDetail, DisDetail } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-detail-components";


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

jest.mock("../../src/utility/lib/data-fetching/prefetch-hooks", () => ({
  prefetchDetailComponent: jest.fn().mockImplementation(()=> null)
}))

jest.mock("../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent", () => ({
  TableDetailComponent: jest.fn().mockImplementation(()=> <p> TableDetail Component</p>) 
}));


jest.mock("../../src/utility/lib/data-table/table-detail-components/v-ad-assets-detail-components", () => ({
  DrDetail: jest.fn().mockImplementation(() => <div> DrDetail </div>), 
  DisDetail: jest.fn().mockImplementation(()=> <div> DisDetail</div>)
}));


jest.mock("../../src/utility/lib/data-fetching/skeletons/loading-skeleton", () => ({
  SmallLoadingSkeleton: jest.fn().mockImplementation(() => (
    <div data-testid="loading-skeleton">Loading...</div>
  )),
}));

jest.mock("../../public/images/icons", ()=> ({
  ShowDetailIcon: jest.fn().mockImplementation(()=> <button onClick={() => console.log("clicked")}> ShowDetail</button> ),
  SortingDataTableIcon: jest.fn().mockImplementation(()=> <p> Sorting </p>),
  PositionDirectionIcon: jest.fn().mockImplementation(() => <p> P </p>)
}))

jest.mock("../../src/utility/lib/helpers/helper-components/rebalancing-set-up", ()=> ({
  RebalancingSetUp: jest.fn().mockImplementation(()=> <div> RB-SetUp </div> ),
}))

const queryClient = new QueryClient();
const renderWithClient = (ui) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);


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

                  checkItem(mockInitial[3].assetamount)
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

    it("expands detail if clicked on row", () => {
      const showDetail = screen.getAllByRole("button", {name: /ShowDetail/i})
      expect(showDetail[0]).toBeInTheDocument()
      act(() => {
        fireEvent.click(showDetail[0])
      });
      expect(TableDetailComponent).toHaveBeenCalledWith({"assetId": 1, "assetName": "BTC", "assetUrl": "A", "currentValue": 1000, "tableStatus": "cryptocurrency", "totalAssetAmount": 0.5}, {})
  
      expect(showDetail[1]).toBeInTheDocument()
      act(() => {
        fireEvent.click(showDetail[1])
      });
      expect(TableDetailComponent).toHaveBeenCalledWith({"assetId": 2, "assetName": "ETH", "assetUrl": "A", "currentValue": 1000, "tableStatus": "cryptocurrency", "totalAssetAmount" : 0.4}, {})
    })
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
        const btnNames = [{name: /Currencies/i}, {name: /NFTs/i},{name: /Derivatives/i}]
        const btns = btnNames.map((buttonSelector) => screen.getByRole("button", buttonSelector))
        btns.forEach((btn) => {
          expect(btn).toHaveStyle("width: 166.66666666666666px"); 
        });
      });
    }); 
  });

  describe("renders no detail", () => {
    beforeEach(()=> jest.clearAllMocks())
    it("renders no detail", () => {
      const newConfig = {...tableConfig, detail: false}
      renderWithClient(
        <AssetTableComponent config={newConfig} />) 
        expect(ShowDetailIcon).not.toHaveBeenCalled()
    })
  })





