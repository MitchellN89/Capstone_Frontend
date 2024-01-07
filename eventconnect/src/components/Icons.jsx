import { Icon } from "@iconify/react";

export function IconLoading({ style, ...others }) {
  return (
    <Icon
      style={{ marginLeft: "10px", ...style }}
      {...others}
      icon="eos-icons:bubble-loading"
    />
  );
}

export function IconSend({ style, ...others }) {
  return (
    <Icon style={{ marginLeft: "10px", ...style }} {...others} icon="bi:send" />
  );
}
