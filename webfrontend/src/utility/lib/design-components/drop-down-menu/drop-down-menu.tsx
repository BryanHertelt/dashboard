import { useState } from "react";
const items = ["1h", "2h", "3h"];

const DropDownMenu = (props: any) => {
  const [fold, setFold] = useState(true);

  const handleDropDown = () => {
    setFold(!fold);
  };

  const dropDownDesign =
    fold === true
      ? "hidden"
      : "flex flex-col text-icongray text-sm h-full w-full rounded-md";

  return (
    <div className="h-full w-full">
      <button
        onClick={() => handleDropDown()}
        className="bg-gray text-icongray text-sm h-full w-full rounded-md"
      >
        {props.timeframe}{" "}
      </button>
      <div className={`${dropDownDesign}`}>
        {props.items.map((item: any, index: number) => {
          return (
            <button key={index} onClick={() => props.changeTimeFrame(item)}>
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DropDownMenu;
