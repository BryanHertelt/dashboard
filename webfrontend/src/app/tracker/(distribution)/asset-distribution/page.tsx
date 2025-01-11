import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import AssetDistributionComponent from "../_components/ADcomp";
import { StructureLayer } from "@/api/layer";

const AssetDistribution = async () => {
  const responses = await Promise.allSettled([
    StructureLayer.fetchDistributionUnits("portfolios", `portfolioid=1`),
    StructureLayer.fetchDistributionUnits("assets", `assettype=cryptocurrency`),
  ]);
  const portfolioResponse =
    responses[0].status == "fulfilled" ? responses[0].value : ["failed"];
  const assetResponse =
    responses[1].status == "fulfilled" ? responses[1].value : ["failed"];

  if (assetResponse.length === 0) {
    return <FirstLogin />;
  }

  if (portfolioResponse.length === 0) {
    //Add logging here
    return (
      <div> We are sorry, but there have to be an internal server error. </div>
    );
  }

  return (
    <AssetDistributionComponent
      portfolioResponse={portfolioResponse}
      assetResponse={assetResponse}
    />
  );
};
export default AssetDistribution;
