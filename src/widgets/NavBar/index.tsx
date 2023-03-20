import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import MenuIcon from "../../icons/menu";
import Styles from "./index.module.css";

export interface NavBarProps {
  page: string;
  setPage: (page: string) => void;
}

const PageStrings = new Map<string, string>([
  ["cars", "車輛列表"],
  ["bookings", "預約概覽"],
]);

export default function NavBar(props: NavBarProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownScrollHeight = useMemo(
    () => dropdownRef?.current?.scrollHeight || 0,
    [open]
  );

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (!dropdownRef?.current) {
        return;
      }

      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", cb);

    return () => document.removeEventListener("click", cb);
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.pageTitle}>
        {PageStrings.get(props.page) || "未知頁面"}
      </div>
      <div className={Styles.pageMenu}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <MenuIcon
            className={classNames(Styles.menuIcon, {
              [Styles.menuIconOpened]: open,
            })}
          />
        </div>
      </div>
      <nav
        ref={dropdownRef}
        className={classNames(Styles.dropdownMenu)}
        style={{ maxHeight: open ? dropdownScrollHeight : 0 }}
      >
        <ul className={classNames(Styles.innerDropdownMenu)}>
          {[...PageStrings.keys()].map((page) => (
            <li
              key={page}
              className={Styles.dropdownMenuItem}
              onClick={() => props.setPage(page)}
            >
              {PageStrings.get(page) || "未知頁面"}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
