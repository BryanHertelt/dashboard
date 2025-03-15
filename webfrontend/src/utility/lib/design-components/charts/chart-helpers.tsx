import { formatMainLineData } from "./main-chart-line-formatter";
import { Line } from "react-chartjs-2";

export const LineComponent = (props: any) => {
  const lineConfig = formatMainLineData(
    props.processedQueryData,
    props.timeframe,
    props.comparators,
    props.scope
  );
  return <Line data={lineConfig.data} options={lineConfig.config} />;
};
