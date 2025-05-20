
import '@testing-library/jest-dom'
import { DrDetail, DisDetail } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-detail-components";
import { formatCurrency } from '../../src/utility/lib/helpers/helper-functions/formatCurrency';
import { formatValue } from '../../src/utility/lib/helpers/helper-functions/formatValue';
import { render } from '@testing-library/react';
import { InfoCards, DetailNfts, StopLossCards } from '../../src/utility/lib/helpers/helper-components/detail-table-comps';
import { RebalancingSetUp } from '../../src/utility/lib/helpers/helper-components/rebalancing-set-up';
import { HoldingLogoImageContainer } from '../../src/utility/lib/helpers/helper-components/image-container';
import { Bar } from 'react-chartjs-2';
import { screen } from '@testing-library/react';
import { DerivativesIcon } from '../../public/images';
import { SmallErrorSkeleton } from '../../src/utility/lib/data-fetching/skeletons/error-skeleton';
import { cryptoMockDetail, derivativeMockDetail, nftMockDetail } from '../testmocks';

jest.mock('../../src/utility/lib/helpers/helper-components/detail-table-comps', () => ({
    DetailNfts: jest.fn().mockImplementation(() => <p> Expose NFTs </p>), 
    InfoCards: jest.fn().mockImplementation(()=> <p> Info Cards</p>), 
    StopLossCards: jest.fn().mockImplementation((derivativeMockDetail)=> <p>Stop Loss Cards </p>)
}))

jest.mock("react-chartjs-2", () => ({
    Bar: jest.fn().mockImplementation(() => <p> Bar Chart </p>) 
}))


jest.mock("../../src/utility/lib/helpers/helper-components/rebalancing-set-up", () => ({
    RebalancingSetUp: jest.fn().mockImplementation(()=> <p> Rebalancing Set up</p>)
}))

jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
    SmallErrorSkeleton: jest.fn().mockImplementation(() => <p> Error occured </p>)
}))



jest.mock("../../src/utility/lib/helpers/helper-components/image-container", () => ({
    HoldingLogoImageContainer: jest.fn().mockImplementation(() => <p> Holding Logo Image Container </p> )
}))



