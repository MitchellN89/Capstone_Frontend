import { useState } from "react";

export default function useInputData(init, patterns) {
  const [value, setValue] = useState(init);
  const [notValid, setNotValid] = useState(false);

  const handleChange = (evt) => {
    const val = evt.target.value;
    setValue(val);
  };

  const handleManualChange = (val) => {
    setValue(val);
  };

  const handleNotValid = (bool) => {
    setNotValid(bool);
  };

  const reset = () => {
    setValue("");
  };

  const props = {
    value,
    onChange: handleChange,
    notValid,
    patterns,
    handleNotValid,
  };

  return [value, props, notValid, reset, handleManualChange];
}
