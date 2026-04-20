import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import AssetDistribution from "../../src/app/tracker/(distribution)/asset-distribution/page";
import { getDistribution } from "../../src/utility/lib/data-fetching/layer";
import AssetDistributionComponent from "../../src/utility/lib/page-components/asset-distribution-comp";
import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";

const mockPortfolioData = {
  assets: [
    {
      assetid: 1,
      assetname: "Bitcoin",
      assettype: "cryptocurrency",
      assetabbreviation: "BTC",
      assetamount: 10,
      assetvalue: 890000,
    },
  ],
  portfolios: [
    {
      portfolioid: 1,
      name: "Portfolio 1",
      currentvalue: 102000,
    },
  ],
};

jest.mock("../../src/utility/lib/data-fetching/layer", () => ({
  getDistribution: jest.fn(),
}));

jest.mock("../../src/utility/lib/page-components/asset-distribution-comp", () => {
  return jest.fn(() => <div>Mocked AssetDistributionComponent</div>);
});

describe("AssetDistribution", () => {
  beforeEach(() => {
    getDistribution.mockClear();
    AssetDistributionComponent.mockClear();
  });

  it("calls getDistribution with 'all'", async () => {
    getDistribution.mockResolvedValue(mockPortfolioData);

    const el = await AssetDistribution();
    render(el);

    expect(getDistribution).toHaveBeenCalledWith("all");
  });

  it("passes portfolioData to AssetDistributionComponent", async () => {
    getDistribution.mockResolvedValue(mockPortfolioData);

    const el = await AssetDistribution();
    render(el);

    expect(AssetDistributionComponent).toHaveBeenCalledWith(
      { portfolioData: mockPortfolioData },
      {}
    );
  });

  it("renders error page when fetch fails", async () => {
    getDistribution.mockResolvedValue(["failed", new Error("Network error")]);

    const el = await AssetDistribution();
    render(el);

    expect(screen.getByText(/We will be right back for you!/i)).toBeInTheDocument();
  });

  it("renders FirstLogin when assets array is empty", async () => {
    getDistribution.mockResolvedValue({ assets: [] });

    const el = await AssetDistribution();
    render(el);

    expect(await screen.findByRole("heading", { name: /Add your first holding/i })).toBeInTheDocument();
  });

  it("renders AssetDistributionComponent on success", async () => {
    getDistribution.mockResolvedValue(mockPortfolioData);

    const el = await AssetDistribution();
    render(el);

    expect(screen.getByText("Mocked AssetDistributionComponent")).toBeInTheDocument();
  });
});