describe("DisDetail", () => {
    const originalInnerWidth = window.innerWidth
    const originalProps = {
        detailData: cryptoMockDetail.assetgroups, 
        tableStatus: "cryptocurrency", 
        totalAmount: 300, 
        assetname: "BTC", 
        changeActiveDisObj: () => null, 
        activeDisObj: null, 
        sltp: undefined
    }

    beforeEach(()=> {
        jest.clearAllMocks()
    })

    afterEach(()=> {
        window.innerWidth = originalInnerWidth
    })
        it("renders Bar with processed bar data", () => {
            window.innerWidth = 1200
            render(<DisDetail {...originalProps}/>)
            expect(Bar).toHaveBeenCalled()
            expect(screen.getByText("Bar Chart")).toBeInTheDocument()
            const callArg = Bar.mock.calls[0][0]
            const otherDataSet = callArg.data.datasets.find((dataset)=> dataset.label === "Others")
            expect(otherDataSet.data).toEqual([33.33333333333333])
            expect(callArg.data.datasets.length).toBe(15)
            expect(Bar).toHaveBeenCalledWith(callArg, {})
        })
        it("renders InfoCards with processed card data", () => {
            window.innerWidth = 1200
            render(<DisDetail {...originalProps}/>)
            expect(InfoCards).toHaveBeenCalled()
            expect(screen.getByText("Info Cards")).toBeInTheDocument()
            const callArg = InfoCards.mock.calls[0][0]
            const receivedIds = callArg.data.map(item => item.id)
            const expectedIds = [
                10000,
                10001,
                10004,
                10002,
                10005,
                10006,
                10003,
                93,
                90,
                92,
                256,
                222,
                220,
                21,
                undefined
              ];
              expect(receivedIds).toEqual(expectedIds)
            const receivedDistributionData = callArg.data.map(item => item.distribution)
            const expectedDistributionData = [
                 31.666666666666664,
                 30.333333333333336,
                 30,
                 29.333333333333332,
                 27.333333333333332,
                 26,
                 25,
                 24,
                 22.333333333333332,
                 18.333333333333332,
                 15,
                 15,
                 15,
                 15,
                 undefined,
            ]
            expect(receivedDistributionData).toEqual(expectedDistributionData)
        })
        it("not render Derivative and ExpandNFT", () => {
            window.innerWidth = 1200
            render(<DisDetail {...originalProps}/>)
            expect(StopLossCards).not.toHaveBeenCalled()
            expect(DetailNfts).not.toHaveBeenCalled()
        })
        it("correctly adapts width for bar chart", () => {
            window.innerWidth = 1099
            render(<DisDetail {...originalProps}/>)
            expect(Bar).toHaveBeenCalled()
            const callArg = Bar.mock.calls[0][0]
            expect(callArg.data.datasets.length).toBe(10)
        })

        it("does not split into others, when screen width is beneath 1100 and array.length is beneath 10", () => {
           const newMock = cryptoMockDetail.assetgroups.splice(0,10)
            window.innerWidth = 1099
            render(<DisDetail {...{...originalProps, detailData: newMock}} /> )
            const callArg = Bar.mock.calls[0][0]
            const otherDataSet = callArg.data.datasets.find((dataset)=> dataset.label === "Others")
            expect(otherDataSet).toBe(undefined)
        })
        it("does not split into others, when screen width is above 1100 and array.length is beneath 15", () => {
            const newMock = cryptoMockDetail.assetgroups.splice(0,14)
            window.innerWidth = 1200
            render((<DisDetail {...{...originalProps, detailData: newMock}} /> ))
            const callArg = Bar.mock.calls[0][0]
            const otherDataSet = callArg.data.datasets.find((dataset)=> dataset.label === "Others")
            expect(otherDataSet).toBe(undefined)
        })
        it("renders DerivativeDetail, if tableStatus === derivative", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: derivativeMockDetail.holdings, tableStatus: "derivative", sltp:derivativeMockDetail.sltp}} /> ))
            expect(StopLossCards).toHaveBeenCalled()
        })
        it("renders NFT Details, if tableStatus === nft ", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: nftMockDetail.assetgroups , tableStatus: "nft", activeDisObj: 1}} /> ))
            expect(DetailNfts).toHaveBeenCalled()

        })
        it("does not render NFT Detail, if no detail card is selected", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: nftMockDetail.assetgroups,  tableStatdus: "nft", activeDisObj: null}} /> ))
            expect(DetailNfts).not.toHaveBeenCalled()  
        })
        it("sorts using currencyvalue and not nft-amount", () => {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: nftMockDetail.assetgroups,  tableStatdus: "nft", activeDisObj: 1}} /> ))
            const callArg = InfoCards.mock.calls[0][0]
            const receivedIds = callArg.data.map(item => item.id)
            const expectedIds= [
                253,
                156,
                133
            ]
            const receivedFunc = callArg.changeActiveDisObj
            expect(receivedFunc).not.toBe(undefined)
            expect(receivedIds).toEqual(expectedIds)
        })
        it("handles empty detailData", ()=> {
            window.innerWidth = 1200 
            render((<DisDetail {...{...originalProps, detailData: [],  tableStatdus: "nft", activeDisObj: null}} /> ))
            expect(screen.getByText("Error occured")).toBeInTheDocument()
        }) 
        
})

describe("DrDetail", () => {

    beforeEach(()=> jest.clearAllMocks())
    afterEach(()=> jest.clearAllMocks())

    it("renders cardData as expected", () => {
        render(<DrDetail data={cryptoMockDetail} currentValue={265550} /> )

            expect(screen.getByText("Average Entry Price")).toBeInTheDocument()
            expect(screen.getByText("Market Price")).toBeInTheDocument()
            expect(screen.getByText("Average Exit Price")).toBeInTheDocument()
            expect(screen.getByText("Total Cost")).toBeInTheDocument()

    
          expect(screen.getByText(formatCurrency(cryptoMockDetail.averageentryprice)))
          expect(screen.getByText(formatCurrency(cryptoMockDetail.marketprice)))
          expect(screen.getByText(formatCurrency(cryptoMockDetail.averageexitprice)))
          expect(screen.getByText(formatCurrency(cryptoMockDetail.totalcost)))
    
    })

    it("calls Rebalancing Set Up with correct arguments", ()=> {
        render(<DrDetail data={cryptoMockDetail} currentValue={265550} /> )
        expect(RebalancingSetUp).toHaveBeenCalled()
        const callArg = RebalancingSetUp.mock.calls[0][0]
        const desiredArg = {"assetId": 1, "currentValue": 265550, "data": {"currentbalance": 63.31, "desiredbalance": 36.69}}
        expect(callArg).toEqual(desiredArg)
    })

})

