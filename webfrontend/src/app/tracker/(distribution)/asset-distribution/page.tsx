import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import AssetDistributionComponent from "@/utility/lib/page-components/asset-distribution-comp";
import { StructureLayer } from "@/utility/lib/datafetching/layer";

const AssetDistribution = async () => {
  const assetDistributionResponse = await StructureLayer.getPortfolioData();

  if (assetDistributionResponse.status === "failed") {
    return (
      <p>{assetDistributionResponse.errorMsg} We will be right back for you!</p>
    );
  } else if (assetDistributionResponse.assets.length === 0) {
    return <FirstLogin />;
  }

  return (
    <AssetDistributionComponent portfolioData={assetDistributionResponse} />
  );
};
export default AssetDistribution;
