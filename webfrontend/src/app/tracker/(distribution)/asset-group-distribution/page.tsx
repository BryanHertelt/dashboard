import AssetGroupDistributionComponent from "@/utility/lib/page-components/asset-group-distribution-comp";
import FirstLogin from "@/utility/lib/trackerlayout/firstlogin";
import { getDistribution } from "@/utility/lib/data-fetching";

const AssetGroupDistribution = async () => {
  const [assetGroupDistributionResponse] = await Promise.all([
    await getDistribution("group"),
  ]);
  if (assetGroupDistributionResponse === "failed") {
    return <p> We will be right back for you!</p>;
  } else if (assetGroupDistributionResponse.groups.length === 0) {
    return <FirstLogin />;
  }

  return (
    <AssetGroupDistributionComponent
      groupData={assetGroupDistributionResponse}
    />
  );
};

export default AssetGroupDistribution;
