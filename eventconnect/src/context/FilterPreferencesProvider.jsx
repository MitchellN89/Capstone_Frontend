import { createContext, useContext, useEffect, useState } from "react";

const FilterPreferencesContext = createContext();

export function FilterPreferencesProvider({ children }) {
  const [eventNameFilterValue, setEventNameFilterValue] = useState([]);
  const [tagFilterValue, setTagFilterValue] = useState([]);
  const [addressFilterValue, setAddressFilterValue] = useState([]);
  const [serviceFilterValue, setServiceFilterValue] = useState([]);
  const [ignoredFilterValue, setIgnoredFilterValue] = useState(false);

  const resetFilters = () => {
    setEventNameFilterValue([]);
    setTagFilterValue([]);
    setServiceFilterValue([]);
    setAddressFilterValue([]);
    setIgnoredFilterValue(false);
  };

  const eventNameFilterProps = {
    label: "Event Name Search",
    value: eventNameFilterValue,
    setValue: setEventNameFilterValue,
  };

  const serviceFilterProps = {
    label: "Service Search",
    value: serviceFilterValue,
    setValue: setServiceFilterValue,
  };

  const tagFilterProps = {
    label: "Tag Search",
    value: tagFilterValue,
    setValue: setTagFilterValue,
  };

  const addressFilterProps = {
    label: "Address Search",
    value: addressFilterValue,
    setValue: setAddressFilterValue,
  };

  const ignoredFilterProps = {
    label: "Show Ignored",
    checked: ignoredFilterValue,
    setChecked: (evt) => {
      setIgnoredFilterValue(evt.target.checked);
    },
  };

  const context = {
    eventNameFilterProps,
    eventNameFilterValue,
    serviceFilterValue,
    serviceFilterProps,
    tagFilterProps,
    tagFilterValue,
    addressFilterProps,
    addressFilterValue,
    ignoredFilterValue,
    ignoredFilterProps,
    resetFilters,
  };

  return (
    <FilterPreferencesContext.Provider value={context}>
      {children}
    </FilterPreferencesContext.Provider>
  );
}

export function useFilterPreferencesContext() {
  const filterPreferencesContext = useContext(FilterPreferencesContext);
  return filterPreferencesContext;
}
