import { useState, useRef, useEffect } from "react";
import "./line-chart.scss";
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
} from "d3";
//
interface Row {}
interface Props {
  readonly data: Array<any>;
  readonly secondColumn: string;
  readonly firstColumn: string;
  svgWidth?: number;
  svgHeight?: number;
  chartWrapperHeight?: number;
  chartWrapperWidth?: number;
  chartTitle?: string;
  lineColor?: string;
  lineWidth?: number;
  domainMinMultiplier?: number;
  domainMaxMultiplier?: number;
  tickPadding?: number;
  isTickSize?: boolean;
  isDot?: boolean;
  dotRadius?: number;
  dotOpacity?: number;
  dotColor?: string;
}

const LineChart = (props: Props) => {
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
  // chart's stuffs
  const svgWidth: number = props.svgWidth ? props.svgWidth : 700;
  const svgHeight: number = props.svgHeight ? props.svgHeight : 500;
  const chartTitle: string = props.chartTitle
    ? props.chartTitle
    : "CHART'S TITLE, LINE CHART";
  const lineColor: string = props.lineColor ? props.lineColor : "#000";
  const lineWidth: number = props.lineWidth ? props.lineWidth : 1;
  const chartWrapperHeight: number = props.chartWrapperHeight
    ? props.chartWrapperHeight
    : svgHeight - 100;
  const chartWrapperWidth: number = props.chartWrapperWidth
    ? props.chartWrapperWidth
    : svgWidth - 100;
  const domainMinMultiplier: number = props.domainMinMultiplier
    ? props.domainMinMultiplier
    : 0.01;
  const domainMaxMultiplier: number = props.domainMaxMultiplier
    ? props.domainMaxMultiplier
    : 0.01;
  const tickPadding: number = props.tickPadding ? props.tickPadding : 10;
  const isTickSize: boolean =
    props.isTickSize !== undefined ? props.isTickSize : false;
  const isDot: boolean = props.isDot !== undefined ? props.isDot : false;
  const dotRadius: number = props.dotRadius ? props.dotRadius : 5;
  const dotColor: string = props.dotColor ? props.dotColor : "teal";
  const dotOpacity: number = props.dotOpacity ? props.dotOpacity : 0.4;

  //
  // SCALE
  let horizontalScale: ScaleLinear<number, number, never>;
  // just edit code above to change if ur horizontal
  // axis have date type variable
  let verticalScale: ScaleLinear<number, number, never>;
  // AXIS
  let horizontalAxis: Axis<NumberValue | Date>;
  let verticalAxis: Axis<NumberValue>;
  if (data) {
    // coinfigure Scale
    horizontalScale = scaleLinear()
      .domain([
        MIN_VALUE_SECOND - MIN_VALUE_SECOND * domainMinMultiplier,
        MAX_VALUE_SECOND + MAX_VALUE_SECOND * domainMaxMultiplier,
      ])
      .range([0, chartWrapperWidth])
      .nice();
    verticalScale = scaleLinear()
      .domain([
        MIN_VALUE_FIRST - MIN_VALUE_FIRST * domainMinMultiplier,
        MAX_VALUE_FIRST + MAX_VALUE_FIRST * domainMaxMultiplier,
      ])
      .range([chartWrapperHeight, 0])
      .nice();
    // configure Axis
    verticalAxis = axisLeft(verticalScale)
      .tickPadding(tickPadding)
      .tickSize(isTickSize ? -chartWrapperWidth : 0);
    horizontalAxis = axisBottom(horizontalScale)
      .tickPadding(tickPadding)
      .tickSize(isTickSize ? -chartWrapperHeight : 0);
  }

  // manipulating svg using d3js
  useEffect(() => {
    if (!selection) {
      setSelection(() => select(svgRef.current));
    } else {
      // configuring svg
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
      // dots
      const plotWrapperG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG.append("g").attr("class", "plot-wrapper");

      // LINE GENERATOR
      const lineGenerator = line()
        .x((row) => horizontalScale(row[secondColumn as unknown as number]))
        .y((row) => verticalScale(row[firstColumn as unknown as number]));
      // .curve(curveBasis);
      // drawing the line
      const pathElement = plotWrapperG
        .append("path")
        .attr("d", lineGenerator(data));
      // beautiify
      pathElement
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", lineWidth)
        // smoothing the line
        .attr("stroke-linejoin", "round");
      if (isDot) {
        const dots = plotWrapperG
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", dotRadius)
          .attr("opacity", dotOpacity)
          .attr("cx", (row) => horizontalScale(row[secondColumn]))
          .attr("cy", (row) => verticalScale(row[firstColumn]))
          .attr("fill", dotColor);
        dots
          .append("title")
          .text((row) => `${row[secondColumn]}, ${row[firstColumn]}`);
      }
    }
  }, [selection]);
  return (
    <div className="line-chart">
      <h4>{chartTitle}</h4>
      <section className="chart-wrapper">
        <span className="vertical">{firstColumn}</span>
        <svg ref={svgRef}></svg>
      </section>
      <span className="horizontal">{secondColumn}</span>
    </div>
  );
};

export default LineChart;
