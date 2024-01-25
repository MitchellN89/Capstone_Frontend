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

export function IconSend({ height, style, ...others }) {
  return (
    <Icon
      height={height || "25px"}
      style={{ marginLeft: "10px", ...style }}
      {...others}
      icon="bi:send"
    />
  );
}

export function IconDelete({ height, style, ...others }) {
  return (
    <Icon
      height={height || "25px"}
      style={{ ...style }}
      {...others}
      icon="typcn:delete"
    />
  );
}

export function IconCreate({ height, style, ...others }) {
  return (
    <div>
      <Icon
        display="inline-block"
        height={height || "25px"}
        style={{ ...style }}
        {...others}
        icon="ion:create-sharp"
      />
    </div>
  );
}

export function IconBack({ height, style, ...others }) {
  return (
    <div>
      <Icon
        display="inline-block"
        height={height || "25px"}
        style={{ ...style }}
        {...others}
        icon="icon-park-solid:back"
      />
    </div>
  );
}

export function IconEdit({ height, style, ...others }) {
  return (
    <div>
      <Icon
        display="inline-block"
        height={height || "25px"}
        style={{ ...style }}
        {...others}
        icon="mdi:edit"
      />
    </div>
  );
}

export function IconRefresh({ height, style, ...others }) {
  return (
    <div>
      <Icon
        display="inline-block"
        height={height || "25px"}
        style={{ ...style }}
        {...others}
        icon="ic:baseline-refresh"
      />
    </div>
  );
}

export function IconBroadcast({ height, style, ...others }) {
  return (
    <div>
      <Icon
        display="inline-block"
        height={height || "25px"}
        style={{ ...style }}
        {...others}
        icon="ph:broadcast-bold"
      />
    </div>
  );
}
