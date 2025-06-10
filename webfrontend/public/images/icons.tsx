import {
  black,
  white,
  green,
  gray,
  red,
  flyzerBlue,
  icongray,
} from "../../src/utility/lib/helpers/helper-config/colors";

export const PositionDirectionIcon = ({ direction }: { direction: string }) => {
  return (
    <svg
      width="16"
      height="20"
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

export const ShowDetailIcon = ({
  rowId,
  expandedRow,
}: {
  rowId: number;
  expandedRow: number | null | undefined;
}) => {
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill={icongray}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        cursor: "pointer",
        transition: "transform 0.4s ease",
        transform: rowId === expandedRow ? "rotate(90deg)" : "rotate(0deg)",
      }}
    >
      <path
        d="M7.96406 5.60637L0.920314 0.104809C0.901908 0.0903191 0.879789 0.081314 0.856496 0.0788282C0.833203 0.0763424 0.809681 0.0804768 0.788632 0.0907565C0.767583 0.101036 0.749861 0.117045 0.7375 0.136943C0.725139 0.156841 0.71864 0.179822 0.718751 0.203247V1.41106C0.718751 1.48762 0.754689 1.56106 0.814064 1.60793L6.43906 6.00012L0.814064 10.3923C0.753126 10.4392 0.718751 10.5126 0.718751 10.5892V11.797C0.718751 11.9017 0.839064 11.9595 0.920314 11.8954L7.96406 6.39387C8.02393 6.34717 8.07236 6.28744 8.10567 6.21921C8.13898 6.15098 8.1563 6.07605 8.1563 6.00012C8.1563 5.92419 8.13898 5.84927 8.10567 5.78104C8.07236 5.71281 8.02393 5.65307 7.96406 5.60637Z"
        stroke={black}
        strokeWidth="0.2"
      />
    </svg>
  );
};

export const SortingDataTableIcon = ({
  sorted,
  className = "",
}: {
  sorted: "asc" | "desc" | false;
  className?: string;
}) => {
  if (!sorted) return null;

  const rotation = sorted === "asc" ? 180 : 0;

  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.3s ease-in-out",
        height: "1.25rem",
        width: "1.25rem",
        marginLeft: "0.25rem",
      }}
    >
      <polygon points="9,12 4.5,6 13.5,6" fill="black" />
    </svg>
  );
};

export const AssetPercentageValueIcon = ({
  percentage,
}: {
  percentage: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 13 12"
      width={13}
      height={12}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${percentage ? 180 : 0}deg)`,
      }}
    >
      <g clipPath="url(#clip0_1974_60445)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.6124 3.96934C5.75302 3.82889 5.94365 3.75 6.1424 3.75C6.34115 3.75 6.53177 3.82889 6.6724 3.96934L9.5014 6.79734C9.57103 6.86701 9.62626 6.94971 9.66393 7.04072C9.7016 7.13173 9.72098 7.22927 9.72096 7.32777C9.72094 7.42627 9.70151 7.5238 9.6638 7.61479C9.62608 7.70578 9.57081 7.78846 9.50115 7.85809C9.43148 7.92772 9.34878 7.98295 9.25777 8.02063C9.16676 8.0583 9.06922 8.07768 8.97072 8.07765C8.87222 8.07763 8.77469 8.05821 8.6837 8.02049C8.5927 7.98278 8.51003 7.92751 8.4404 7.85784L6.1424 5.56034L3.8444 7.85834C3.77524 7.93 3.69251 7.98718 3.60103 8.02653C3.50954 8.06588 3.41114 8.08661 3.31156 8.08753C3.21197 8.08844 3.1132 8.06951 3.02101 8.03184C2.92882 7.99417 2.84506 7.93852 2.77461 7.86814C2.70416 7.79775 2.64843 7.71404 2.61067 7.62188C2.57292 7.52973 2.55389 7.43098 2.55471 7.3314C2.55553 7.23181 2.57617 7.13339 2.61544 7.04187C2.6547 6.95034 2.7118 6.86756 2.7834 6.79834L5.6124 3.96934Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_1974_60445">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(0.142578)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const CustomHoldingIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 28 28"
      fill="none"
    >
      <rect x="0.5" y="0.5" width="27" height="27" rx="2.5" fill={flyzerBlue} />
      <rect x="0.5" y="0.5" width="27" height="27" rx="2.5" stroke="black" />
      <path
        d="M5 9.88235V9C5 7.89543 5.89543 7 7 7H21C22.1046 7 23 7.89543 23 9V9.88235M5 9.88235V19C5 20.1046 5.89543 21 7 21H21C22.1046 21 23 20.1046 23 19V9.88235M5 9.88235H9.09091M23 9.88235H18.9091M18.9091 9.88235V11.1765C18.9091 12.281 18.0137 13.1765 16.9091 13.1765H11.0909C9.98634 13.1765 9.09091 12.281 9.09091 11.1765V9.88235M18.9091 9.88235H9.09091"
        stroke="white"
        strokeWidth="1.7"
      />
    </svg>
  );
};
