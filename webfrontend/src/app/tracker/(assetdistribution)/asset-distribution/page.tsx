import {
  AssetValueComponent,
  AssetDistributionComponent,
  AssetDistributionDetailComponent,
} from "@/lib/distribution/asset-distributionpagecomponents";

const AssetDistribution = () => {
  return (
    <>
      <div className="h-4/6 bg-white rounded-md shadow-even w-8/12 flex-grow pl-7 py-7 pr-8">
        <AssetValueComponent />
      </div>
      <div className=" bg-white p-7 h-4/6 ml-7 w-3/12 rounded-md shadow-even">
        <AssetDistributionComponent />
      </div>
      <div className="bg-white shadow-even mt-9 p-7 w-full">
        <AssetDistributionDetailComponent />
      </div>
    </>
  );
};

export default AssetDistribution;
