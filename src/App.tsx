import React, { useEffect, useMemo, useState } from "react";
import Login from "./routes/Login";
import Booking from "./routes/Booking";
import Bookings from "./routes/Bookings";
import Root from "./routes/Root";
import { GlobalStateProvider, useGlobalState } from "./context";
import Cars from "./routes/Cars";
import { ActionType } from "./context/reducer/actions";

enum Page {
  Login = "login",
  Bookings = "bookings",
  Booking = "booking",
  Cars = "cars",
  Root = "root",
}

function _App() {
  const [page, setPage] = useState<string>(Page.Login);
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    dispatch({ type: ActionType.LoginFromStorage });
  }, []);

  useEffect(() => {
    if (state.loggedIn && page === Page.Login) {
      setPage("cars");
    }
  }, [state.loggedIn, page]);

  const renderedPage = useMemo<JSX.Element>(() => {
    switch (page) {
      case Page.Login:
        return <Login setPage={setPage} />;
      case Page.Booking:
        return <Booking setPage={setPage} />;
      case Page.Bookings:
        return <Bookings setPage={setPage} page={page} />;
      case Page.Root:
        return <Root />;
      case Page.Cars:
        return <Cars setPage={setPage} page={page} />;
      default:
        return <></>;
    }
  }, [page]);

  return renderedPage;
}

export default function App() {
  return (
    <GlobalStateProvider>
      <_App />
    </GlobalStateProvider>
  );
}
