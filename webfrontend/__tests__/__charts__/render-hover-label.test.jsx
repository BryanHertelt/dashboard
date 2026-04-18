import { renderHoverLabel } from "../../src/utility/lib/charts/renderHoverLabel";

// --- Mocks ---
jest.mock("../../src/utility/lib/helpers", () => ({
  formatCurrency: jest.fn((val) => `$${(val ?? 0).toFixed(2)}`),
  formatValue: jest.fn((val) => (val ?? 0).toFixed(2)),
}));

describe('renderHoverLabel', () => {
  let chart, ctx, info;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 1. Mock Canvas Context
    ctx = {
      save: jest.fn(),
      restore: jest.fn(),
      fillText: jest.fn(),
      font: '',
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
    };

    // 2. Mock Chart Instance
    chart = {
      ctx,
      chartArea: { width: 400, height: 400, top: 50 },
    };

    // 3. Mock Data (Default State)
    info = {
      selectedDatasetIndex: { current: null },
      selectedIndex: { current: null },
      updatedPieData: [
        { assettype: 'nft', disElVal: 5000, disElName: 'NFT Asset', disElDistribution: 25 },
        { assettype: 'stock', disElVal: 3000, disElName: 'Stock Asset', disElDistribution: 15 },
      ],
      tresholdValue: 2,
      otherValue: 1000,
      otherDistribution: 5,
      pieData: { total: 10000 },
      total: 10000,
      full: false,
      others: 'Other Assets'
    };
  });

  // --- Helper to verify canvas text sequence ---
  const expectCanvasStrings = (strings) => {
    strings.forEach((str, index) => {
      expect(ctx.fillText).toHaveBeenNthCalledWith(index + 1, str, expect.any(Number), expect.any(Number));
    });
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  };

  test('renders total and 100% when no asset is hovered', () => {
    renderHoverLabel(chart, info);
    expectCanvasStrings(['$10000.00', '100%']);
    expect(ctx.textAlign).toBe('center');
  });

  test('renders specific asset details when hovered', () => {
    info.selectedDatasetIndex.current = 0;
    info.selectedIndex.current = 0;

    renderHoverLabel(chart, info);
    
    // Assets: Value, Name, Percentage
    expectCanvasStrings(['$5000.00', 'NFT Asset', '25.00%']);
  });

  test('renders aggregated "Other Assets" details when threshold is reached', () => {
    info.selectedDatasetIndex.current = 0;
    info.selectedIndex.current = 2; // Beyond threshold (0, 1 are main assets)

    renderHoverLabel(chart, info);

    expectCanvasStrings(['$1000.00', 'Other Assets', '5.00%']);
  });

  test('handles non-NFT assets correctly', () => {
    info.selectedDatasetIndex.current = 0;
    info.selectedIndex.current = 1;

    renderHoverLabel(chart, info);

    expectCanvasStrings(['$3000.00', 'Stock Asset', '15.00%']);
  });
});