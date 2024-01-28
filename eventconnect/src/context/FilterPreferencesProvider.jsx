import { createContext, useContext, useState } from "react";

const FilterPreferencesContext = createContext();

export function FilterPreferencesProvider({ children }) {
  const [eventNameFilterValue, setEventNameFilterValue] = useState([]);
  const [tagFilterValue, setTagFilterValue] = useState([]);
  const [addressFilterValue, setAddressFilterValue] = useState([]);

  const resetFilters = () => {
    setEventNameFilterValue([]);
    setTagFilterValue([]);
    setAddressFilterValue([]);
  };

  const eventNameFilterProps = {
    label: "Event Name Search",
    value: eventNameFilterValue,
    setValue: setEventNameFilterValue,
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

  const context = {
    eventNameFilterProps,
    eventNameFilterValue,
    tagFilterProps,
    tagFilterValue,
    addressFilterProps,
    addressFilterValue,
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
