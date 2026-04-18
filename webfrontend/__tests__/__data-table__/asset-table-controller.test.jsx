import React from 'react';
import { render, screen } from '@testing-library/react';
import { AssetTableController } from '../../src/utility/lib/data-table';
import { DataTable } from '../../src/utility/lib/data-table/data-table';
import {
  dataColsCurrency,
  dataColsDerivative,
  dataColsNft,
  dataColsGroups
} from '../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols';
import '@testing-library/jest-dom';

// --- Mocks ---
jest.mock("../../src/utility/lib/data-table/data-table", () => ({
  DataTable: jest.fn(({ data }) => (
    <div data-testid="data-table">Rows: {data.length}</div>
  )),
}));

jest.mock('../../src/utility/lib/data-fetching/skeletons/loading-skeleton', () => ({
  SmallLoadingSkeleton: jest.fn(() => <div data-testid="loading-skeleton">Loading...</div>),
}));

// --- Test Data ---
const mockInitial = [
  { id: 1, assettype: 'cryptocurrency' },
  { id: 2, assettype: 'nft' },
  { id: 3, assettype: 'derivative', derivativetype: 'perpetual' },
  { id: 4, assettype: 'derivative', derivativetype: 'future' },
];

const tableConfig = {
  title: 'Assets',
  initial: mockInitial,
  statusFilter: 'assettype',
  status: [
    { status: 'cryptocurrency', statusTitle: 'Currencies', columns: dataColsCurrency },
    { status: 'nft', statusTitle: 'NFTs', columns: dataColsNft },
    { status: 'derivative', statusTitle: 'Derivatives', columns: dataColsDerivative },
  ],
  filter: [
    { filter: 'perp', filterStatus: 'derivative' },
    { filter: 'future', filterStatus: 'derivative' },
  ],
};

// --- Helper ---
const setup = (props = {}) => {
  const defaultProps = {
    tableStatus: "cryptocurrency",
    tableConfig: tableConfig,
    filterType: { perp: true, future: true }
  };
  return render(<AssetTableController {...defaultProps} {...props} />);
};

describe('AssetTableController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('filters data for "cryptocurrency" status correctly', () => {
    setup({ tableStatus: "cryptocurrency" });

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsCurrency,
        data: [mockInitial[0]],
      }),
      expect.any(Object)
    );
  });

  it('filters data for "nft" status correctly', () => {
    setup({ tableStatus: "nft" });

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsNft,
        data: [mockInitial[1]],
      }),
      expect.any(Object)
    );
  });

  describe('Derivative Filters', () => {
    it('shows all derivatives when both filters are active', () => {
      setup({ tableStatus: "derivative" });
      expect(screen.getByTestId('data-table')).toHaveTextContent('Rows: 2');
    });

    it('shows only futures when perp filter is inactive', () => {
      setup({ 
        tableStatus: "derivative", 
        filterType: { perp: false, future: true } 
      });

      expect(DataTable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [mockInitial[3]], // The future asset
        }),
        expect.any(Object)
      );
    });

    it('shows only perpetuals when future filter is inactive', () => {
      setup({ 
        tableStatus: "derivative", 
        filterType: { perp: true, future: false } 
      });

      expect(DataTable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [mockInitial[2]], // The perp asset
        }),
        expect.any(Object)
      );
    });
  });

  it("renders the full dataset when statusFilter is disabled (empty string)", () => {
    const noFilterConfig = {
      ...tableConfig,
      statusFilter: "",
      status: [{ status: 'groups', columns: dataColsGroups }]
    };

    setup({ tableStatus: "groups", tableConfig: noFilterConfig });

    const renderedData = DataTable.mock.calls[0][0].data;
    expect(renderedData).toHaveLength(mockInitial.length);
  });
});