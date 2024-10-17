import React from "react";
import Link from "next/link";
import { sidebarnavResponse } from "@/api/sidebarnavAPI";
import { sidebarelementinterface } from "@/api/sidebarnavAPI";

/**
 * This component defines how the folded Sidebar looks like.
 * @returns A smaller version of the sidebar, where you can just see the icons and small headings, as well as the Logo.
 */
const FoldedSideBar = (): React.ReactNode => {
  /**
   * This function returns the rendering logic for a bulletpoint in the folded sidebar.
   * @param sidebarElementContainer The sidebarElementContainer contains an object, which holds the id, the Icon,
   * the link element, the naming element and the position of a navigation item in the sidebar. More information in the sidebarnavAPI.
   * @returns This function returns a list element containing an Icon holding the Link for the underlaying page.
   */
  const renderFoldedBulletPoints = (
    sidebarElementContainer: sidebarelementinterface
  ) => {
    return (
      <li key={sidebarElementContainer.id} className="flex justify-center">
        <Link
          href={`./${sidebarElementContainer.link}`}
          className="flex flex-row mt-1 py-1 justify-center align-middle pl-2 text-icongray
            hover:bg-blue hover:text-white hover:w-6/12 hover:rounded-md
            focus:bg-blue focus:text-white focus:rounded-md"
        >
          <div className="mt-1 mr-2 text-2xl h-full self-center">
            {" "}
            {React.createElement(sidebarElementContainer.IconComponent)}{" "}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <ul className="mt-5">
      <li className="text-sm font-light text-gray-400 pl-3"> General </li>
      {sidebarnavResponse.map((sidebarElementContainer) => {
        if (sidebarnavResponse.indexOf(sidebarElementContainer) < 9)
          return renderFoldedBulletPoints(sidebarElementContainer);
      })}
      <li className="text-sm font-light text-gray-400 pl-3 mt-5"> Support </li>
      {sidebarnavResponse.map((sidebarElementContainer) => {
        if (sidebarnavResponse.indexOf(sidebarElementContainer) > 9)
          return renderFoldedBulletPoints(sidebarElementContainer);
      })}
    </ul>
  );
};

export default FoldedSideBar;
