import React from "react";
import '@testing-library/jest-dom';
import { render, screen, within, fireEvent, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AssetTableComponent } from "../../src/utility/lib/data-table";
import { prefetchDetailComponent } from "../../src/utility/lib/data-fetching/prefetch-hooks";
import { mockInitial, tableConfig } from "../testmocks";
import { formatCurrency } from "../../src/utility/lib/helpers/helper-functions/formatCurrency";
import { formatValue } from "../../src/utility/lib/helpers/helper-functions/formatValue";

// --- Spy-able Mocks ---
let resizeCallback;
jest.mock("../../src/utility/lib/data-fetching/prefetch-hooks", () => ({
  prefetchDetailComponent: jest.fn(),
}));

jest.mock("../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent", () => ({
  TableDetailComponent: jest.fn(() => <div data-testid="mock-detail">Detail View</div>),
}));

jest.mock("../../public/images/icons", () => ({
  ShowDetailIcon: jest.fn(({ rowId }) => <button data-testid={`toggle-${rowId}`}>ShowDetail</button>),
  SortingDataTableIcon: jest.fn(() => <span>Sorting</span>),
  PositionDirectionIcon: jest.fn(() => <span>P</span>),
}));

// --- Setup Helper ---
const setup = (config = tableConfig) => {
  // Create a fresh QueryClient for every single test to avoid data leaking
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AssetTableComponent config={config} />
    </QueryClientProvider>
  );
};

describe("AssetTableComponent Integration", () => {
  beforeAll(() => {
    global.ResizeObserver = jest.fn().mockImplementation((cb) => {
      resizeCallback = cb;
      return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };
    });
  });

  afterEach(() => jest.clearAllMocks());

  describe("Table Rendering & Scoped Data", () => {
    it("renders cryptocurrency row data accurately", () => {
      setup();

      // Get the row semantically
      const row = screen.getByRole("row", { name: /bitcoin/i });
      const rowScope = within(row);

      // Assertions
      expect(rowScope.getByText("Bitcoin")).toBeInTheDocument();
      expect(rowScope.getByText(mockInitial[0].assetamount.toString())).toBeInTheDocument();
      
      const pLValue = formatCurrency(mockInitial[0].profitloss);
      const pLPercent = `(${formatValue(mockInitial[0].profitlosschange)}%)`;
      
      expect(rowScope.getByText(pLValue)).toBeInTheDocument();
      // Directly check the class on the element found by RTL
      expect(rowScope.getByText(pLPercent)).toHaveClass("text-green");
    });
  });

  describe("Interactive Logic", () => {
    it("filters to show only Futures", async () => {
      setup();
      
      fireEvent.click(screen.getByRole("button", { name: /Derivatives/i }));
      fireEvent.click(screen.getByRole("button", { name: /Future/i }));

      // waitFor should only be used to wait for the UI to stabilize
      await waitFor(() => {
        expect(screen.queryByText("BTCUSDT")).not.toBeInTheDocument();
      });

      // Assertions on the final state go outside if possible, 
      // but queryBy checks inside waitFor are often necessary for disappearing elements.
      expect(screen.getByText("LTCUSDT")).toBeInTheDocument();
    });

    it("prefetches data on hover without Node access", async () => {
      setup();
      
      const toggle = screen.getByTestId("toggle-0");
      fireEvent.mouseOver(toggle);

      // Only assert the call inside or after waitFor
      await waitFor(() => expect(prefetchDetailComponent).toHaveBeenCalledTimes(1));
      
      expect(prefetchDetailComponent).toHaveBeenCalledWith(
        "cryptocurrency", 
        1, 
        expect.any(Object)
      );
    });
  });

  describe("Responsive Layout", () => {
    it("adjusts tab widths via ResizeObserver", async () => {
      setup();

      // Avoid querySelector or firstChild. 
      // If the component has role="navigation", find the container within it.
      const nav = screen.getByRole("navigation");
      const tabContainer = within(nav).getByTestId("tab-container"); // Ensure this test-id exists in your JSX

      act(() => {
        resizeCallback([{
          target: tabContainer,
          contentRect: { width: 450 },
        }]);
      });

      // Wait for style update
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /NFTs/i })).toHaveStyle("width: 150px");
      });
    });
  });
});