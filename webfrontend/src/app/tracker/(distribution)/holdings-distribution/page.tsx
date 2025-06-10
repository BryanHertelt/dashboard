import HoldingDistributionComponent from "@/utility/lib/page-components/holding-distribution-comp";
import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import { getAllAssetGroups } from "@/utility/lib/data-fetching/layer";
import { getDistribution } from "@/utility/lib/data-fetching";

const HoldingsDistribution = async () => {
  const [holdingDistributionResponse] = await Promise.all([
    await getDistribution("holding"),
  ]);
  if (holdingDistributionResponse === "failed") {
    return <p> We will be right back for you!</p>;
  } else if (holdingDistributionResponse.holdings.length === 0) {
    return <FirstLogin />;
  }

  return (
    <HoldingDistributionComponent holdingData={holdingDistributionResponse} />
  );
};

export default HoldingsDistribution;
