import AssetDistributionComponent from "../_components/ADcomp";
import { StructureLayer } from "@/api/layer";

const AssetDistribution = async () => {
  try {
    const [portfolioResponse, assetResponse] = await Promise.allSettled([
      StructureLayer.fetchDistributionUnits("portfolios", `portfolioid=1`),
      StructureLayer.fetchDistributionUnits(
        "assets",
        `assettype=cryptocurrency`
      ),
    ]);
    if (portfolioResponse.status == "rejected") {
      throw new Error(`Portoflio Response failed: ${portfolioResponse.status}`);
    } else if (assetResponse.status == "rejected") {
      throw new Error(`Asset Response failed: ${assetResponse.status}`);
    }

    return (
      <AssetDistributionComponent
        portfolioResponse={portfolioResponse}
        assetResponse={assetResponse}
      />
    );
  } catch (error) {
    console.error(error);
  }
};
export default AssetDistribution;
