import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { AssetTableComponent } from "../../src/utility/lib/data-table"
import AssetTableController from '../../src/utility/lib/data-table/asset-table-controller'
import logger from '../../src/utility/lib/logging/logger'
import { dataColsCurrency, dataColsNft, dataColsDerivative } from '../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols'
import { dataColsGroups } from '../../src/utility/lib/data-table/v-ad-cols/asset-group-distribution-cols'

// --- Mocks ---
jest.mock('../../src/utility/lib/logging/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

jest.mock("../../src/utility/lib/data-table/asset-table-controller", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-test-id="mock-controller">Mock</div>)
}));

let resizeCallback;
const observeMock = jest.fn();
const unobserveMock = jest.fn();

beforeEach(() => {
  global.ResizeObserver = jest.fn().mockImplementation((cb) => {
    resizeCallback = cb;
    return { observe: observeMock, unobserve: unobserveMock, disconnect: jest.fn() };
  });

  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 600, height: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => {},
  }));
});

// --- Test Configuration ---
const mockInitial = [
  { symbol: "A", assettype: "cryptocurrency", assetname: "Bitcoin", assetid: 1 },
  { symbol: "C", assettype: "derivative", assetname: "BTCUSDT", derivativetype: "future", assetid: 12 },
  { symbol: "B", assettype: "nft", assetname: "Bored Ape", assetid: 312 }
];

const tableConfig = {
  title: "Assets",
  initial: mockInitial,
  detail: true,
  statusFilter: "assettype",
  status: [
    { status: "cryptocurrency", statusTitle: "Currencies", columns: dataColsCurrency },
    { status: "nft", statusTitle: "NFTs", columns: dataColsNft },
    { status: "derivative", statusTitle: "Derivatives", columns: dataColsDerivative },
  ],
  filter: [
    { filter: "perp", filterTitle: "Perpetual", filterStatus: "derivative" },
    { filter: "future", filterTitle: "Future", filterStatus: "derivative" },
  ],
  currentValue: 1000,
};

const setup = (config = tableConfig) => render(<AssetTableComponent config={config} />);

// --- Tests ---
describe("AssetTableComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all status buttons when config has multiple statuses", () => {
    setup();
    ["Currencies", "NFTs", "Derivatives"].forEach(text => {
      expect(screen.getByRole("button", { name: new RegExp(text, 'i') })).toBeInTheDocument();
    });
  });

  it("renders only one button if config has single status", () => {
    const singleConfig = { ...tableConfig, status: [{ statusTitle: "Groups", columns: dataColsGroups }] };
    setup(singleConfig);
    expect(screen.getByText("Groups")).toBeInTheDocument();
  });

  it("calls Controller with correct status when buttons are clicked", () => {
    setup();
    const nftBtn = screen.getByRole("button", { name: /NFTs/i });
    fireEvent.click(nftBtn);
    expect(AssetTableController).toHaveBeenLastCalledWith(
      expect.objectContaining({ tableStatus: "nft" }), 
      expect.any(Object)
    );
  });

  it("logs error for invalid configuration", () => {
    setup({ ...tableConfig, status: [] });
    expect(logger.error).toHaveBeenCalledWith(
      expect.any(Object),
      expect.stringContaining("invalid config")
    );
  });

  it("renders sub-filters when a status with filters (Derivatives) is active", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Derivatives/i }));
    expect(screen.getByRole("button", { name: /Perpetual/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Future/i })).toBeInTheDocument();
  });

  it("handles sub-filter toggling correctly", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Derivatives/i }));
    
    // Toggle Perpetual off
    fireEvent.click(screen.getByRole("button", { name: /Perpetual/i }));
    expect(AssetTableController).toHaveBeenLastCalledWith(
      expect.objectContaining({ filterType: { future: true, perp: false } }),
      expect.any(Object)
    );

    // Prevent both from being unselected
    fireEvent.click(screen.getByRole("button", { name: /Future/i }));
    expect(AssetTableController).toHaveBeenLastCalledWith(
      expect.objectContaining({ filterType: { future: true, perp: false } }),
      expect.any(Object)
    );
  });

  it("recalculates button widths via ResizeObserver", async () => {
    setup();

    act(() => {
      resizeCallback([{ contentRect: { width: 450 } }], {});
    });

    await waitFor(() => {
      const btns = screen.getAllByRole("button").filter(b => 
        ["Currencies", "NFTs", "Derivatives"].includes(b.textContent)
      );
      btns.forEach(btn => expect(btn).toHaveStyle("width: 150px"));
    });
  });
});