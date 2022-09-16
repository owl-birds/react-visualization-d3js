import { useState, useRef, useEffect } from "react";
import "./scatter-plot.scss";

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
  ScaleBand,
  ScaleLinear,
  extent,
} from "d3";

interface Props {
  data: Array<any>; // required
  svgWidth?: number;
  svgHeight?: number;
  barsWrapperWidth?: number;
  barsWrapperHeight?: number;
  secondColumn: string; // required // categoric column must be unique
  firstColumn: string; // required
  dotColor?: string;
  dotHoverColor?: string;
  chartTitle?: string;
  tickPadding?: number;
  dotRadius?: number;
  dotOpacity?: number;
  domainMinMultiplier?: number;
  domainMaxMultiplier?: number;
  scatterPlotId: number;
}

const ScatterPlot = (props: Props) => {
  //   setting up react stuffs
  const [data, setData] = useState<undefined | any[]>(props.data);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  // VARS
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
  // chart's related
  const svgWidth: number = props.svgWidth ? props.svgWidth : 700;
  const svgHeight: number = props.svgHeight ? props.svgHeight : 500;
  const barsWrapperWidth: number = props.barsWrapperWidth
    ? props.barsWrapperWidth
    : svgWidth - 100;
  const barsWrapperHeight: number = props.barsWrapperHeight
    ? props.barsWrapperHeight
    : svgHeight - 100;
  const dotColor: string = props.dotColor ? props.dotColor : "teal";
  const dotHoverColor: string = props.dotHoverColor
    ? props.dotHoverColor
    : "red";
  const chartTitle = props.chartTitle ? props.chartTitle : "CHART'S TITLE";
  const tickPadding: number = props.tickPadding ? props.tickPadding : 10;
  const dotRadius: number = props.dotRadius ? props.dotRadius : 5;
  const dotOpacity: number = props.dotOpacity ? props.dotOpacity : 0.4;
  const domainMinMultiplier: number = props.domainMinMultiplier
    ? props.domainMinMultiplier
    : 0.01;
  const domainMaxMultiplier: number = props.domainMaxMultiplier
    ? props.domainMaxMultiplier
    : 0.01;
  const scatterPlotId: number = props.scatterPlotId ? props.scatterPlotId : 1;
  //

  // SCALE
  let horizontalScale: ScaleLinear<number, number, never>;
  let verticalScale: ScaleLinear<number, number, never>;
  // AXIS
  let horizontalAxis: Axis<NumberValue>;
  let verticalAxis: Axis<NumberValue>;
  //
  if (data) {
    // setting up the scale
    horizontalScale = scaleLinear()
      .domain([
        MIN_VALUE_SECOND - MIN_VALUE_SECOND * domainMinMultiplier,
        MAX_VALUE_SECOND + MAX_VALUE_SECOND * domainMaxMultiplier,
      ])
      .range([0, barsWrapperWidth])
      .nice();
    verticalScale = scaleLinear()
      .domain([
        MIN_VALUE_FIRST - MIN_VALUE_FIRST * domainMinMultiplier,
        MAX_VALUE_FIRST + MAX_VALUE_FIRST * domainMaxMultiplier,
      ])
      .range([barsWrapperHeight, 0])
      .nice();
    //   setting up the axis
    horizontalAxis = axisBottom(horizontalScale)
      .tickSize(0)
      .tickPadding(tickPadding);
    verticalAxis = axisLeft(verticalScale)
      // .ticks(8)
      .tickSize(0)
      .tickPadding(tickPadding);
  }

  // manipulating the svg
  useEffect(() => {
    if (!selection) {
      setSelection(() => select(svgRef.current));
    } else {
      // creating tooltip
      const tooltip = select(`#scatter-plot-${scatterPlotId}`) // in the fuiture maybe will break something cause classname
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10") //An element with greater stack order is always in front of an element with a lower stack order.
        .style("visibility", "hidden")
        .style("background", "#4d4d4d")
        .style("padding", "5px")
        .style("font-weight", "bold")
        .style("color", "#fff")
        .text("tooltip template"); // is this best practice?
      // setting up the svg
      selection
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "chart");
      // configuring chart box
      const chartBoxG: Selection<SVGGElement, unknown, null, undefined> =
        selection
          .append("g")
          .attr("class", "chart-box")
          .attr(
            "transform",
            `translate(${(svgWidth - barsWrapperWidth) / 2}, ${
              (svgHeight - barsWrapperHeight) / 2
            })`
          );
      // configuriong the axis
      const horizontalAxisG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG
          .append("g")
          .attr("class", "horizontal-axis")
          .call(horizontalAxis)
          .attr("transform", `translate(0, ${barsWrapperHeight})`);
      const verticalAxisG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG.append("g").attr("class", "vertical-axis").call(verticalAxis);
      // MAKING THE SCATTERED DOTS or PLOTTING
      const plotWrapperG: Selection<SVGGElement, unknown, null, undefined> =
        chartBoxG.append("g").attr("class", "plot-wrapper");
      if (data) {
        const dots = plotWrapperG
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", dotRadius)
          .attr("opacity", dotOpacity)
          .attr("cx", (row) => horizontalScale(row[secondColumn]))
          .attr("cy", (row) => verticalScale(row[firstColumn]))
          .attr("fill", dotColor)
          .on("mouseover", (element, row) => {
            tooltip
              .style("visibility", "visible")
              .text(`${row[secondColumn]}, ${row[firstColumn]}`);
            // .text(element.currentTarget.__data__[numericColumn]);
            return select(element.currentTarget).attr("fill", dotHoverColor);
          })
          .on("mousemove", (element) => {
            return tooltip
              .style("top", `${element.pageY + 10}px`)
              .style("left", `${element.clientX + 10}px`);
          })
          .on("mouseout", (element) => {
            tooltip.style("visibility", "hidden");
            return select(element.currentTarget).attr("fill", dotColor);
          });
        // dots // to show the data when we hovering on the dot
        //   .append("title")
        //   .text((row) => `${row[secondColumn]}, ${row[firstColumn]}`);
      }
    }
  }, [selection]);
  return (
    <div className="scatter-plot" id={`scatter-plot-${scatterPlotId}`}>
      <h4>{chartTitle}</h4>
      <section className="chart-wrapper">
        <span className="vertical">{firstColumn}</span>
        <svg ref={svgRef}></svg>
      </section>
      <span className="horizontal">{secondColumn}</span>
    </div>
  );
};

export default ScatterPlot;
