export function debouncer(func, timeout) {
  let timer;
  return function () {
    const args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(
      (args) => {
        func.apply(this, args);
      },
      timeout,
      args
    );
  };
}
