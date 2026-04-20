import React from "react";
import '@testing-library/jest-dom';
import { render, fireEvent, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataTable } from "../../src/utility/lib/data-table/data-table";

// --- Spy-able Mocks ---
const mockPrefetch = jest.fn();
jest.mock("../../src/utility/lib/data-fetching/prefetch-hooks", () => ({
  prefetchDetailComponent: (...args) => mockPrefetch(...args),
}));

jest.mock("../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent", () => ({
  TableDetailComponent: () => <div data-testid="mock-detail">Mock Detail Component</div>,
}));

jest.mock("../../public/images/icons", () => ({
  ShowDetailIcon: () => <div data-testid="mock-showicon"> Mock Show Detail Icon </div>
}))

jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
  SmallErrorSkeleton: () => <div>Mock Error Skeleton</div>,
}));

jest.mock("../../public/images/icons", () => ({
  ShowDetailIcon: jest.fn(({ rowId }) => (
    <button data-testid={`toggle-${rowId}`}>+</button>
  ))
}));

// --- Test Setup ---
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

const renderWithClient = (ui) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

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

describe("DataTable: Interaction & Prefetching", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders with data correctly", () => {
    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        detail={true}
        tableStatus="cryptocurrency"
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    );
    expect(screen.getByRole("columnheader", { name: /asset/i })).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  });

  it("shows detail component when a row is expanded", () => {
    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        detail={true}
        tableStatus="cryptocurrency"
        expandedRow={0} // Row index 0 is expanded
        setExpandedRow={() => {}}
      />
    );
    
    expect(screen.getByTestId("mock-detail")).toBeInTheDocument();
  });

  it("toggles expanded state via the toggle button", () => {
    const setExpandedRow = jest.fn();

    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        detail={true}
        tableStatus="cryptocurrency"
        expandedRow={null}
        setExpandedRow={setExpandedRow}
      />
    );

    // Find button within the specific row to avoid Node access
    const row = screen.getByRole("row", { name: /bitcoin/i });
    const toggleButton = within(row).getByRole("button");
    
    fireEvent.click(toggleButton);

    expect(setExpandedRow).toHaveBeenCalledWith(expect.any(Function));

    // Logic test for the toggle function
    const updateFn = setExpandedRow.mock.calls[0][0];
    expect(updateFn(null)).toBe(0); // Open
    expect(updateFn(0)).toBe(null); // Close
  });

  it("calls prefetchDetailComponent on row hover (mouseEnter)", () => {
    renderWithClient(
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        detail={true}
        tableStatus="cryptocurrency"
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    );

    const row = screen.getByRole("row", { name: /bitcoin/i });
    const toggleButton = within(row).getByTestId("toggle-0");
    fireEvent.mouseEnter(toggleButton.closest("td"));

    expect(mockPrefetch).toHaveBeenCalledWith(
      "cryptocurrency",
      "btc-id",
      expect.any(Object)
    );
  });

  it("renders error skeleton when dataset is empty", () => {
    renderWithClient(
      <DataTable data={[]} columns={columns} currentValue={1} tableStatus="cryptocurrency" />
    );
    expect(screen.getByText("Mock Error Skeleton")).toBeInTheDocument();
  });
});