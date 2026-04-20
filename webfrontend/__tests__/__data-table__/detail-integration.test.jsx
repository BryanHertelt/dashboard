import React from "react";
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import { TableDetailComponent } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent";
import { useDetailComponent } from "../../src/utility/lib/data-fetching/client-hooks";
import { RebalancingSetUp } from "../../src/utility/lib/helpers/helper-components/rebalancing-set-up";
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching/skeletons/error-skeleton";
import { SmallLoadingSkeleton } from "../../src/utility/lib/data-fetching/skeletons/loading-skeleton";
import { Bar } from "react-chartjs-2";
import logger from '../../src/utility/lib/logging/logger';
import { cryptoMockDetail, derivativeMockDetail, nftMockDetail } from "../testmocks";

// --- Mocks ---
jest.mock('../../src/utility/lib/logging/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}));

jest.mock("../../src/utility/lib/data-fetching/client-hooks", () => ({
  useDetailComponent: jest.fn(),
}));

jest.mock("../../src/utility/lib/helpers/helper-components/rebalancing-set-up", () => ({
  RebalancingSetUp: jest.fn(() => <div data-testid="rebalancing">RB-SetUp</div>),
}));

jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => <p>Bar Chart</p>),
}));

jest.mock("../../src/utility/lib/data-fetching/skeletons/loading-skeleton", () => ({
  SmallLoadingSkeleton: jest.fn(() => <div>Loading...</div>),
}));

jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
  SmallErrorSkeleton: jest.fn(() => <div>Error Skeleton</div>),
}));

jest.mock("../../src/utility/lib/helpers/helper-components/image-container", () => ({
  HoldingLogoImageContainer: jest.fn(() => <div>Image</div>),
  NftDetailImageContainer: jest.fn(() => null),
}));

let resizeCallback;
jest.mock("use-resize-observer", () => ({
  __esModule: true,
  default: jest.fn((params) => {
    resizeCallback = params?.onResize;
    return { ref: jest.fn() };
  }),
}));

// --- Helper ---
const setup = (props = {}) => {
  const defaultProps = {
    tableStatus: "cryptocurrency",
    assetId: 1,
    currentValue: 1000,
    totalAssetAmount: 5000,
    assetName: "Bitcoin",
    assetSymbol: "BTC",
    assetUrl: "https://btc.com"
  };
  return render(<TableDetailComponent {...defaultProps} {...props} />);
};

describe("TableDetailComponent", () => {
  afterEach(() => jest.clearAllMocks());

  describe("State: NFT", () => {
    beforeEach(() => {
      useDetailComponent.mockReturnValue({
        data: { ...nftMockDetail },
        isLoading: false,
        isError: false,
      });
    });

    it("renders navigation tabs and group data correctly", () => {
      setup({ tableStatus: "nft" });

      expect(screen.getByRole("button", { name: /Asset-Groups/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Holdings/i })).toBeInTheDocument();

      // Verify specific data content
      expect(screen.getByText("OpenSea")).toBeInTheDocument();
      expect(screen.getByText("6 NFTs")).toBeInTheDocument();
      expect(screen.getByText("~ 120.00 ETH")).toBeInTheDocument();
    });

    it("switches to holdings view on click", () => {
      setup({ tableStatus: "nft" });
      fireEvent.click(screen.getByRole("button", { name: /Holdings/i }));
      expect(screen.getByText("Aave")).toBeInTheDocument();
    });
  });

  describe("State: Derivative", () => {
    beforeEach(() => {
      useDetailComponent.mockReturnValue({
        data: { ...derivativeMockDetail },
        isLoading: false,
        isError: false,
      });
    });

    it("renders SL/TP details correctly", () => {
      setup({ tableStatus: "derivative" });
      expect(screen.getByText("Partial SL/TP:")).toBeInTheDocument();
      expect(screen.getAllByText("Take Profit").length).toBeGreaterThan(0);
      expect(screen.getByText("10.00%")).toBeInTheDocument();
    });
  });

  describe("State: Cryptocurrency", () => {
    beforeEach(() => {
      useDetailComponent.mockReturnValue({
        data: { ...cryptoMockDetail },
        isLoading: false,
        isError: false,
      });
    });

    it("initializes with correct financial labels and rebalancing call", () => {
      setup();
      
      ["Average Entry Price", "Market Price", "Total Cost"].forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });

      expect(RebalancingSetUp).toHaveBeenCalledWith(
        expect.objectContaining({ assetId: 1, currentValue: 1000 }),
        expect.any(Object)
      );
    });

    it("triggers Chart rendering when switching to Asset-Groups", () => {
      setup();
      fireEvent.click(screen.getByRole("button", { name: /Asset-Groups/i }));
      expect(Bar).toHaveBeenCalled();
    });
  });

  describe("Error and Loading Boundaries", () => {
    it("renders SmallLoadingSkeleton during fetch", () => {
      useDetailComponent.mockReturnValue({ isLoading: true });
      setup();
      expect(SmallLoadingSkeleton).toHaveBeenCalled();
    });

    it("renders ErrorSkeleton and logs error on fetch failure", () => {
      const errorContext = { data: undefined, isError: true };
      useDetailComponent.mockReturnValue(errorContext);
      
      setup();
      
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining(errorContext),
        expect.stringContaining("detail fetch failed")
      );
      expect(SmallErrorSkeleton).toHaveBeenCalled();
    });

    it("renders ErrorSkeleton when receiving invalid data format", () => {
      useDetailComponent.mockReturnValue({ data: [], isLoading: false, isError: false });
      setup();
      expect(SmallErrorSkeleton).toHaveBeenCalled();
    });
  });

  describe("ResizeObserver Integration", () => {
    it("dynamically calculates tab width on resize", async () => {
      useDetailComponent.mockReturnValue({
        data: { ...cryptoMockDetail },
        isLoading: false,
        isError: false,
      });

      setup();

      // Simulate container resize to 600px
      act(() => {
        resizeCallback({ width: 600 });
      });

      await waitFor(() => {
        // Find buttons and check width calculation (600px / 3 tabs = 200px)
        const tabs = ["Details", "Asset-Groups", "Holdings"];
        tabs.forEach(name => {
          expect(screen.getByRole("button", { name: new RegExp(name, "i") }))
            .toHaveStyle("width: 200px");
        });
      });
    });
  });
});