import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable } from '../../src/utility/lib/data-table/data-table';
import { AssetTableController, dataColsGroups } from '../../src/utility/lib/data-table';
import {
  dataColsCurrency,
  dataColsDerivative,
  dataColsNft,
  dataColsGroup
} from '../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols';
import { SmallLoadingSkeleton } from '../../src/utility/lib/data-fetching/skeletons/loading-skeleton';
import '@testing-library/jest-dom';

jest.mock("../../src/utility/lib/data-table/data-table", () => ({
  DataTable: jest.fn().mockImplementation(({ data }) => (
    <div data-testid="data-table">DataTable with {data.length} rows</div>
  )),
}));

jest.mock('../../src/utility/lib/data-fetching/skeletons/loading-skeleton', () => ({
  SmallLoadingSkeleton: jest.fn().mockImplementation(() => (
    <div data-testid="loading-skeleton">Loading...</div>
  )),
}));

const mockInitial = [
  { id: 1, assettype: 'cryptocurrency' },
  { id: 2, assettype: 'nft' },
  { id: 3, assettype: 'derivative', derivativetype: 'perpetual' },
  { id: 4, assettype: 'derivative', derivativetype: 'future' },
];

const tableConfig = {
  title: 'Assets',
  initial: mockInitial,
  detail: true,
  statusFilter: 'assettype',
  status: [
    {
      status: 'cryptocurrency',
      statusTitle: 'Currencies',
      columns: dataColsCurrency,
    },
    {
      status: 'nft',
      statusTitle: 'NFTs',
      columns: dataColsNft,
    },
    {
      status: 'derivative',
      statusTitle: 'Derivatives',
      columns: dataColsDerivative,
    },
  ],
  filter: [
    {
      filter: 'perp',
      filterTitle: 'Perpetual',
      filterStatus: 'derivative',
    },
    {
      filter: 'future',
      filterTitle: 'Future',
      filterStatus: 'derivative',
    },
  ],
  currentValue: 1000,
};

describe('AssetTableController', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders only cryptocurrency assets when tableStatus is "cryptocurrency"', () => {
    render(
      <AssetTableController
        tableStatus="cryptocurrency"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: true }}
      />
    );

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsCurrency,
        data: [{ id: 1, assettype: 'cryptocurrency' }],
      }),
      {}
    );
  });

  it('renders only nft assets when tableStatus is "nft"', () => {
    render(
      <AssetTableController
        tableStatus="nft"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: true }}
      />
    );

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsNft,
        data: [{ id: 2, assettype: 'nft' }],
      }),
      {}
    );
  });

  it('renders all derivative assets when both perp and future filters are true', () => {
    render(
      <AssetTableController
        tableStatus="derivative"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: true }}
      />
    );

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsDerivative,
        data: [
          { id: 3, assettype: 'derivative', derivativetype: 'perpetual' },
          { id: 4, assettype: 'derivative', derivativetype: 'future' },
        ],
      }),
      {}
    );

    expect(screen.getByTestId('data-table')).toHaveTextContent('2 rows');
  });

  it('renders only future derivatives when only future is true', () => {
    render(
      <AssetTableController
        tableStatus="derivative"
        tableConfig={tableConfig}
        filterType={{ perp: false, future: true }}
      />
    );

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsDerivative,
        data: [{ id: 4, assettype: 'derivative', derivativetype: 'future' }],
      }),
      {}
    );

    expect(screen.getByTestId('data-table')).toHaveTextContent('1 rows');
  });

  it('renders only perpetual derivatives when only perp is true', () => {
    render(
      <AssetTableController
        tableStatus="derivative"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: false }}
      />
    );

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: dataColsDerivative,
        data: [{ id: 3, assettype: 'derivative', derivativetype: 'perpetual' }],
      }),
      {}
    );

    expect(screen.getByTestId('data-table')).toHaveTextContent('1 rows');
  });
  it("renders full dataset, when no status filter applied", () => {
    jest.clearAllMocks()
    const newTableConfig = {
      ...tableConfig, 
      statusFilter: "", 
      detail: false, 
      status: [
        {
          status: 'groups',
          statusTitle: 'Asset-Groups',
          columns: dataColsGroups,
        }
      ], 
    filter: []
    }
    render(
      <AssetTableController 
      tableStatus="groups"
      tableConfig={newTableConfig}
      /> 
    )
    const mockLength = DataTable.mock.calls[0][0].data.length
    expect(mockLength).toBe(mockInitial.length)
  })
});
