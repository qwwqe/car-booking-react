import React from "react";

export interface MenuIconProps {
  className?: string;
}

export default function MenuIcon(props: MenuIconProps) {
  return (
    <svg
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={props.className}
    >
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
    </svg>
  );
}
