// filter function accepts an array of objects and then any amount of functions
export function filter(objects, ...funcs) {
  if (!objects || !Array.isArray(objects)) return null;
  // filter the given array of objects and test the passed in funcs. If all funcs return true, the item is added in the filter
  return objects.filter((object) => {
    return funcs.every((func) => {
      return func(object);
    });
  });
}

// below are all the funcs that are passed into the filter function
// each function accepts a value, usually an array. this array contains search criteria such as an array of services.
// the function returns a new function with the hardcoded parameter from it's parent function built in.
// when filter iterates over the objects array, each object is passed into all param functions in order.
// these functions test for matches using the hardcoded param from the parent filter. if matches occur, the function returns true and the next function in line runs.
// if all funcs return true (utilizing array.every), that particular object is deemed correct to show as according to the filter

export function matchServiceV(servicesArr) {
  return function (object) {
    if (servicesArr.length === 0) return true;
    for (let service of servicesArr) {
      if (service.service == object.service.service) return true;
    }

    return false;
  };
}

export function matchEventNameEP(eventNamesArr) {
  return function (object) {
    if (eventNamesArr.length === 0) return true;
    return eventNamesArr.every((eventName) => {
      return object.eventName.toUpperCase().includes(eventName.toUpperCase());
    });
  };
}

export function matchEventNameV(eventNamesArr) {
  return function (object) {
    if (eventNamesArr.length === 0) return true;
    return eventNamesArr.every((eventName) => {
      return object.event.eventName
        .toUpperCase()
        .includes(eventName.toUpperCase());
    });
  };
}

export function matchAddressEP(addressesArr) {
  return function (object) {
    if (addressesArr.length === 0) return true;
    return addressesArr.every((address) => {
      if (!object.address) return false;
      return object.address.toUpperCase().includes(address.toUpperCase());
    });
  };
}

export function matchAddressV(addressesArr) {
  return function (object) {
    if (addressesArr.length === 0) return true;
    return addressesArr.every((address) => {
      if (!object.event.address) return false;
      return object.event.address.toUpperCase().includes(address.toUpperCase());
    });
  };
}

export function matchTagV(tagsArr) {
  return function (object) {
    if (tagsArr.length === 0) return true;
    return tagsArr.every((tag) => {
      if (!object.tags) return false;

      return object.tags.toUpperCase().includes(tag.toUpperCase());
    });
  };
}

export function matchIgnoredV(ignoredValue) {
  return function (object) {
    if (
      !object.vendorEventConnections ||
      object.vendorEventConnections.length == 0
    )
      return true;

    const objectIsIgnored =
      object.vendorEventConnections[0].vendorStatus == "ignore";
    if (!objectIsIgnored) return true;
    return objectIsIgnored == ignoredValue;
  };
}
