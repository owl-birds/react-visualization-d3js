import { useState } from "react";

export const useLocalStorage = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  return [value, setValue];
};
