import {
  SearchIcon,
  AlarmIcon,
  BackArrowIcon,
  PortfolioIcon,
} from "../../../public/images";

/**
 * This component holds the headbar.
 * @returns All icons of the headbar with right positioning.
 */
const HeadBarContainer = (): React.ReactNode => {
  return (
    <nav className="flex flex-row justify-end w-full h-full shadow-sm bg-white shadow-gray-300">
      <div className="w-full justify-start self-center">
        <BackArrowIcon className="text-2xl" />
      </div>
      <span className="flex flex-row justify-end w-full self-center">
        <SearchIcon className="text-3xl mr-3.5" />
        <button className="bg-blue rounded-md text-white text-sm font-light pl-2.5 pr-2.5 mr-3.5">
          {" "}
          Manage{" "}
        </button>
        <AlarmIcon className="text-3xl mr-3.5" />
        <PortfolioIcon className="text-3xl mr-3.5" />
      </span>
    </nav>
  );
};

export default HeadBarContainer;
