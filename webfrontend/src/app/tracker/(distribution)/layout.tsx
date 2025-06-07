"use client";
import Link from "next/link";
import { useState, useCallback } from "react";
import useResizeObserver from "use-resize-observer";

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

  const handleTabSwitch = useCallback(
    (index: number, routeId: number) => {
      {
        const foundRoute = routes.find((routes) => routes.id === routeId);
        if (foundRoute) {
          setCurrentRoute(routes.indexOf(foundRoute));
        }
      }
    },
    [routes]
  );
  const { ref: routeRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }: { width: any }) => {
      if (width) {
        setTabWidth(width / routes.length);
      }
    },
  });

  return (
    <section className="flex flex-col flex-wrap w-full px-12 mt-10">
      <header className="flex flex-col justify-center w-full h-1/6">
        <h1 className="text-3xl font-light"> Asset-Distribution </h1>
        <nav className="relative flex flex-row lp:w-1/4 lg:w-1/6 justify-start card py-1 mt-3">
          <div
            className="relative flex flex-row w-full justify-around"
            ref={routeRef}
          >
            {routes.map((navElement, index) => {
              return (
                <Link
                  key={navElement.id}
                  href={navElement.link}
                  className={`${
                    currentRoute === navElement.id ? "text-white" : "text-black"
                  } z-50 relative p-2 text-xs overflow-hidden md:text-xs text-center rounded-md w-1/3`}
                  onClick={() => handleTabSwitch(index, navElement.id)}
                >
                  <div className="w-full h-full">{navElement.name}</div>
                </Link>
              );
            })}
            <div
              className="absolute z-5 inset-0 bg-blue rounded-md transition-all"
              style={{
                width: tabWidth,
                translate: `${currentRoute * tabWidth}px 0px`,
              }}
            />
          </div>
        </nav>
      </header>
      <div className=" flex flex-row flex-wrap w-full h-5/6">{children}</div>
    </section>
  );
};

export default AssetDistributionLayout;
