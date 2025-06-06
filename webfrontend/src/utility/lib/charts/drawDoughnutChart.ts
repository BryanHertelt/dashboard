export const drawDoughnutChart = (hover:any, element:any, chart:any, selectedDatasetIndex:any, selectedIndex: any) => {
    if (element[0]) {
        selectedDatasetIndex.current = element[0].datasetIndex;
        selectedIndex.current = element[0].index;
        const newIndex = element[0].index;
        if (selectedIndex.current !== newIndex) {
          selectedIndex.current = newIndex;
          chart.draw();
        }
      } else {
        selectedDatasetIndex.current = null;
        selectedIndex.current = null;
        chart.draw();
      }
}