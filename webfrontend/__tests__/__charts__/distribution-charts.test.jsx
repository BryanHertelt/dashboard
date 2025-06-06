import {DistributionChart} from "../../src/utility/lib/charts/distribution-chart"
import { Chart } from "chart.js"
import { ranHexGen } from "../../src/utility/lib/helpers"
import { drawDoughnutChart } from "../../src/utility/lib/charts/drawDoughnutChart"
import { renderHoverLabel } from "../../src/utility/lib/charts/renderHoverLabel"
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching"
import { render } from "@testing-library/react"
import { Doughnut } from "react-chartjs-2"
import { mockInitial } from "../testmocks"



jest.mock("react-chartjs-2",() => ({
    Doughnut: jest.fn().mockImplementation(()=> <p> Doughnut Chart</p>)
}) )

jest.mock("../../src/utility/lib/data-fetching", () => ({
    SmallErrorSkeleton: jest.fn().mockImplementation(()=> <p> SmallErrorSkeleton</p>)
}))

jest.mock("../../src/utility/lib/charts/renderHoverLabel", () => ({
 renderHoverLabel: jest.fn().mockImplementation(() => null)
}))
jest.mock("../../src/utility/lib/charts/drawDoughnutChart", () => ({
    drawDoughnutChart: jest.fn().mockImplementation(()=> null) 
}))


describe("Distribution Component", () => {
    beforeEach(() => jest.clearAllMocks())

    const setUpTest = (total, assetData, full, tresholdValue) => {
        const mockData = {
            total: total,
            assetData: assetData
        }
        render(<DistributionChart pieData={mockData} full={full} tresholdValue={tresholdValue} />)
    }


    it("calls doughnut correctly", () => {
        setUpTest(1000, mockInitial, false, 10)
        expect(Doughnut).toHaveBeenCalled()
        expect(Doughnut).toHaveBeenCalledTimes(1)
    }) 
    it("handles empty data", () => {
       setUpTest(1000, [], false, 10)
       expect(SmallErrorSkeleton).toHaveBeenCalled()
       expect(SmallErrorSkeleton).toHaveBeenCalledTimes(1)
    })
    it("correctly sets treshold", () => {
        setUpTest(1000, mockInitial, false, 2)
        const mockCalls = Doughnut.mock.calls[0][0]
        const dataLength = mockCalls.data.datasets[0].data.length
        const otherColors = mockCalls.data.datasets[0].backgroundColor[2]
        const mainColors = mockCalls.data.datasets[0].backgroundColor[0]

        expect(otherColors).toEqual("#7A7A7A")
        expect(mainColors).toEqual("#cceeff")
        expect(dataLength).toBe(3)
    })
    it("correctly handles treshold edge cases", () => {
        setUpTest(1000, mockInitial, false, 0)
        const mockCalls = Doughnut.mock.calls[0][0]
        expect(mockCalls.data.datasets[0].data.length).toBe(1)
        expect(mockCalls.data.datasets[0].backgroundColor).toEqual(["#7A7A7A"])
    })
    it("correctly applies full range", () => {
        setUpTest(1000, mockInitial, true, 3)
        const realFormat = [Doughnut.mock.calls[0][0].options.circumference,Doughnut.mock.calls[0][0].options.rotation]
        const expectedFormat = [360, 0]

        expect(realFormat).toEqual(expectedFormat)
    })
})