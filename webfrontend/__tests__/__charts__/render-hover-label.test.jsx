import { renderHoverLabel } from "../../src/utility/lib/charts/renderHoverLabel";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { Chart as ChartJS } from 'chart.js';
import { formatValue, formatCurrency } from "../../src/utility/lib/helpers";

describe('renderHoverLabel', () => {
    let chart;
    let ctx;
    let hoverLabelInformation;
  
    beforeEach(() => {
      // Mock the canvas context (ctx) for drawing operations
      jest.clearAllMocks()
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
  
      // Default hoverLabelInformation setup
      hoverLabelInformation = {
        selectedDatasetIndex: { current: null },
        selectedIndex: { current: null },
        updatedPieData: [
          { assettype: 'nft', collectionfloorprice: 5000, assetname: 'NFT Asset', distribution: 25 },
          { assettype: 'stock', assetvalue: 3000, assetname: 'Stock Asset', distribution: 15 },
        ],
        tresholdValue: 2,
        otherAssetsValue: 1000,
        otherAssetsDistribution: 5,
        pieData: {
          total: 10000,
        },
      };
    });
  
    test('renders default label when no asset is selected', () => {
      renderHoverLabel(chart, hoverLabelInformation);
    
      // Verify context properties are set correctly
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.font).toBe('lighter 1rem  sans-serif');
      expect(ctx.fillStyle).toBe('#000000'); // Assuming black is '#000000'
      expect(ctx.textAlign).toBe('center');
      expect(ctx.textBaseline).toBe('middle');
    
      // Verify first fillText call for total value
      expect(ctx.fillText.mock.calls[0]).toEqual(['$10,000.00', 200, 275]); // width/2, height/2 + top + 25
    
      // Verify font change and second fillText call for percentage
      expect(ctx.font).toBe('lighter 1rem  sans-serif');
      expect(ctx.fillText.mock.calls[1]).toEqual(['100%', 200, 300]); // width/2, height/2 + top + 50
    
      expect(ctx.restore).toHaveBeenCalled(); })
  
      test('renders selected asset label when an asset is hovered', () => {
        hoverLabelInformation.selectedDatasetIndex.current = 0;
        hoverLabelInformation.selectedIndex.current = 0;
      
        renderHoverLabel(chart, hoverLabelInformation);
      
        // Verify context properties are set correctly
        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.font).toBe('lighter 1rem  sans-serif');
        expect(ctx.fillStyle).toBe('#000000');
        expect(ctx.textAlign).toBe('center');
        expect(ctx.textBaseline).toBe('middle');
      
        // Verify first fillText call for asset value (NFT)
        expect(ctx.fillText.mock.calls[0]).toEqual(['$5,000.00', 200, 260]); // width/2, height/2 + top + 10
      
        // Verify font change and second fillText call for asset name
        expect(ctx.font).toBe('lighter 1rem  sans-serif');
        expect(ctx.fillText.mock.calls[1]).toEqual(['NFT Asset', 200, 285]); // width/2, height/2 + top + 35
      
        // Verify font change and third fillText call for distribution
        expect(ctx.font).toBe('lighter 1rem  sans-serif');
        expect(ctx.fillText.mock.calls[2]).toEqual(['25.00%', 200, 305]); // width/2, height/2 + top + 55
      
        expect(ctx.restore).toHaveBeenCalled();
      });
  
      test('renders other assets label when threshold is exceeded', () => {
        hoverLabelInformation.selectedDatasetIndex.current = 0;
        hoverLabelInformation.selectedIndex.current = 2; // Index >= tresholdValue
      
        renderHoverLabel(chart, hoverLabelInformation);
      
        // Verify context properties are set correctly
        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.font).toBe('lighter 1rem  sans-serif');
        expect(ctx.fillStyle).toBe('#000000');
        expect(ctx.textAlign).toBe('center');
        expect(ctx.textBaseline).toBe('middle');
      
        // Verify first fillText call for other assets value
        expect(ctx.fillText.mock.calls[0]).toEqual(['$1,000.00', 200, 260]); // width/2, height/2 + top + 10
      
        // Verify font change and second fillText call for "Other Assets"
        expect(ctx.font).toBe('lighter 1rem  sans-serif');
        expect(ctx.fillText.mock.calls[1]).toEqual(['Other Assets', 200, 285]); // width/2, height/2 + top + 35
      
        // Verify font change and third fillText call for distribution
        expect(ctx.font).toBe('lighter 1rem  sans-serif');
        expect(ctx.fillText.mock.calls[2]).toEqual(['5.00%', 200, 305]); // width/2, height/2 + top + 55
      
        expect(ctx.restore).toHaveBeenCalled();
      });
  
    test('handles non-NFT asset correctly when selected', () => {
      hoverLabelInformation.selectedDatasetIndex.current = 0;
      hoverLabelInformation.selectedIndex.current = 1; // Select second asset (stock)
  
      renderHoverLabel(chart, hoverLabelInformation);
  
      // Verify text for selected non-NFT asset
      expect(ctx.fillText).toHaveBeenCalledWith('$3,000.00', 200, 260); 
      expect(ctx.font).toBe('lighter 1rem  sans-serif');
      expect(ctx.fillText).toHaveBeenCalledWith('Stock Asset', 200, 285); 
      expect(ctx.font).toBe('lighter 1rem  sans-serif');
      expect(ctx.fillText).toHaveBeenCalledWith('15.00%', 200, 305); 
  
      expect(ctx.restore).toHaveBeenCalled();
    });
  });