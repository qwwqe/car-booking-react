import React from "react";
import NavBar from "../../widgets/NavBar";
import Styles from "./index.module.css";

export interface BookingsProps {
  setPage: (page: string) => void;
  page: string;
}

export default function Bookings(props: BookingsProps) {
  return (
    <div className={Styles.container}>
      <NavBar setPage={props.setPage} page={props.page} />
      <div className={Styles.pageContents}>
        <div className={Styles.dateOverviewContainer}>
          <div className={Styles.dateOverview}></div>
        </div>
      </div>
    </div>
  );
}
