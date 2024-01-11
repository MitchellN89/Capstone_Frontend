import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";

export function useInputData(init, patterns) {
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

export function useTextInput(
  init = "",
  label = "Text Input",
  name,
  type = "text",
  placeholder = "",
  addtionalPatterns,
  overWritePatterns
) {
  const [value, setValue] = useState(init);
  const [isValid, setIsValid] = useState(false);
  const [patterns, setPatterns] = useState([]);

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };

  const handleManualChange = (val) => {
    setValue(val);
  };

  const handleIsValid = (bool) => {
    setIsValid(bool);
  };

  const reset = () => {
    setValue(init);
  };

  const defaultPatterns = {
    text: [],
    name: [
      {
        type: "required",
        value: /^[a-zA-Z\s']+$/,
        message: "Only letters, spaces and apostrophes allowed",
        label: "validation_letters_spaces_apostrophes",
      },
    ],
    phoneNumber: [
      {
        type: "required",
        value: /^(\d|\-|#|ext|\+| )+$/,
        message: "Only numbers, dashes, hashes, pluses and 'ext' allowed",
        label: "validation_numbers_dashes_hashes_pluses_'ext'",
      },
    ],
    emailAddress: [],
    websiteUrl: [],
    password: [
      {
        type: "required",
        value: /[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]/,
        message: "Must contain at least one special character",
        label: "validation_special",
      },
      {
        type: "required",
        value: /.*[a-z].*/,
        message: "Must contain at least one lowercase letter",
        label: "validation_lowercase",
      },
      {
        type: "required",
        value: /.*[A-Z].*/,
        message: "Must contain at least one uppercase letter",
        label: "validation_uppercase",
      },
      {
        type: "required",
        value: /.*\d.*/,
        message: "Must contain at least one number",
        label: "validation_number",
      },
    ],
  };

  const types = {
    text: "text",
    name: "text",
    phoneNumber: "text",
    emailAddress: "email",
    websiteUrl: "url",
    password: "password",
  };

  useEffect(() => {
    console.log("useInputData > useTextInput > useEffect run");
    setPatterns([...defaultPatterns[type]]);
    if (
      Array.isArray(addtionalPatterns) &&
      typeof overWritePatterns === "boolean"
    ) {
      if (overWritePatterns) {
        setPatterns(addtionalPatterns);
      } else {
        setPatterns((cur) => [...cur, ...addtionalPatterns]);
      }
    }
  }, [addtionalPatterns]);

  const props = {
    label,
    name,
    value,
    onChange: handleChange,
    isValid,
    handleIsValid,
    patterns,
    type: types[type],
    placeholder,
  };

  return [props, isValid, reset, value, handleManualChange];
}

export function useAddressInput(init = "", label = "Address", name) {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState(init);
  const [coordinates, setCoordinates] = useState(null);
  const [selectionValue, setSelectionValue] = useState(null);
  const isValid = true;

  const handleCoordinates = async (address) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setCoordinates({ lat, lng });
    setSelectionValue(address);
  };

  const reset = () => {
    setInputValue(init);
  };

  useEffect(() => {
    setInputValue(init);
  }, [init]);

  useEffect(() => {
    if (value) {
      handleCoordinates(value.description);
    }
  }, [value]);

  const props = {
    value,
    setValue,
    inputValue,
    setInputValue,
    name,
    label,
    coordinates,
  };

  return [props, isValid, reset, selectionValue, coordinates];
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

export function useDateTimeInput(
  init,
  label = "Date",
  name,
  addtionalPatterns,
  overWritePatterns
) {
  const [value, setValue] = useState(init ? dayjs(init) : null);
  const [isValid, setIsValid] = useState(true);

  const handleValue = (newValue) => {
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
    onChange: handleValue,
    handleIsValid,
    label,
    name,
    addtionalPatterns,
    overWritePatterns,
  };

  return [props, isValid, reset, value];
}
