export const formatPieData = (initialData: any) => {
  const assetsNameValuePair = initialData.map((assetobject: any) => {
    const name = assetobject.assetname;
    const distributionvalue = assetobject.assetpercentage;
    return { [name]: distributionvalue };
  });
  return {
    labels: assetsNameValuePair.map((assetpair: any) => Object.keys(assetpair)),
    datasets: [
      {
        data: assetsNameValuePair.map((assetpair: any) =>
          Object.values(assetpair)
        ),
        backgroundColor: ["#0042AB", "#005CD3", "#3686DC", "#1298E6"],
      },
    ],
  };
};
