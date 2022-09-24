import { useState, useRef, useEffect } from "react";
import "./area-chart.scss";
import {
  axisLeft,
  axisBottom,
  max,
  min,
  select,
  selectAll,
  Selection,
  scaleLinear,
  scaleBand,
  Axis,
  NumberValue,
  scaleTime,
  ScaleBand,
  ScaleLinear,
  ScaleTime,
  extent,
  line,
  curveBasis,
  area,
} from "d3";
// TYPES
interface Props {
  readonly data: Array<any>;
  readonly secondColumn: string;
  readonly firstColumn: string;
  chartTitle?: string;
  areaColor?: string;
  areaOpacity?: number;
  svgWidth?: number;
  svgHeight?: number;
  chartWrapperHeight?: number;
  chartWrapperWidth?: number;
  chartAreaId?: number;
  domainMinReduce?: number;
  domainMaxReduce?: number;
  numericMinMultiply?: number;
  numericMaxMultiply?: number;
  tickPadding?: number;
  isTickSize?: boolean;
}
const AreaChart = (props: Props) => {
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const svgRef = useRef<null | SVGSVGElement>(null);
  // VARS
  const [data, setData] = useState(props.data);
  const { secondColumn, firstColumn } = props;
  const MAX_VALUE_FIRST: number = data
    ? max(data, (row) => row[firstColumn])
    : 0;
  const MIN_VALUE_FIRST: number = data
    ? min(data, (row) => row[firstColumn])
    : 0;
  const MAX_VALUE_SECOND: number = data
    ? max(data, (row) => row[secondColumn])
    : 0;
  const MIN_VALUE_SECOND: number = data
    ? min(data, (row) => row[secondColumn])
    : 0;
  const chartTitle: string = props.chartTitle
    ? props.chartTitle
    : "chart's title";
  //   chart
  const domainMinReduce: number = props.domainMinReduce
    ? props.domainMinReduce
    : 1;
  const domainMaxReduce: number = props.domainMaxReduce
    ? props.domainMaxReduce
    : 1;
  const numericMinMultiply: number = props.numericMinMultiply
    ? props.numericMinMultiply
    : 0.3;
  const numericMaxMultiply: number = props.numericMaxMultiply
    ? props.numericMaxMultiply
    : 0.3;
  const chartAreaId: number = props.chartAreaId ? props.chartAreaId : 1;
  const svgWidth: number = props.svgWidth ? props.svgWidth : 700;
  const svgHeight: number = props.svgHeight ? props.svgHeight : 500;
  const chartWrapperHeight: number = props.chartWrapperHeight
    ? props.chartWrapperHeight
    : svgHeight - 100;
  const chartWrapperWidth: number = props.chartWrapperWidth
    ? props.chartWrapperWidth
    : svgWidth - 100;
  const areaColor: string = props.areaColor ? props.areaColor : "teal";
  const areaOpacity: number = props.areaOpacity ? props.areaOpacity : 0.6;
  const tickPadding: number = props.tickPadding ? props.tickPadding : 7.5;
  const isTickSize: boolean =
    props.isTickSize !== undefined ? props.isTickSize : false;

  // SCALE
  let horizontalScale: ScaleLinear<number, number, never>;
  let verticalScale: ScaleLinear<number, number, never>;
  let horizontalAxis: Axis<NumberValue | Date>;
  let verticalAxis: Axis<NumberValue | Date>;
  if (data) {
    //  configure scale
    horizontalScale = scaleLinear()
      .domain([
        // MIN_VALUE_SECOND - domainMinReduce,
        MIN_VALUE_SECOND,
        // new Date(`${MIN_VALUE_SECOND}`),
        // MAX_VALUE_SECOND + domainMaxReduce,
        MAX_VALUE_SECOND,
        // new Date(`${MAX_VALUE_SECOND}`),
      ])
      .range([0, chartWrapperWidth]);
    verticalScale = scaleLinear()
      .domain([
        MIN_VALUE_FIRST - MIN_VALUE_FIRST * numericMinMultiply,
        MAX_VALUE_FIRST + MAX_VALUE_FIRST * numericMaxMultiply,
      ])
      .range([chartWrapperHeight, 0]);
    // configure axis
    verticalAxis = axisLeft(verticalScale)
      .tickPadding(tickPadding)
      .tickSize(isTickSize ? -chartWrapperWidth : 0);
    horizontalAxis = axisBottom(horizontalScale)
      .ticks(5)
      .tickFormat((year) => `${year}`)
      .tickPadding(tickPadding)
      .tickSize(isTickSize ? -chartWrapperHeight : 0);
  }

  // manipulating svg
  useEffect(() => {
    if (!selection) {
      setSelection(() => select(svgRef.current));
    } else {
      // SVG
      selection.attr("width", svgWidth).attr("height", svgHeight);
      // configuring chart wrapper
      const chartBoxG: Selection<SVGGElement, unknown, null, undefined> =
        selection
          .append("g")
          .attr("class", "chart-box")
          .attr(
            "transform",
            `translate(${(svgWidth - chartWrapperWidth) / 2}, ${
              (svgHeight - chartWrapperHeight) / 2
            })`
          );
      // configuriong the axis
      const horizontalAxisG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG
          .append("g")
          .attr("class", "horizontal-axis")
          .call(horizontalAxis)
          .attr("transform", `translate(0, ${chartWrapperHeight})`);
      const verticalAxisG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG.append("g").attr("class", "vertical-axis").call(verticalAxis);
      // configuring the area-chart
      const plotWrapperG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG.append("g").attr("class", "plot-wrapper");
      // area generator
      const areaGenerator = area()
        .x((row) => horizontalScale(row[secondColumn as unknown as number]))
        .y0(chartWrapperHeight)
        .y1((row) => verticalScale(row[firstColumn as unknown as number]));
      // .curve(curveBasis);
      const pathElement = plotWrapperG
        .append("path")
        .attr("d", areaGenerator(data));
      //   BEAUTIFY
      pathElement
        .attr("fill", areaColor)
        // .attr("stroke", "blue")
        .attr("stroke-width", 0)
        // smoothing the line
        .attr("stroke-linejoin", "round")
        .attr("opacity", areaOpacity);
    }
  }, [selection]);

  return (
    <div className="area-chart" id={`area-chart-${chartAreaId}`}>
      <h4>{chartTitle}</h4>
      <section className="chart-wrapper">
        <span className="vertical">{firstColumn}</span>
        <svg ref={svgRef}></svg>
      </section>
      <span className="horizontal">{secondColumn}</span>
    </div>
  );
};

export default AreaChart;
