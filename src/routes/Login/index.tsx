import React, { useEffect, useState } from "react";
import Styles from "./index.module.css";
import useApi from "../../hooks/useApi";
import classNames from "classnames";
import { useGlobalState } from "../../context";
import { ActionType } from "../../context/reducer/actions";
import User from "../../models/User";

export interface LoginProps {
  setPage: (page: string) => void;
}

export default function Login(props: LoginProps) {
  const { dispatch, state } = useGlobalState();
  const api = useApi();

  console.log(state);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    api.auth.login(username, password).then((r) => {
      if (!r.ok) {
        alert("登入失敗");
        return;
      }

      dispatch({ type: ActionType.Login, user: r.data.user });
    });
  };

  const handleRegister: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    api.users.create(new User({ username, password }));
  };

  const handleRefresh: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    api.auth.refreshToken();
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.loginPanel}>
        <div className={Styles.carBookingTitle}>Car Booking</div>
        <form className={Styles.inputBlock}>
          <label className={Styles.inputField}>
            <span>Username</span>
            <input
              spellCheck="false"
              name="username"
              autoComplete="username"
              className={Styles.inputElement}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </label>
          <label className={Styles.inputField}>
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="password"
              className={Styles.inputElement}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </label>
          <div className={Styles.buttonBlock}>
            <button
              className={classNames(Styles.button, Styles.loginButton)}
              onClick={handleLogin}
            >
              登入
            </button>
            <button
              className={classNames(Styles.button, Styles.registerButton)}
              onClick={handleRegister}
            >
              註冊
            </button>
            <button
              className={classNames(Styles.button, Styles.registerButton)}
              onClick={handleRefresh}
            >
              更新
            </button>
            {/* <button className={Styles.registerButton} onClick={handleDog}>
              狗狗
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}
