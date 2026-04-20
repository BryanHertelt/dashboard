import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DrDetail, DisDetail } from "../../src/utility/lib/data-table/table-detail-components/v-ad-assets-detail-components";
import { RebalancingSetUp } from '../../src/utility/lib/helpers/helper-components/rebalancing-set-up';
import { StopLossCards } from '../../src/utility/lib/helpers/helper-components/detail-table-comps';
import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../src/utility/lib/helpers/helper-functions/formatCurrency';
import { cryptoMockDetail, derivativeMockDetail, nftMockDetail } from "../testmocks";

// --- Spying Mocks ---
jest.mock('../../src/utility/lib/helpers/helper-components/detail-table-comps', () => ({
    DetailNfts: jest.fn(() => <div data-testid="detail-nfts">Expose NFTs</div>), 
    InfoCards: jest.fn(() => <div data-testid="info-cards">Info Cards</div>), 
    StopLossCards: jest.fn(() => <div data-testid="stop-loss">Stop Loss Cards</div>)
}));

jest.mock("react-chartjs-2", () => ({
    Bar: jest.fn(() => <div data-testid="bar-chart">Bar Chart</div>) 
}));

jest.mock("../../src/utility/lib/helpers/helper-components/rebalancing-set-up", () => ({
    RebalancingSetUp: jest.fn(() => <div>Rebalancing Set up</div>)
}));

jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
    SmallErrorSkeleton: jest.fn(() => <div>Error occurred</div>)
}));

describe("DisDetail Component", () => {
    const originalInnerWidth = window.innerWidth;
    const defaultProps = {
        detailData: cryptoMockDetail.assetgroups, 
        tableStatus: "cryptocurrency", 
        totalAmount: 300, 
        assetname: "BTC", 
        changeActiveDisObj: jest.fn(), 
        activeDisObj: null, 
        sltp: undefined
    };

    const setWidth = (width) => {
        window.innerWidth = width;
        window.dispatchEvent(new Event('resize'));
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        window.innerWidth = originalInnerWidth;
    });

    it("renders Bar chart with 'Others' bucket when data exceeds threshold", () => {
        setWidth(1200);
        render(<DisDetail {...defaultProps} />);
        
        expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
        
        const callArg = Bar.mock.calls[0][0];
        const othersDataset = callArg.data.datasets.find(ds => ds.label === "Others");
        
        expect(othersDataset.data).toEqual([expect.any(Number)]);
        expect(callArg.data.datasets.length).toBe(15);
    });

    it("limits dataset to 10 when screen width is below 1100px", () => {
        setWidth(1000);
        render(<DisDetail {...defaultProps} />);
        
        const callArg = Bar.mock.calls[0][0];
        expect(callArg.data.datasets.length).toBe(10);
    });

    it("does not create an 'Others' bucket if data length is below threshold", () => {
        setWidth(1200);
        // Using slice() instead of splice() to avoid mutating original mock
        const shortData = cryptoMockDetail.assetgroups.slice(0, 5);
        
        render(<DisDetail {...defaultProps} detailData={shortData} />);
        
        const callArg = Bar.mock.calls[0][0];
        const othersDataset = callArg.data.datasets.find(ds => ds.label === "Others");
        expect(othersDataset).toBeUndefined();
    });

    it("renders StopLossCards only for derivative status", () => {
        render(<DisDetail 
            {...defaultProps} 
            tableStatus="derivative" 
            detailData={derivativeMockDetail.holdings}
            sltp={derivativeMockDetail.sltp}
        />);
        
        expect(StopLossCards).toHaveBeenCalled();
    });

    it("renders DetailNfts when an NFT object is active", () => {
        render(<DisDetail 
            {...defaultProps} 
            tableStatus="nft" 
            detailData={nftMockDetail.assetgroups}
            activeDisObj={1} 
        />);
        
        expect(screen.getByTestId("detail-nfts")).toBeInTheDocument();
    });

    it("shows ErrorSkeleton when data is empty", () => {
        render(<DisDetail {...defaultProps} detailData={[]} />);
        expect(screen.getByText(/Error occurred/i)).toBeInTheDocument();
    });
});

describe("DrDetail Component", () => {
    const defaultProps = {
        data: cryptoMockDetail,
        currentValue: 265550
    };

    beforeEach(() => jest.clearAllMocks());

    it("displays correct financial labels and formatted values", () => {
        render(<DrDetail {...defaultProps} />);

        const expectedLabels = ["Average Entry Price", "Market Price", "Average Exit Price", "Total Cost"];
        expectedLabels.forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        // Verify specific formatted values are present
        expect(screen.getByText(formatCurrency(cryptoMockDetail.marketprice))).toBeInTheDocument();
    });

    it("passes correct calculation data to RebalancingSetUp", () => {
        render(<DrDetail {...defaultProps} />);
        
        expect(RebalancingSetUp).toHaveBeenCalledWith(
            expect.objectContaining({
                assetId: 1,
                currentValue: 265550,
                data: expect.objectContaining({
                    currentbalance: 63.31,
                    desiredbalance: 36.69
                })
            }),
            expect.any(Object)
        );
    });
});