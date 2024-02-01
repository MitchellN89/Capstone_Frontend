import dayjs from "dayjs";
import { useState } from "react";

export function useTextInput(
  init = "",
  label = "Text Input",
  name,
  type = "text",
  placeholder = ""
) {
  const [value, setValue] = useState(init);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };

  const handleIsValid = (bool) => {
    setIsValid(bool);
  };

  const reset = () => {
    setValue(init);
  };

  const props = {
    label,
    name,
    value,
    onChange: handleChange,
    isValid,
    handleIsValid,
    type: type,
    placeholder,
  };

  return [props, isValid, reset, value];
}

export function useSelectInput(
  init = "",
  label = "Select",
  name,
  placeholder = ""
) {
  const [value, setValue] = useState(init);
  const [isValid, setIsValid] = useState(true);

  const handleIsValid = (bool) => {
    setIsValid(bool);
  };

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };

  const reset = () => {
    setValue(init);
  };

  const handleManualChange = (val) => {
    setValue(val);
  };

  const props = {
    label,
    name,
    value,
    onChange: handleChange,
    isValid,
    handleIsValid,
    placeholder,
  };

  return [props, isValid, reset, value, handleManualChange];
}

export function useDateTimeInput(init, label = "Date", name) {
  const [value, setValue] = useState(init ? dayjs(init) : null);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleIsValid = (bool) => {
    setIsValid(bool);
  };

  const reset = () => {
    setValue(init);
  };

  const props = {
    value,
    onChange: handleChange,
    handleIsValid,
    isValid,
    label,
    name,
  };

  return [props, isValid, reset, value];
}

export function useCustomComboInput(label) {
  const [value, setValue] = useState([]);

  const handleValue = (value) => {
    setValue(value);
  };

  const props = { value, handleValue, label };
  return [props, value];
}
