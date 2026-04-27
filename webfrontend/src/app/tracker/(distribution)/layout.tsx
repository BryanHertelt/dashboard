"use client";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import useResizeObserver from "use-resize-observer";
import { usePathname } from "next/navigation";

const AssetDistributionLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tabWidth, setTabWidth] = useState<number>(0);
  const [currentRoute, setCurrentRoute] = useState<number>(0);
  const routes = [
    { name: "Assets", link: "/tracker/asset-distribution", id: 0 },
    { name: "Asset-Groups", link: "/tracker/asset-group-distribution", id: 1 },
    { name: "Holdings", link: "/tracker/holdings-distribution", id: 2 },
  ];
  const pathname = usePathname();

  useEffect(() => {
    const matchedRoute = routes.find((route) => route.link === pathname);
    if (matchedRoute) {
      setCurrentRoute(matchedRoute.id);
    }
  }, [pathname, routes]);

  const handleTabSwitch = useCallback(
    (index: number, routeId: number) => {
      const foundRoute = routes.find((route) => route.id === routeId);
      if (foundRoute) {
        setCurrentRoute(foundRoute.id);
      }
    },
    [routes]
  );

  const { ref: routeRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        setTabWidth(width / routes.length);
      }
    },
  });

  return (
    <section className="flex flex-col flex-wrap w-full px-12 mt-10">
      <header className="flex flex-col justify-center w-full h-1/6">
        <h1 className="text-3xl font-light">Asset-Distribution</h1>
        <nav className="relative flex flex-row sm:w-3/4  md:w-3/5 lp:w-1/3 lg:w-1/3 xl:w-2/6 justify-start card py-1 mt-3">
          <div
            className="relative flex flex-row w-full justify-around"
            ref={routeRef}
          >
            {routes.map((navElement, index) => (
              <Link
                key={navElement.id}
                href={navElement.link}
                className={`${
                  currentRoute === navElement.id ? "text-white" : "text-black"
                } z-50 relative p-2 text-xs overflow-hidden md:text-xs text-center  rounded-md w-1/3`}
                onClick={() => handleTabSwitch(index, navElement.id)}
              >
                <div className="w-full h-full flex flex-row justify-center items-center">{navElement.name}</div>
              </Link>
            ))}
            <div
              className="absolute z-5 inset-0 bg-blue rounded-md transition-all"
              style={{
                width: tabWidth,
                transform: `translateX(${currentRoute * tabWidth}px)`,
              }}
            />
          </div>
        </nav>
      </header>
      <div className="flex flex-row flex-wrap w-full h-5/6">{children}</div>
    </section>
  );
};

export default AssetDistributionLayout;
