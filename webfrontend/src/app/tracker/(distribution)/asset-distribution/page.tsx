import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import AssetDistributionComponent from "@/utility/lib/page-components/asset-distribution-comp";
import { getPortfolioData } from "@/utility/lib/datafetching/layer";

const AssetDistribution = async () => {
  const assetDistributionResponse = await getPortfolioData();

  if (assetDistributionResponse[0] === "failed") {
    return <p> We will be right back for you!</p>;
  } else if (assetDistributionResponse.assets.length === 0) {
    return <FirstLogin />;
  }

  return (
    <AssetDistributionComponent portfolioData={assetDistributionResponse} />
  );
};
export default AssetDistribution;
