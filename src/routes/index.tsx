import { RootRoute, Route, Router } from "@tanstack/router";
import Login from "./Login";
import Root from "./Root";
import Bookings from "./Bookings";
import Booking from "./Booking";

const rootRoute = new RootRoute();

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Root,
});

const loginRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "login",
  component: Login,
});

const bookingsRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "bookings",
  component: Bookings,
});

const bookingRoute = new Route({
  getParentRoute: () => bookingsRoute,
  path: "$uuid",
  component: Booking,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  bookingsRoute.addChildren([bookingRoute]),
]);

const router = new Router({ routeTree });

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

// export default <RouterProvider router={router} />;
