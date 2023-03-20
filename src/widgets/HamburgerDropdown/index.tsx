import React, { useState } from "react";
import MenuOption from "../../models/MenuOption";
import Styles from "./index.module.css";

export interface HamburgerDropdownProps {
  options: MenuOption[];
}

export default function HamburgerDropdown(props: HamburgerDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={Styles.container}>
      <div className={Styles.icon} />
    </div>
  );
}
