import { renderHoverLabel } from "../../src/utility/lib/charts/renderHoverLabel";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { Chart as ChartJS } from 'chart.js';
import { formatValue, formatCurrency } from "../../src/utility/lib/helpers";

jest.mock("../../src/utility/lib/helpers", () => ({
  formatCurrency: jest.fn((value) => `$${(value ?? 0).toFixed(2)}`), // Handle undefined/null with fallback to 0
  formatValue: jest.fn((value) => (value ?? 0).toFixed(2)), // Handle undefined/null with fallback to 0
}));

describe('renderHoverLabel', () => {
  let chart;
  let ctx;
  let hoverLabelInformation;

  beforeEach(() => {
    // Mock the canvas context (ctx) for drawing operations
    jest.clearAllMocks();
    ctx = {
      save: jest.fn(),
      restore: jest.fn(),
      fillText: jest.fn(),
      font: '',
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
    };

    // Mock the chart object
    chart = {
      ctx,
      chartArea: {
        width: 400,
        height: 400,
        top: 50,
      },
    };

    // Default hoverLabelInformation setup, aligned with function expectations
    hoverLabelInformation = {
      selectedDatasetIndex: { current: null },
      selectedIndex: { current: null },
      updatedPieData: [
        { assettype: 'nft', disElVal: 5000, disElName: 'NFT Asset', disElDistribution: 25 },
        { assettype: 'stock', disElVal: 3000, disElName: 'Stock Asset', disElDistribution: 15 },
      ],
      tresholdValue: 2,
      otherValue: 1000,
      otherDistribution: 5,
      pieData: {
        total: 10000,
      },
      total: 10000,
      full: false,
      others: 'Other Assets'
    };
  });

  test('renders default label when no asset is selected', () => {
    renderHoverLabel(chart, hoverLabelInformation);

    // Verify context properties are set correctly
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('#000000');
    expect(ctx.textAlign).toBe('center');
    expect(ctx.textBaseline).toBe('middle');

    // Verify first fillText call for total value
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('$10000.00', 200, 275); // width/2, height/2 + top + 25

    // Verify font change and second fillText call for percentage
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('100%', 200, 300); // width/2, height/2 + top + 50

    expect(ctx.restore).toHaveBeenCalled();
  });

  test('renders selected asset label when an asset is hovered', () => {
    hoverLabelInformation.selectedDatasetIndex.current = 0;
    hoverLabelInformation.selectedIndex.current = 0;

    renderHoverLabel(chart, hoverLabelInformation);

    // Verify context properties are set correctly
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('#000000');
    expect(ctx.textAlign).toBe('center');
    expect(ctx.textBaseline).toBe('middle');

    // Verify first fillText call for asset value
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('$5000.00', 200, 260); // width/2, height/2 + top + 10

    // Verify font change and second fillText call for asset name
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('NFT Asset', 200, 285); // width/2, height/2 + top + 35

    // Verify font change and third fillText call for distribution
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('25.00%', 200, 305); // width/2, height/2 + top + 55

    expect(ctx.restore).toHaveBeenCalled();
  });

  test('renders other assets label when threshold is exceeded', () => {
    hoverLabelInformation.selectedDatasetIndex.current = 0;
    hoverLabelInformation.selectedIndex.current = 2; // Index >= tresholdValue

    renderHoverLabel(chart, hoverLabelInformation);

    // Verify context properties are set correctly
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('#000000');
    expect(ctx.textAlign).toBe('center');
    expect(ctx.textBaseline).toBe('middle');

    // Verify first fillText call for other assets value
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('$1000.00', 200, 260); // width/2, height/2 + top + 10

    // Verify font change and second fillText call for "Other Assets"
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('Other Assets', 200, 285); // width/2, height/2 + top + 35

    // Verify font change and third fillText call for distribution
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('5.00%', 200, 305); // width/2, height/2 + top + 55

    expect(ctx.restore).toHaveBeenCalled();
  });

  test('handles non-NFT asset correctly when selected', () => {
    hoverLabelInformation.selectedDatasetIndex.current = 0;
    hoverLabelInformation.selectedIndex.current = 1; // Select second asset (stock)

    renderHoverLabel(chart, hoverLabelInformation);

    // Verify context properties are set correctly
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('#000000');
    expect(ctx.textAlign).toBe('center');
    expect(ctx.textBaseline).toBe('middle');

    // Verify text for selected non-NFT asset
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('$3000.00', 200, 260); // width/2, height/2 + top + 10
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('Stock Asset', 200, 285); // width/2, height/2 + top + 35
    expect(ctx.font).toBe('lighter 1rem  sans-serif');
    expect(ctx.fillText).toHaveBeenCalledWith('15.00%', 200, 305); // width/2, height/2 + top + 55

    expect(ctx.restore).toHaveBeenCalled();
  });
});