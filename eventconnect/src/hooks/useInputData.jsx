import { useState } from "react";

export default function useInputData(init) {
  const [value, setValue] = useState(init);

  const handleChange = (evt) => {
    const val = evt.target.value;
    setValue(val);
  };

  const reset = () => {
    setValue("");
  };

  return [value, handleChange, reset];
}
