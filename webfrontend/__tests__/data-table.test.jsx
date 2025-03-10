import '@testing-library/jest-dom'
import { DataTable } from "../src/utility/lib/design-components/datatables/table-layout/data-table"
import { TableDetailComponent } from "../src/utility/lib/design-components/datatables/table-layout/data-datatable-detail-popup"
import { render, screen } from "@testing-library/react"
import { ErrorSkeleton } from '../src/utility/lib/datafetching/loading-skeleton'

jest.mock("../src/utility/lib/datafetching/loading-skeleton", () => ({
    ErrorSkeleton: jest.fn().mockImplementation(()=> null), 
}))


jest.mock("../src/utility/lib/design-components/datatables/table-layout/data-datatable-detail-popup", () => ({
    TableDetailComponent: jest.fn().mockImplementation(()=> null), 
    }))

const mockData = [
        { id: 1, name: "Alice" , assetid: 3},
        { id: 2, name: "Bob", assetid: 2, assetabbreviation:"BTC" , symbol: "someUrl" },
        { id: 3, name: "Charlie", assetid: 1},
      ];
const mockColumns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <button variant="ghost" onClick={() => column.toggleSorting(isSorted === "asc")}>
            Name
            {isSorted === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> : null}
          </button>
        );
      },
    },
  ];



describe("data-table initial render", () => {

beforeEach(()=> {
    jest.clearAllMocks()
    render(<DataTable data={mockData} columns={mockColumns}/> )
})
afterEach(()=> jest.clearAllMocks())
it("does not change UI unexpected", () => {
  const  {container} = render(<DataTable data={mockData} columns={mockColumns}/> )
    expect(container).toMatchSnapshot()
})
it("renders cols as expected", () => {
expect(screen.getByText("Name")).toBeInTheDocument()
expect(screen.getByText("Alice")).toBeInTheDocument()
})
it("does not call detailcomponent", () => {
    expect(TableDetailComponent).not.toHaveBeenCalled()
})
})

describe("datatable detailcomponent relation", () => { 
  beforeEach(()=> {
    jest.clearAllMocks()
    render(<DataTable data={mockData} columns={mockColumns} expandedRow={1} tableStatus='cryptocurrency' /> )
  })
 afterEach(()=> {
    jest.clearAllMocks()
 })

 it("calls detailcomponent, when expanded Row is not null", () => {
    expect(TableDetailComponent).toHaveBeenCalledTimes(1)
    expect(TableDetailComponent).toHaveBeenCalledWith(expect.objectContaining
        ({"assetId": 2, "assetName": "BTC", "assetUrl": "someUrl", "tableStatus": "cryptocurrency"}),
        expect.any(Object))
 } )
})

describe("returns null, when tableStatus is not given", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
        render(<DataTable data={mockData} columns={mockColumns} expandedRow={1} tableStatus='' />)
    })
    afterEach(()=> jest.clearAllMocks())

    it("", () => {
        expect(TableDetailComponent).not.toHaveBeenCalled()
    })
})

describe("returns no result if no tabledata is given", () => {
    beforeEach(()=> {
        jest.clearAllMocks() 
        render(<DataTable data={{}} columns={[]} expandedRow={1} tableStatus=''/>)
    })

    it("renders error skeleton", () => {
        expect(ErrorSkeleton).toHaveBeenCalledTimes(1)
    })
})

