export function filter(objects, ...funcs) {
  if (!objects || !Array.isArray(objects)) return null;
  return objects.filter((object) => {
    return funcs.every((func) => {
      return func(object);
    });
  });
}

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
