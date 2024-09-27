import { AssetsAPI } from "@/api/tablecomponentAPI";

export default async function TableComponent() {
  const assetsAPIData = await AssetsAPI.get("assets");

  if (assetsAPIData !== null) {
    return (
      <>
        <>
          <h1> This is the data</h1>
          <ul>
            {assetsAPIData.map((assetobject) => (
              <li key={assetobject.id}> {assetobject.AssetValue} </li>
            ))}
          </ul>
        </>
      </>
    );
  } else {
    return <p> Failed to load table data... </p>;
  }
}
