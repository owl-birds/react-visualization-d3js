import { useState, useRef, useEffect } from "react";
import {
  axisLeft,
  axisBottom,
  max,
  select,
  selectAll,
  Selection,
  scaleLinear,
  scaleBand,
  Axis,
  NumberValue,
  ScaleBand,
  ScaleLinear,
} from "d3";

// style
import "./bar.scss";

// interface Data {
// columnCategory: string;
// columnvalue: number;
// }

interface Props {
  data: Array<any>; // required
  svgWidth?: number;
  svgHeight?: number;
  barsWrapperWidth?: number;
  barsWrapperHeight?: number;
  categoricColumn: string; // required // categoric column must be unique
  numericColumn: string; // required
  isHorizontal?: boolean;
  paddingTopBar?: number;
  barColor?: string;
  barColorHover?: string;
  chartTitle?: string;
  tickPadding?: number;
  isTickHorizontal?: boolean;
  isTickVertical?: boolean;
  isShowValueTop?: boolean;
  isDomainHorizontal?: boolean;
  isDomainVertical?: boolean;
  isHorizontalAxis?: boolean;
  isVerticalAxis?: boolean;
  valueTopPaddingBottom?: number;
  barId: number;
}

const SimpleBar = (props: Props): JSX.Element => {
  const [data, setData] = useState<undefined | any[]>(props.data);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // VARS
  const { categoricColumn, numericColumn } = props;
  const MAX_VALUE: number = data ? max(data, (row) => row[numericColumn]) : 0;
  const svgWidth: number = props.svgWidth ? props.svgWidth : 700;
  const svgHeight: number = props.svgHeight ? props.svgHeight : 500;
  const barsWrapperWidth: number = props.barsWrapperWidth
    ? props.barsWrapperWidth
    : svgWidth - 100;
  const barsWrapperHeight: number = props.barsWrapperHeight
    ? props.barsWrapperHeight
    : svgHeight - 100;
  const isHorizontal: boolean =
    props.isHorizontal !== undefined ? props.isHorizontal : true;
  const paddingTopBar = props.paddingTopBar
    ? props.paddingTopBar
    : MAX_VALUE * 0.1;
  const barColor: string = props.barColor ? props.barColor : "#f5594e";
  const barColorHover: string = props.barColorHover
    ? props.barColorHover
    : "#f0483c";
  const chartTitle: string = props.chartTitle
    ? props.chartTitle
    : "CHART'S TITLE";
  const tickPadding: number = props.tickPadding ? props.tickPadding : 10;
  const tickSizeHorizontal: number = props.isTickHorizontal
    ? -barsWrapperWidth
    : 0;
  const tickSizeVertical: number = props.isTickVertical
    ? -barsWrapperHeight
    : 0;
  const isShowValueTop: boolean = props.isShowValueTop
    ? props.isShowValueTop
    : false;
  const valueTopPaddingBottom: number = props.valueTopPaddingBottom
    ? props.valueTopPaddingBottom
    : 5;
  const isDomainHorizontal: boolean =
    props.isDomainHorizontal !== undefined ? props.isDomainHorizontal : true;
  const isDomainVertical: boolean =
    props.isDomainVertical !== undefined ? props.isDomainVertical : true;
  const isHorizontalAxis: boolean =
    props.isHorizontalAxis !== undefined ? props.isHorizontalAxis : true;
  const isVerticalAxis: boolean =
    props.isVerticalAxis !== undefined ? props.isVerticalAxis : true;
  const barId: number = props.barId ? props.barId : 1;
  //

  if (isHorizontal && data) {
    // is horizontal
    // scale
    let horizontalScale: ScaleBand<string>; /*horizontal*/
    // | ScaleLinear<number, number, never>; /*vertical*/
    let verticalScale: ScaleLinear<number, number, never>; /*horizontal*/
    // | ScaleBand<string> /*vertical*/;
    // axis
    let horizontalAxis: Axis<string>; /*horizontal*/
    // | Axis<NumberValue> /*vertical*/;
    let verticalAxis: Axis<NumberValue>; /*horizontal*/
    // | Axis<string> /*vertical*/;
    // SCALE
    horizontalScale = scaleBand()
      .domain(data.map((row) => row[categoricColumn]))
      .range([0, barsWrapperWidth])
      .paddingInner(0.3)
      .paddingOuter(0.1);
    verticalScale = scaleLinear()
      .domain([0, MAX_VALUE + paddingTopBar])
      .range([barsWrapperHeight, 0]);
    // AXIS
    horizontalAxis = axisBottom(horizontalScale)
      .tickSize(tickSizeVertical)
      .tickPadding(tickPadding);
    verticalAxis = axisLeft(verticalScale)
      .ticks(8)
      .tickSize(tickSizeHorizontal)
      .tickPadding(tickPadding);
    //.tickFormat();
    // svg d3
    useEffect(() => {
      if (!selection) {
        setSelection(() => select(svgRef.current));
      } else {
        // creating tooltip
        const tooltip = select(`#simple-bar-${barId}`) // in the fuiture maybe will break something cause classname
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10") //An element with greater stack order is always in front of an element with a lower stack order.
          .style("visibility", "hidden")
          .style("background", "#4d4d4d")
          .style("padding", "5px")
          .style("font-weight", "bold")
          .style("color", "#fff")
          .text("tooltip template"); // is this best practice?
        // configuring svg
        selection
          .attr("width", svgWidth)
          .attr("height", svgHeight)
          .attr("class", "chart");
        // configuring chart box
        const chartBoxG = selection
          .append("g")
          .attr("class", "chart-box")
          // .attr("width", svgWidth)
          // .attr("height", svgHeight)
          .attr(
            "transform",
            `translate(${(svgWidth - barsWrapperWidth) / 2}, ${
              (svgHeight - barsWrapperHeight) / 2
            })`
          );
        // AXIS
        // configuring axis
        const horizontalAxisG = chartBoxG
          .append("g")
          .attr("class", "horizontal-axis");
        if (isHorizontalAxis) {
          horizontalAxisG
            .call(horizontalAxis)
            .attr("transform", `translate(0, ${barsWrapperHeight})`);
        }
        if (!isDomainHorizontal && isHorizontalAxis) {
          horizontalAxisG.select(".domain").remove();
        }
        const verticalAxisG = chartBoxG
          .append("g")
          .attr("class", "vertical-axis");
        if (isVerticalAxis) {
          verticalAxisG.call(verticalAxis);
        }
        if (!isDomainVertical && isVerticalAxis) {
          verticalAxisG.select(".domain").remove();
        }
        // configuring bars wrapper
        const barsWrapperG = chartBoxG
          .append("g")
          .attr("class", "bars-wrapper");
        // making the bar
        barsWrapperG
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("width", horizontalScale.bandwidth)
          .attr("x", (row) => {
            const xVal = horizontalScale(row[categoricColumn]);
            if (xVal) return xVal;
            return null;
          })
          .attr(
            "height",
            (row) => barsWrapperHeight - verticalScale(row[numericColumn])
          )
          .attr("y", (row) => verticalScale(row[numericColumn]))
          .attr("fill", barColor)
          .on("mouseover", (element, row) => {
            tooltip.style("visibility", "visible").text(row[numericColumn]);
            // .text(element.currentTarget.__data__[numericColumn]);
            return select(element.currentTarget).attr("fill", barColorHover);
          })
          .on("mousemove", (element) => {
            return tooltip
              .style("top", `${element.pageY + 10}px`)
              .style("left", `${element.clientX + 10}px`);
          })
          .on("mouseout", (element) => {
            tooltip.style("visibility", "hidden");
            return select(element.currentTarget).attr("fill", barColor);
          });

        // optionals, adding some mundane value on top of the bar
        if (isShowValueTop) {
          barsWrapperG
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-value")
            .text((row) => row[numericColumn])
            .attr("x", (row) => {
              const xVal: number | undefined = horizontalScale(
                row[categoricColumn]
              );
              if (xVal) return xVal + horizontalScale.bandwidth() / 2;
              return null;
            })
            .attr(
              "y",
              (row) => verticalScale(row[numericColumn]) - valueTopPaddingBottom
            )
            .style("font-size", "0.8rem")
            .style("text-anchor", "middle");
        }
      }
    }, [selection]);
  } else if (!isHorizontal && data) {
    // is not horizontal
    // scale
    let horizontalScale: // | ScaleBand<string> /*horizontal*/
    ScaleLinear<number, number, never>; /*vertical*/
    let verticalScale: // | ScaleLinear<number, number, never> /*horizontal*/
      ScaleBand<string> /*vertical*/;
    // axis
    let horizontalAxis: // | Axis<string> /*horizontal*/
      Axis<NumberValue> /*vertical*/;
    let verticalAxis: // | Axis<NumberValue> /*horizontal*/
      Axis<string> /*vertical*/;
    // SCALE
    horizontalScale = scaleLinear()
      .domain([0, MAX_VALUE + paddingTopBar])
      .range([0, barsWrapperWidth]);
    verticalScale = scaleBand()
      .domain(data.map((row) => row[categoricColumn]))
      .range([0, barsWrapperHeight])
      .paddingInner(0.3)
      .paddingOuter(0.1);
    // AXIS
    horizontalAxis = axisBottom(horizontalScale)
      .ticks(8)
      .tickSize(tickSizeVertical)
      .tickPadding(tickPadding);
    //.tickFormat();
    verticalAxis = axisLeft(verticalScale)
      .tickSize(tickSizeHorizontal)
      .tickPadding(tickPadding);
    // svg d3
    useEffect(() => {
      if (!selection) {
        setSelection(() => select(svgRef.current));
      } else {
        // creating tooltip
        const tooltip = select(`#simple-bar-${barId}`) // in the fuiture maybe will break something cause classname
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10") //An element with greater stack order is always in front of an element with a lower stack order.
          .style("visibility", "hidden")
          .style("background", "#4d4d4d")
          .style("padding", "5px")
          .style("font-weight", "bold")
          .style("color", "#fff")
          .text("tooltip template"); // is this best practice?
        // configuring svg
        selection
          .attr("width", svgWidth)
          .attr("height", svgHeight)
          .attr("class", "chart");

        // configuring chart box
        const chartBoxG = selection
          .append("g")
          .attr("class", "chart-box")
          // .attr("width", svgWidth)
          // .attr("height", svgHeight)
          .attr(
            "transform",
            `translate(${(svgWidth - barsWrapperWidth) / 2}, ${
              (svgHeight - barsWrapperHeight) / 2
            })`
          );
        // AXIS
        // configuring axis
        const horizontalAxisG = chartBoxG
          .append("g")
          .attr("class", "horizontal-axis");
        if (isHorizontalAxis) {
          horizontalAxisG
            .call(horizontalAxis)
            .attr("transform", `translate(0, ${barsWrapperHeight})`);
        }
        if (!isDomainHorizontal && isHorizontalAxis) {
          horizontalAxisG.select(".domain").remove();
        }
        const verticalAxisG = chartBoxG
          .append("g")
          .attr("class", "vertical-axis");
        if (isVerticalAxis) {
          verticalAxisG.call(verticalAxis);
        }
        if (!isDomainVertical && isVerticalAxis) {
          verticalAxisG.select(".domain").remove();
        }
        // configuring bars wrapper
        const barsWrapperG = chartBoxG
          .append("g")
          .attr("class", "bars-wrapper");
        // making the bar
        barsWrapperG
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("height", verticalScale.bandwidth)
          .attr("y", (row) => {
            const yVal = verticalScale(row[categoricColumn]);
            if (yVal) return yVal;
            return null;
          })
          .attr("width", (row) => horizontalScale(row[numericColumn]))
          .attr("fill", barColor)
          .on("mouseover", (element, row) => {
            tooltip.style("visibility", "visible").text(row[numericColumn]);
            return select(element.currentTarget).attr("fill", barColorHover);
          })
          .on("mousemove", (element) => {
            return tooltip
              .style("top", `${element.pageY + 10}px`)
              .style("left", `${element.clientX + 10}px`);
          })
          .on("mouseout", (element) => {
            tooltip.style("visibility", "hidden");
            return select(element.currentTarget).attr("fill", barColor);
          });
        if (isShowValueTop) {
          barsWrapperG
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((row) => row[numericColumn])
            .attr("y", (row) => {
              const yVal = verticalScale(row[categoricColumn]);
              if (yVal) return yVal + verticalScale.bandwidth() / 2;
              return null;
            })
            .attr(
              "x",
              (row) =>
                horizontalScale(row[numericColumn]) + valueTopPaddingBottom
            )
            .style("font-size", "0.8rem");
        }
      }
    }, [selection]);
  }

  return (
    <div className="simple-bar" id={`simple-bar-${barId}`}>
      <h4>{chartTitle}</h4>
      <section className="chart-wrapper">
        <span className="vertical">
          {isHorizontal ? numericColumn : categoricColumn}
        </span>
        <svg ref={svgRef}></svg>
      </section>
      <span className="horizontal">
        {isHorizontal ? categoricColumn : numericColumn}
      </span>
    </div>
  );
};

export default SimpleBar;

// trash
// // scale
// let horizontalScale: ScaleBand<string>; /*horizontal*/
// // | ScaleLinear<number, number, never>; /*vertical*/
// let verticalScale: ScaleLinear<number, number, never>; /*horizontal*/
// // | ScaleBand<string> /*vertical*/;
// // axis
// let horizontalAxis: Axis<string>; /*horizontal*/
// // | Axis<NumberValue> /*vertical*/;
// let verticalAxis: Axis<NumberValue>; /*horizontal*/
// // | Axis<string> /*vertical*/;
