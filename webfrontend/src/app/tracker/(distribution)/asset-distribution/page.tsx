import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import AssetDistributionComponent from "@/utility/lib/page-components/asset-distribution-comp";
import { getDistribution } from "@/utility/lib/data-fetching/layer";

const AssetDistribution = async () => {
  const [assetDistributionResponse] = await Promise.all([
    await getDistribution("all"),
  ]);
  if (assetDistributionResponse === "failed") {
    return <p> We will be right back for you!</p>;
  } else if (assetDistributionResponse.assets.length === 0) {
    return <FirstLogin />;
  }

  return (
    <AssetDistributionComponent portfolioData={assetDistributionResponse} />
  );
};
export default AssetDistribution;
