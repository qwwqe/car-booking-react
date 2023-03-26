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
  // const [fetched, setFetched] = useState(false);
  const [newCarPlate, setNewCarPlate] = useState("");

  const fetchCars = async () => {
    const result = await api.cars.search({});

    if (!result.ok) {
      alert("取得車輛資料失敗");
      return;
    }

    // setFetched(true);
    setCars(result.data);
  };

  const handleCreateCar = async () => {
    const result = await api.cars.create(
      new Car({
        userUuid: user.uuid,
        plate: newCarPlate,
      })
    );

    if (!result.ok) {
      alert("註冊車輛失敗");
      return;
    }

    fetchCars();
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // useEffect(() => {
  //   if (fetched && !cars.length) {
  //   }
  // }, [fetched, cars]);

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
        <div className={Styles.createCar}>
          <div className={Styles.createCarTitle}>註冊新車</div>
          <input
            value={newCarPlate}
            onChange={(e) => {
              setNewCarPlate(e.target.value);
            }}
            className={Styles.createCarInput}
          />
          <button onClick={() => handleCreateCar()}>註冊</button>
        </div>
      </div>
    </div>
  );
}
