"use client";

import {
  LogoIcon,
  FoldSideBarIcon,
  UnfoldSideBarIcon,
} from "../../../../../public/images";
import UnfoldedSidebar from "./unfoldedsidebar";
import FoldedSideBar from "./foldedsidebar";
import { useState } from "react";
import { sidebarnavResponse } from "@/api/sidebarnavAPI";
/**
 * This function renders on of the two sidebar designs (foldedsidebar/unfolded sidebar) based on the fold state.
 * @returns This function returns the sidebar component.
 */
const SidebarContainer = (): React.ReactElement => {
  const [fold, setFold] = useState<boolean>(false);
  const handleSideBarFold = () => {
    setFold(!fold);
  };

  return (
    <div data-testid="sidebarcontainer">
      {fold ? (
        <nav className="flex flex-col justify-between w-full h-full shadow-even">
          <nav className="flex flex-col h-full  w-full ">
            <header className="flex flex-row justify-start m-2.5 my-3.5 align-baseline">
              <LogoIcon className="text-4xl" />
              <h1 className="text-3xl font-semibold"> Flyzer </h1>
              <button
                className=" flex flex-row w-1/2 justify-end"
                data-testid="foldbutton"
              >
                <FoldSideBarIcon
                  className="text-4xl"
                  onClick={handleSideBarFold}
                />
              </button>
            </header>
            <hr />
            <UnfoldedSidebar sidebarnavResponse={sidebarnavResponse} />
          </nav>
        </nav>
      ) : (
        <nav className="flex flex-col justify-between w-20 h-full shadow-even">
          <nav className="flex flex-col h-full border border-red-300 w-full ">
            <header className="flex flex-row ml-2.5 justify-start my-3.5 align-baseline w-20">
              <LogoIcon className="text-4xl" />
              <button
                className=" flex flex-row w-20 justify-start ml-1.5"
                role="button"
              >
                <UnfoldSideBarIcon
                  className="text-4xl"
                  onClick={handleSideBarFold}
                />
              </button>
            </header>
            <hr />
            <FoldedSideBar sidebarnavResponse={sidebarnavResponse} />
          </nav>
        </nav>
      )}
    </div>
  );
};

export default SidebarContainer;

/**
export default function SidebarContainer() {
  const [fold, setFold] = useState<boolean>(true);
  const handleSideBarFold = () => {
    setFold(!fold);
  };
  console.log(<FoldedSideBar />);

  return (
    <div data-testid="sidebarcontainer-1">
      {fold ? (
        <nav className="flex flex-col justify-between w-2/12 h-full">
          <nav className="flex flex-col h-full  w-full ">
            <header className="flex flex-row justify-start m-2.5 my-3.5 align-baseline">
              <LogoIcon className="text-4xl" />
              <h1 className="text-3xl font-semibold"> Flyzer </h1>
              <div className=" flex flex-row w-1/2 justify-end ">
                <FoldSideBarIcon
                  className="text-4xl"
                  onClick={handleSideBarFold}
                />
              </div>
            </header>
            <hr />
            <UnfoldedSidebar />
          </nav>
        </nav>
      ) : (
        <nav className="flex flex-col justify-between w-20 h-full">
          <nav className="flex flex-col h-full border border-red-300 w-full ">
            <header className="flex flex-row ml-2.5 justify-start my-3.5 align-baseline w-20">
              <LogoIcon className="text-4xl" />
              <div className=" flex flex-row w-20 justify-start ml-1.5 ">
                <UnfoldSideBarIcon
                  className="text-4xl"
                  onClick={handleSideBarFold}
                />
              </div>
            </header>
            <hr />
            <FoldedSideBar />
          </nav>
        </nav>
      )}
    </div>
  );
}
*/
