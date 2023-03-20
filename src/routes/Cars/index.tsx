import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../context";
import useApi from "../../hooks/useApi";
import Car from "../../models/Car";
import NavBar from "../../widgets/NavBar";
import Styles from "./index.module.css";

export interface CarsProps {
  setPage: (page: string) => void;
  page: string;
}

export default function Cars(props: CarsProps) {
  const {
    state: { user },
  } = useGlobalState();
  const api = useApi();
  const [cars, setCars] = useState<Car[]>([]);

  const fetchCars = async () => {
    const result = await api.cars.search({});

    if (!result.ok) {
      alert("取得車輛資料失敗");
      return;
    }

    setCars(result.data);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  console.log(user);

  return (
    <div className={Styles.container}>
      <NavBar setPage={props.setPage} page={props.page} />
      <div className={Styles.pageContents}>
        <div className={Styles.cars}>
          {cars.map((c) => (
            <div
              key={c.uuid}
              className={classNames(Styles.car, {
                [Styles.userCar]: c.userUuid === user.uuid,
              })}
            >
              <div className={Styles.plate}>{c.plate}</div>
              <div className={Styles.owner}>{c.userUuid}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
