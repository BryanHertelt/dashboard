import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import AssetDistributionComponent from "@/utility/lib/page-components/asset-distribution-comp";
import {
  getPortfolioData,
  getTimeFrames,
} from "@/utility/lib/datafetching/layer";

const AssetDistribution = async () => {
  const [assetDistributionResponse, initialLineLoad] = await Promise.all([
    await getPortfolioData(),
    await getTimeFrames("7days"),
  ]);

  if (assetDistributionResponse === "failed") {
    return <p> We will be right back for you!</p>;
  } else if (assetDistributionResponse.assets.length === 0) {
    return <FirstLogin />;
  }

  return (
    <AssetDistributionComponent
      portfolioData={assetDistributionResponse}
      initialLineLoad={initialLineLoad}
    />
  );
};
export default AssetDistribution;
