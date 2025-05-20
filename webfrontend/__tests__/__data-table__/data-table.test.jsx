import React from "react";
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { prefetchDetailComponent } from "../../src/utility/lib/data-fetching/prefetch-hooks";
import { TableDetailComponent } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent";
import { DataTable } from "../../src/utility/lib/data-table/data-table";
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching/skeletons/error-skeleton";

// Spy-able mock for prefetchDetailComponent
const mockPrefetch = jest.fn();
jest.mock("../../src/utility/lib/data-fetching/prefetch-hooks", () => ({
  prefetchDetailComponent: (...args) => mockPrefetch(...args),
}));


jest.mock( "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent", () => ({
  TableDetailComponent: () => <div test-id="mock-detail">Mock Detail Component</div>,
}));
jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
  SmallErrorSkeleton: () => <div>Mock Error Skeleton</div>,
}));

jest.mock("../../public/images/icons", () => ({
  ShowDetailIcon: ({ rowId }) => <button data-testid={`toggle-${rowId}`}>+</button>,
}));

const queryClient = new QueryClient();
const renderWithClient = (ui) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);


describe("DataTable unit tests (with interaction)", () => {
  const columns = [
    {
      header: "Asset",
      accessorKey: "assetname",
      cell: ({ getValue }) => <span>{getValue()}</span>,
    },
  ];

  const data = [
    {
      id: 1,
      assetname: "Bitcoin",
      assetid: "btc-id",
      assettype: "cryptocurrency",
      assetabbreviation: "BTC",
      symbol: "btc-symbol",
    },
  ];

  it("renders with data", () => {
    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        tableStatus="cryptocurrency"
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    );
    expect(screen.getByText("Asset")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  });

  it("renders error skeleton when data is empty", () => {
    renderWithClient(
      <DataTable data={[]} columns={columns} currentValue={1} tableStatus="cryptocurrency" />
    );
    expect(screen.getByText("Mock Error Skeleton")).toBeInTheDocument();
  });

  it("shows detail component when row is expanded", () => {
    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        tableStatus="cryptocurrency"
        expandedRow={0}
        setExpandedRow={() => {}}
      />
    );
    expect(screen.getByText("Mock Detail Component")).toBeInTheDocument();
  });

  it("toggles expanded row on icon click", () => {
    const setExpandedRow = jest.fn();

    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        tableStatus="cryptocurrency"
        expandedRow={null}
        setExpandedRow={setExpandedRow}
      />
    );

    const toggleButton = screen.getByTestId("toggle-0");
    fireEvent.click(toggleButton);

    expect(setExpandedRow).toHaveBeenCalledWith(expect.any(Function));

    // simulate function call to ensure toggle logic
    const updateFn = setExpandedRow.mock.calls[0][0];
    const result1 = updateFn(null); // first click
    const result2 = updateFn(0);    // second click (should collapse)

    expect(result1).toBe(0);
    expect(result2).toBe(null);
  });
});

describe("DataTable prefetch behavior", () => {
  const columns = [
    {
      header: "Asset",
      accessorKey: "assetname",
      cell: ({ getValue }) => <span>{getValue()}</span>,
    },
  ];

  const data = [
    {
      id: 1,
      assetname: "Bitcoin",
      assetid: "btc-id",
      assettype: "cryptocurrency",
      assetabbreviation: "BTC",
      symbol: "btc-symbol",
    },
  ];

  it("calls prefetchDetailComponent on hover", () => {
    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        tableStatus="cryptocurrency"
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    );

    const toggleCell = screen.getByTestId("toggle-0").parentElement;

    fireEvent.mouseEnter(toggleCell);

    expect(mockPrefetch).toHaveBeenCalledWith(
      "cryptocurrency",
      "btc-id",
      expect.any(Object) // QueryClient instance
    );
  });
});
