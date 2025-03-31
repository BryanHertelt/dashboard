import { useState } from "react";
const red = "#DA0000";
const green = "#04B900";
const white = "#FFFFFF";
const gray = "#7A7A7A";

export const PositionDirectionIcon = ({ direction }: { direction: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`${direction === "long" ? "" : "rotate(180, 8, 8)"}`}>
        <rect
          width="16"
          height="16"
          rx="3"
          fill={`${direction === "long" ? green : red}`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.56008 6.20227C7.67782 6.07275 7.83742 6 8.00383 6C8.17023 6 8.32983 6.07275 8.44757 6.20227L10.8162 8.81019C10.8745 8.87443 10.9207 8.9507 10.9523 9.03463C10.9838 9.11855 11 9.2085 11 9.29934C11 9.39017 10.9837 9.48011 10.9521 9.56403C10.9206 9.64794 10.8743 9.72418 10.816 9.78839C10.7576 9.8526 10.6884 9.90354 10.6122 9.93828C10.536 9.97302 10.4543 9.99089 10.3719 9.99087C10.2894 9.99085 10.2077 9.97293 10.1315 9.93815C10.0554 9.90337 9.98614 9.8524 9.92784 9.78816L8.00383 7.66946L6.07982 9.78862C6.02192 9.85471 5.95265 9.90743 5.87605 9.94372C5.79946 9.98001 5.71707 9.99913 5.63369 9.99997C5.55032 10.0008 5.46762 9.98336 5.39043 9.94862C5.31325 9.91388 5.24312 9.86256 5.18413 9.79766C5.12514 9.73275 5.07848 9.65555 5.04687 9.57057C5.01526 9.48558 4.99934 9.39452 5.00002 9.30269C5.00071 9.21085 5.01799 9.12009 5.05086 9.03569C5.08374 8.95129 5.13154 8.87494 5.19149 8.81111L7.56008 6.20227Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export const ShowDetailIcon = () => {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated(!isRotated);
  };

  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill={gray}
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        transition: "transform 0.6s ease",
        transform: isRotated ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      <path
        d="M7.96406 5.60637L0.920314 0.104809C0.901908 0.0903191 0.879789 0.081314 0.856496 0.0788282C0.833203 0.0763424 0.809681 0.0804768 0.788632 0.0907565C0.767583 0.101036 0.749861 0.117045 0.7375 0.136943C0.725139 0.156841 0.71864 0.179822 0.718751 0.203247V1.41106C0.718751 1.48762 0.754689 1.56106 0.814064 1.60793L6.43906 6.00012L0.814064 10.3923C0.753126 10.4392 0.718751 10.5126 0.718751 10.5892V11.797C0.718751 11.9017 0.839064 11.9595 0.920314 11.8954L7.96406 6.39387C8.02393 6.34717 8.07236 6.28744 8.10567 6.21921C8.13898 6.15098 8.1563 6.07605 8.1563 6.00012C8.1563 5.92419 8.13898 5.84927 8.10567 5.78104C8.07236 5.71281 8.02393 5.65307 7.96406 5.60637Z"
        stroke={gray}
        strokeWidth="0.8"
      />
    </svg>
  );
};

export const SortingDataTableIcon = (props: any) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated((prev) => !prev);
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill={white}
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{
        transform: `rotate(${isRotated ? 180 : 0}deg)`,
        transition: "transform 0.3s ease-in-out",
        cursor: "pointer",
        backgroundColor: "white",
        height: "1.25rem",
        width: "1.25rem",
        marginLeft: "0.25rem",
        borderRadius: "0.125rem",
      }}
    >
      <rect x="0.785156" y="1" width="16" height="16" rx="1.5" />
      <path
        d="M12.3477 10.3548H9.51432L9.51432 4.03648L8.09057 4.01523L8.09057 10.3548L5.26432 10.3548L8.80599 13.8965L12.3477 10.3548Z"
        fill="#7A7A7A"
      />
    </svg>
  );
};
