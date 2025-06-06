/**
 * `drawDoughnutChart` manages hover interactions for a Chart.js doughnut chart,
 * tracking the currently hovered segment and triggering redraws when needed.
 * It updates mutable refs that track the dataset and slice index currently under hover.
 *
 * ### Parameters
 * @param hover - The hover event object (unused in the logic but typically provided by Chart.js).
 * @param element - An array of active chart elements under the current hover.
 * Typically contains objects with `datasetIndex` and `index` of the hovered slice.
 * @param chart - The Chart.js instance used to trigger a canvas redraw via `chart.draw()`.
 * @param selectedDatasetIndex - A mutable ref (`React.useRef`) storing the dataset index of the hovered segment.
 * @param selectedIndex - A mutable ref (`React.useRef`) storing the index of the hovered chart slice.
 *
 * ### Behavior
 * - When hovering over a valid chart segment:
 *   - Updates `selectedDatasetIndex` and `selectedIndex` to match the hovered segment.
 *   - If the index changes, triggers `chart.draw()` to refresh the chart and render hover labels.
 * - When hovering outside the chart (no segment selected):
 *   - Resets both refs to `null`.
 *   - Triggers a redraw to clear previously shown labels or indicators.
 *
 * @returns void - All updates are side effects on refs and the Chart.js canvas.
 */
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