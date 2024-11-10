import Link from "next/link";

const AssetDistributionLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="flex flex-col flex-wrap w-full h-full pl-12">
      <header className="flex flex-col justify-around w-full h-1/6">
        <h1 className="text-3xl"> Asset-Distribution </h1>
        <nav className="flex flex-row rounded-md shadow-md bg-white w-1/5 py-1 text-gray-600">
          <div className="mr-3">
            <Link href={"/tracker/asset-distribution"}> Assets </Link>
          </div>
          <div className="mr-3">
            <Link href={"/tracker/asset-group-distribution"}>Asset-Groups</Link>
          </div>
          <div>
            <Link href={"/tracker/holdings-distribution"}>Holdings</Link>
          </div>
        </nav>
      </header>
      <div className="">{children}</div>
    </section>
  );
};

export default AssetDistributionLayout;
