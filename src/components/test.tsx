import React, { useEffect, useRef, useState } from "react";
import {
  axisLeft,
  axisBottom,
  max,
  select,
  selectAll,
  Selection,
  scaleLinear,
  scaleBand,
  easeBounce,
} from "d3";

const data = [
  { width: 40, height: 150, color: "red" },
  { width: 40, height: 150, color: "green" },
  { width: 40, height: 150, color: "blue" },
  { width: 40, height: 150, color: "neal" },
  { width: 40, height: 150, color: "magenta" },
];
let dataFinal = [
  { name: "a", number: 4323 },
  { name: "v", number: 3312 },
  { name: "c", number: 2354 },
  { name: "d", number: 6523 },
  { name: "e", number: 5343 },
  { name: "f", number: 9343 },
];
interface Row {
  name: string;
  number: number;
}

const TestD3 = () => {
  //   const svgRef = useRef<SVGSVGElement | null>(null);
  const [data2, setData2] = useState(dataFinal);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const contRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  //
  const WIDTH: number = 1000;
  const HEIGHT: number = 1000;
  const INNER_WIDTH: number = 500;
  const INNER_HEIGHT: number = 200;
  const padding_chart_x: number = 40;
  const padding_chart_y: number = 40;
  const MAX_VALUE: number | undefined = max(data2, (row) => row.number);
  // console.log("TEST.TSX MAX VALUE ", MAX_VALUE);
  // console.log(addRandom(data2, MAX_VALUE!));
  // console.log("did max value changed ", MAX_VALUE);
  // SCALING
  let yScale = scaleLinear().domain([0, MAX_VALUE!]).range([INNER_HEIGHT, 0]);
  // .range([0, INNER_HEIGHT]);
  let xScale = scaleBand()
    .domain(data2.map((row) => row.name))
    .range([0, INNER_WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.1);
  // AXIS ex: X and Y
  let yAxis = axisLeft(yScale)
    .ticks(4)
    .tickFormat((data) => `${data}$`);
  let xAxis = axisBottom(xScale);
  //
  const addRandom = () => {
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    let tempAlpha = alphabets[Math.floor(Math.random() * alphabets.length)];
    let isExist = data2.some((row) => row.name === tempAlpha);
    while (isExist) {
      tempAlpha = alphabets[Math.floor(Math.random() * alphabets.length)];
      isExist = data2.some((row) => row.name === tempAlpha);
    }
    const tempNumber = Math.floor(Math.random() * 10000) + 1;
    setData2((prevValue) => [
      ...prevValue,
      {
        name: tempAlpha,
        number: tempNumber,
      },
    ]);
  }; // only 26 bar can be rendered
  const removeLast = () => {
    setData2((prevValue) => prevValue.slice(0, prevValue.length - 1));
  };

  //
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      selection
        // .style("background-color", "#c9c9c9")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
      // axis
      const xAxisGroup = selection.append("g").attr("id", "x-axis");
      xAxisGroup
        .append("g")
        .call(xAxis)
        .attr(
          "transform",
          `translate(${padding_chart_x}, ${INNER_HEIGHT + padding_chart_y})`
        );

      const yAxisGroup = selection.append("g").attr("id", "y-axis");
      yAxisGroup
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${padding_chart_x}, ${padding_chart_y})`);
      // making border
      selection
        .append("g")
        .attr("stroke", "black")
        .append("rect")
        .attr("fill", "transparent")
        .attr("transform", `translate(${padding_chart_x}, ${padding_chart_y})`)
        .attr("width", INNER_WIDTH)
        .attr("height", INNER_HEIGHT);
      //
      const gGroup = selection
        .append("g")
        .attr("transform", `translate(${padding_chart_x}, ${padding_chart_y})`)
        .attr("width", INNER_WIDTH)
        .attr("height", INNER_HEIGHT)
        .attr("class", "bars-group");
      // trying to change bg color /// FAILED
      // gGroup
      //   .append("rect")
      //   .attr("fill", "#c9c9c9")
      //   .attr("width", "500px")
      //   .attr("height", "200px");
      //

      gGroup
        .selectAll("rect")
        .data(data2)
        .enter()
        .append("rect")
        .attr("width", xScale.bandwidth)
        // // transitrining to
        // .transition()
        // .duration(1000)
        // .ease(easeBounce)
        // //different positions
        .attr("x", (row) => {
          const xVal = xScale(row.name);
          if (xVal) {
            return xVal;
          }
          return null;
        })
        .attr("height", 0)
        // transitrining to
        .transition()
        .duration(1000)
        // .delay(500)
        .delay((_, idx) => idx * 100)
        .ease(easeBounce)
        //different positions
        .attr("height", (row: Row) => INNER_HEIGHT - yScale(row.number))
        .attr("y", (row) => yScale(row.number))
        // color to
        .attr("fill", "magenta")
        .transition()
        .duration(1000)
        .ease(easeBounce)
        // color
        .attr("fill", "teal");
    }
  }, [selection]);
  // UPDATING
  useEffect(() => {
    // UPDATEING
    // console.log("data updating");
    if (selection) {
      // SCALING
      yScale.domain([0, MAX_VALUE!]).range([INNER_HEIGHT, 0]);
      // .range([0, INNER_HEIGHT]);
      xScale.domain(data2.map((row) => row.name));
      selection.select("#x-axis").remove();
      selection.select("#y-axis").remove();
      // delete the current axis and after that add
      // the updated axis
      const xAxisGroup = selection.append("g").attr("id", "x-axis");
      xAxisGroup
        .append("g")
        .call(xAxis)
        .attr(
          "transform",
          `translate(${padding_chart_x}, ${INNER_HEIGHT + padding_chart_y})`
        );
      const yAxisGroup = selection.append("g").attr("id", "y-axis");
      yAxisGroup
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${padding_chart_x}, ${padding_chart_y})`);
      const rects = selection
        .select(".bars-group")
        .selectAll("rect")
        .data(data2);
      // updating bars
      // deleting bars that doesnt exist anymore in our data
      rects
        .exit()
        .transition()
        .duration(200)
        .attr("height", 0)
        .attr("y", INNER_HEIGHT)
        .remove();
      //
      // updating the chart to the current data
      rects
        .transition()
        .duration(200)
        .attr("width", xScale.bandwidth)
        .attr("height", (row: Row) => INNER_HEIGHT - yScale(row.number))
        .attr("x", (row) => {
          const xVal = xScale(row.name);
          if (xVal) {
            return xVal;
          }
          return null;
        })
        .attr("y", (row) => yScale(row.number))
        // .attr("fill", "magenta")
        .attr("fill", "teal"); // current bar
      //
      // below if we add another data to our chart
      rects
        .enter()
        .append("rect")
        .attr("width", xScale.bandwidth)
        .attr("x", (row) => {
          const xVal = xScale(row.name);
          if (xVal) {
            return xVal;
          }
          return null;
        })
        .attr("height", 0)
        // transitrining to
        .transition()
        .duration(1000)
        .ease(easeBounce)
        .delay(100)
        //different positions
        .attr("height", (row: Row) => INNER_HEIGHT - yScale(row.number))
        .attr("y", (row) => yScale(row.number))
        .attr("fill", "magenta")
        // color to
        .transition()
        .duration(500)
        .ease(easeBounce)
        // color
        .attr("fill", "teal");
    }
  }, [data2]);
  //
  useEffect(() => {
    if (!selection) {
      setSelection(() => select(svgRef.current));
    } else {
      const newGWrapper = selection
        .append("g")
        .attr("class", "newChartWrapper");
    }
  }, [selection]);

  //
  useEffect(() => {
    // console.log(count);
    // console.log("use effect will run, if the count value changed");
  }, [count]); // array of depedencies, will only run useEffect at the start or when the value in the array changed
  return (
    <div ref={contRef}>
      <button onClick={addRandom}>+</button>
      <button onClick={removeLast}>-</button>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TestD3;

// 1 select
// useEffect(() => {
//     // console.log(select(svgRef.current));
//     const svgCont = select(svgRef.current);
//     svgCont
//       .append("rect")
//       .attr("width", 100)
//       .attr("height", 100)
//       .attr("fill", "red");
//     // selectAll(".test")
//     //   .attr("width", 100)
//     //   .attr("height", 100)
//     //   .attr("fill", "blue")
//     //   .attr("x", (_, idx) => idx * 100);
//   }, []);
{
  /* <rect className="test"></rect>
        <rect className="test"></rect> */
}
// 2 JOINS DATA
// const [selection, setSelection] = useState<null | Selection<
//     null,
//     unknown,
//     null,
//     undefined
//   >>(null);
// if (!selection) {
//     setSelection(select(svgRef.current));
//   } else {
//     selection
//       .selectAll(".a2")
//       .data(data)
//       // .append("rect")
//       .attr("width", (row) => row.width)
//       .attr("height", (row) => row.height)
//       .attr("fill", (row) => row.color)
//       .attr("x", (row, idx) => 0 + idx * row.width)
//       .enter()
//       .append("rect")
//       .attr("width", (row) => row.width)
//       .attr("height", (row) => row.height)
//       .attr("fill", (row) => row.color)
//       .attr("x", (row, idx) => 0 + idx * row.width);
//     const rects2 = selection
//       .selectAll(".a1")
//       .data(data)
//       .attr("height", 20)
//       .attr("width", 50)
//       .attr("fill", (row) => row.color)
//       .attr("x", data.length * 40)
//       .attr("y", (row, idx) => 0 + idx * 20);
//     // what if there rent enoght dom
//     rects2
//       .enter()
//       .append("rect")
//       .attr("height", 20)
//       .attr("width", 50)
//       .attr("fill", (row) => row.color)
//       .attr("x", data.length * 40)
//       .attr("y", (row, idx) => 0 + idx * 20);
//   }, [selection]
{
  /* <rect className="a2"></rect>
        <rect className="a2"></rect>
        <rect className="a2"></rect>

        <rect className="a1"></rect>
        <rect className="a1"></rect>
        <rect className="a1"></rect> */
}
// 3
// .padding(0.3);
// console.log("y(0)", y(0));
// console.log("y(2305)", y(2305));
// console.log("y(8754)", y(8754)); // we  can scale down our number
