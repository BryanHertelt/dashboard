import Link from "next/link";

const AssetDistributionLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="flex flex-col flex-wrap w-full px-12 mt-10">
      <header className="flex flex-col justify-center w-full h-1/6">
        <h1 className="text-3xl font-light"> Asset-Distribution </h1>
        <nav className="flex flex-row justify-between rounded-md shadow-even bg-white w-1/6 my-6 py-3 px-2 text-icongray">
          <div className="mx-2">
            <Link href={"/tracker/asset-distribution"}> Assets </Link>
          </div>
          <div className="mr-2">
            <Link href={"/tracker/asset-group-distribution"}>Asset-Groups</Link>
          </div>
          <div className="mr-2">
            <Link href={"/tracker/holdings-distribution"}>Holdings</Link>
          </div>
        </nav>
      </header>
      <div className=" flex flex-row flex-wrap w-full h-5/6">{children}</div>
    </section>
  );
};

export default AssetDistributionLayout;
