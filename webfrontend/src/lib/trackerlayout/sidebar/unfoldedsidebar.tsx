import React from "react";
import Link from "next/link";
import { sidebarnavResponse } from "@/api/sidebarnavAPI";
import { sidebarelementinterface } from "@/api/sidebarnavAPI";
import { usePathname } from "next/navigation";

/**
 * This component defines how the unfolded Sidebar should look like.
 * @returns The expanded version of the sidebar, where you can see the icons, anchor textes, small headings, as well as the logo and branding.
 */
const UnfoldedSidebar = (): React.ReactNode => {
  /**
   * This function returns the rendering logic for a bulletpoint in the unfolded sidebar.
   * @param sidebarElementContainer The sidebarElementContainer contains an object, which holds the id, the Icon,
   * the link element, the naming element and the position of a navigation item in the sidebar. More information in the sidebarnavAPI.
   * @returns This function returns a list element containing an Icon and an anchor text holding the Link for the underlaying page.
   */
  const renderUnfoldedBulletPoints = (
    sidebarElementContainer: sidebarelementinterface
  ) => {
    return (
      <li key={sidebarElementContainer.id} className="flex justify-center">
        <Link
          href={`./${sidebarElementContainer.link}`}
          className="flex flex-row pl-5 mt-1 rounded-md text-icongray group
           hover:bg-blue hover:text-white hover:w-11/12 hover:rounded-md
            focus:bg-blue focus:text-white focus:rounded-md focus: w-11/12
            transition duration-300 ease-in-out"
        >
          <div className="mt-1 mr-2 text-2xl h-full self-center group-hover:text-white">
            {" "}
            {React.createElement(sidebarElementContainer.IconComponent)}{" "}
          </div>
          <div className="text-sm self-center text-black group-hover:text-white">
            {sidebarElementContainer.element}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <ul className="mt-5">
      <li className="text-sm font-light text-gray-400 pl-5"> General </li>
      {sidebarnavResponse.map((sidebarElementContainer) => {
        if (sidebarnavResponse.indexOf(sidebarElementContainer) < 9) {
          return renderUnfoldedBulletPoints(sidebarElementContainer);
        }
      })}
      <li className="text-sm font-light text-gray-400 pl-5 mt-5"> Support </li>
      {sidebarnavResponse.map((sidebarElementContainer) => {
        if (sidebarnavResponse.indexOf(sidebarElementContainer) > 9) {
          return renderUnfoldedBulletPoints(sidebarElementContainer);
        }
      })}
    </ul>
  );
};

export default UnfoldedSidebar;
