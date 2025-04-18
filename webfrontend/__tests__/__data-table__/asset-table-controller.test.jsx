import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable } from '../../src/utility/lib/design-components/datatables/table-layout/data-table';
import AssetTableController from '../../src/utility/lib/build-components/asset-table-controller';
import { formatDataColsCurrency, formatDataColsDerivative, formatDataColsNft } from '../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols';
import {LoadingSkeleton}  from '../../src/utility/lib/datafetching/loading-skeleton';
import '@testing-library/jest-dom';

jest.mock('../../src/utility/lib/design-components/datatables/table-layout/data-table', () => ({
 DataTable: jest.fn().mockImplementation(({ data}) => <div data-testid="data-table">DataTable with {data.length} rows</div>)
}));

jest.mock('../../src/utility/lib/datafetching/loading-skeleton', () => ({
  LoadingSkeleton: jest.fn().mockImplementation(() => <div data-testid="loading-skeleton">Loading...</div>,)
}));

jest.mock("../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols", () => ({
    formatDataColsCurrency: jest.fn().mockImplementation(() => [
      {
        accessorKey: "assettype",
        header: "cryptocurrency",
      },
    ]),
    formatDataColsDerivative: jest.fn().mockImplementation(() => [
      {
        accessorKey: "assettype",
        header: "derivative",
      },
    ]),
    formatDataColsNft: jest.fn().mockImplementation(() => [
      {
        accessorKey: "assettype",
        header: "nft",
      },
    ]),
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
      columns: formatDataColsCurrency,
    },
    {
      status: 'nft',
      statusTitle: 'NFTs',
      columns: formatDataColsNft,
    },
    {
      status: 'derivative',
      statusTitle: 'Derivatives',
      columns: formatDataColsDerivative,
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
  afterEach(()=> jest.clearAllMocks())
  it('renders only cryptocurrency assets when tableStatus is "cryptocurrency"', () => {
    render(
      <AssetTableController
        tableStatus="cryptocurrency"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: true }}
      />
    );
    expect(DataTable).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.arrayContaining([expect.objectContaining({header: "cryptocurrency"})]), 
      data: expect.arrayContaining([expect.objectContaining({assettype: "cryptocurrency"})])
    }), {}
    )
  });

  it('renders only nft assets when tableStatus is "nft"', () => {
    render(
      <AssetTableController
        tableStatus="nft"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: true }}
      />
    );
    expect(DataTable).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.arrayContaining([expect.objectContaining({header: "nft"})]), 
      data: expect.arrayContaining([expect.objectContaining({assettype: "nft"})])
    }), {}
    )
  });

  it('renders all derivative assets when both perp and future filters are true', () => {
    render(
      <AssetTableController
        tableStatus="derivative"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: true }}
      />
    );
    expect(DataTable).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.arrayContaining([expect.objectContaining({header: "derivative"})]), 
      data: expect.arrayContaining([expect.objectContaining({assettype: "derivative"})])
    }), {}
    )

    expect(screen.getByTestId('data-table')).toHaveTextContent('2 rows');
  });

  it('renders only perpetual derivatives when only perp is true', () => {
    render(
      <AssetTableController
        tableStatus="derivative"
        tableConfig={tableConfig}
        filterType={{ perp: false, future: true }}
      />
    );
    expect(DataTable).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.arrayContaining([expect.objectContaining({header: "derivative"})]), 
      data: expect.arrayContaining([expect.objectContaining({assettype: "derivative", derivativetype:"future"})])
    }), {}
    )

    expect(screen.getByTestId('data-table')).toHaveTextContent('1 rows');
  });

  it('renders only future derivatives when only future is true', () => {
    render(
      <AssetTableController
        tableStatus="derivative"
        tableConfig={tableConfig}
        filterType={{ perp: true, future: false }}
      />
    );
    expect(DataTable).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.arrayContaining([expect.objectContaining({header: "derivative"})]), 
      data: expect.arrayContaining([expect.objectContaining({assettype: "derivative", derivativetype:"perpetual"})])
    }), {}
    )

    expect(screen.getByTestId('data-table')).toHaveTextContent('1 rows');
  });
});
