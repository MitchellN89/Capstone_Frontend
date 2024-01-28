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
    return servicesArr.includes(object.service.service);
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
