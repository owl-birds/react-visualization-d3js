// data
let dataFinal = [
  { country: 1, GDP: 4323 },
  { country: 2, GDP: 3312 },
  { country: 3, GDP: 2354 },
  { country: 4, GDP: 6523 },
  { country: 5, GDP: 5343 },
  { country: 6, GDP: 9343 },
  { country: 7, GDP: 12340 },
  { country: 8, GDP: 8090 },
  { country: 9, GDP: 4678 },
];
const dataFinal2 = [
  { height: 150, weight: 50 },
  { height: 162, weight: 49 },
  { height: 156, weight: 60 },
  { height: 159, weight: 54 },
  { height: 152, weight: 51 },
  { height: 152, weight: 49 },
  { height: 152, weight: 69 },
  { height: 162, weight: 64 },
  { height: 142, weight: 49 },
  { height: 153, weight: 56 },
];
const dataFinal3 = [
  { time: 1, temperature: 55.5 },
  { time: 2, temperature: 24.5 },
  { time: 3, temperature: 27.5 },
  { time: 4, temperature: 31.5 },
  { time: 5, temperature: 21.5 },
  { time: 6, temperature: 15.5 },
  { time: 7, temperature: 35.5 },
];
const dataFinal4 = [
  { year: 2000, temperature: 55.5 },
  { year: 2001, temperature: 24.5 },
  { year: 2002, temperature: 45 },
  { year: 2003, temperature: 11.5 },
  { year: 2004, temperature: 21.5 },
  { year: 2005, temperature: 15.5 },
  { year: 2006, temperature: 35.5 },
];
import { useState } from "react";
// components
import SimpleBar from "./components/bar";
import TestD3 from "./components/test";
import ScatterPlot from "./components/scatter-plot";
import LineChart from "./components/line-chart";
import AreaChart from "./components/area-chart";

function App() {
  const [data, setData] = useState(dataFinal);
  const [data2, setData2] = useState(dataFinal2);
  const [data3, setData3] = useState(dataFinal3);
  const [data4, setData4] = useState(dataFinal4);
  return (
    <div className="App">
      <div className="TEST">
        <AreaChart
          data={data4}
          secondColumn={"year"}
          firstColumn={"temperature"}
          chartTitle={"Area CHART"}
          svgHeight={350}
          svgWidth={550}
          areaColor={"#ff7659"}
          areaOpacity={0.9}
          isTickSize={true}
          numericMaxMultiply={0.6}
          numericMinMultiply={1}
        />
      </div>
      <div className="TEST">
        <LineChart
          data={data3}
          secondColumn={"time"}
          firstColumn={"temperature"}
          chartTitle={"LINE CHART"}
          svgHeight={300}
          svgWidth={550}
          lineColor={"#472912"}
          lineWidth={2.5}
          isDot={true}
          domainMaxMultiplier={0.2}
          domainMinMultiplier={2}
          isTickSize={true}
        />
      </div>
      <div className="TEST">
        <ScatterPlot
          data={data2}
          chartTitle={"Scatter Plot"}
          secondColumn={"height"}
          firstColumn={"weight"}
          svgHeight={400}
          svgWidth={650}
          dotColor={"black"}
          // dotHoverColor={"green"}
          dotRadius={10}
          scatterPlotId={1}
          fontSizeHover={"0.8rem"}
        />
      </div>
      <div className="TEST">
        <SimpleBar
          categoricColumn={"country"}
          numericColumn={"GDP"}
          data={data}
          svgHeight={300}
          svgWidth={650}
          chartTitle={"Testing simple bar chart"}
          barsWrapperHeight={250}
          isShowValueTop={true}
          fontSizeHover={"0.8rem"}
          barPaddingInner={0.02}
          barPaddingOuter={0}
          // barColorHover={"black"}
          // barColor={"#574bd6"}
          // isTickHorizontal={true}
          // isTickVertical={true}
          // barsWrapperWidth={550}
          // valueTopPaddingBottom={30}
          // isDomainHorizontal={false}
          // isDomainVertical={false}
          // isHorizontalAxis={false}
          // isVerticalAxis={false}
          barId={1}
          isHorizontal={false}
        />
      </div>
      <div className="TEST">
        <SimpleBar
          categoricColumn={"country"}
          numericColumn={"GDP"}
          data={data}
          svgHeight={300}
          svgWidth={650}
          chartTitle={"Testing simple bar chart"}
          barsWrapperHeight={250}
          barPaddingInner={0}
          barPaddingOuter={0.1}
          // isShowValueTop={true}
          fontSizeHover={"0.9rem"}
          // barColorHover={"black"}
          // barColor={"#574bd6"}
          // isTickHorizontal={true}
          // isTickVertical={true}
          // barsWrapperWidth={550}
          // valueTopPaddingBottom={30}
          // isDomainHorizontal={false}
          // isDomainVertical={false}
          // isHorizontalAxis={false}
          // isVerticalAxis={false}
          barId={99999}
          // isHorizontal={false}
        />
      </div>
      <TestD3 />
    </div>
  );
}

export default App;
