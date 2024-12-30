import AssetDistributionComponent from "../_components/ADcomp";
import { StructureLayer } from "@/api/layer";

const AssetDistribution = async () => {
  let calls = 0;
  try {
    const responses = await Promise.allSettled([
      StructureLayer.fetchDistributionUnits("portfolios", `portfolioid=1`),
      StructureLayer.fetchDistributionUnits(
        "assets",
        `assettype=cryptocurrency`
      ),
    ]);
    const portfolioResponse =
      responses[0].status == "fulfilled" ? responses[0].value : [];
    const assetResponse =
      responses[1].status == "fulfilled" ? responses[1].value : [];

    if (responses[0].status == "rejected") {
      console.error(`Portfolio fetch failed: ${responses[0].reason}`);
    }
    if (responses[1].status == "rejected") {
      console.error(`Asset fetch failed: ${responses[1].reason}`);
    }

    return (
      <AssetDistributionComponent
        portfolioResponse={portfolioResponse}
        assetResponse={assetResponse}
      />
    );
  } catch (error) {
    console.error(`Error in AssetDistribution: ${error}`); // Add logging here
    return <div> Something went wrong. </div>;
  }
};
export default AssetDistribution;
