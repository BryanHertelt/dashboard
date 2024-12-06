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
    if (
      portfolioResponse.status == "rejected" ||
      assetResponse.status == "rejected"
    ) {
      throw new Error(
        `Portoflio Response: ${portfolioResponse.status}, Asset Response: ${assetResponse.status}`
      );
    } else {
      return (
        <AssetDistributionComponent portfolioResponse={portfolioResponse} />
      );
    }
  } catch (error) {
    console.error(error);
    return <div> Error </div>;
  }
};
export default AssetDistribution;
