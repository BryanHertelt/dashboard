import { Asset } from "../types/data-fetching-types";

export const formatPieData = (initialData: Asset[]) => {
  const assetsNameValuePair = initialData.map((assetobject) => {
    const name = assetobject.assetname;
    const distributionvalue = assetobject.assetpercentage;
    return { [name]: distributionvalue };
  });
  return {
    labels: assetsNameValuePair.map((assetpair) => Object.keys(assetpair)),
    datasets: [
      {
        data: assetsNameValuePair.map((assetpair) =>
          Object.values(assetpair)
        ),
        backgroundColor: ["#0042AB", "#005CD3", "#3686DC", "#1298E6"],
      },
    ],
  };
};
