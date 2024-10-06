import {
  SearchIcon,
  AlarmIcon,
  BackArrowIcon,
  PortfolioIcon,
} from "../../../public/images";

export default function HeadBarContainer() {
  return (
    <nav>
      <BackArrowIcon className="text-4xl" />
      <SearchIcon className="text-4xl" />
      <button> Manage </button>
      <AlarmIcon className="text-4xl" />
      <PortfolioIcon className="text-4xl" />
    </nav>
  );
}
