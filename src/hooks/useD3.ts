import { useRef, useEffect } from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn: Function, depedencies: Array<any>) => {
  const ref = useRef();
  useEffect(() => {
    // renderChartFn(d3.select(ref.current));
    return () => {};
  }, depedencies);
};
