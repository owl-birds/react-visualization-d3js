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

import { useState } from "react";
// components
import SimpleBar from "./components/bar";
import TestD3 from "./components/test";
import ScatterPlot from "./components/scatter-plot";

function App() {
  const [data, setData] = useState(dataFinal);
  const [data2, setData2] = useState(dataFinal2);
  return (
    <div className="App">
      <div className="TEST">
        <ScatterPlot
          data={data2}
          secondColumn={"height"}
          firstColumn={"weight"}
          svgHeight={400}
          svgWidth={650}
          dotColor={"black"}
          // dotHoverColor={"green"}
          dotRadius={10}
          scatterPlotId={1}
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
          isShowValueTop={true}
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
