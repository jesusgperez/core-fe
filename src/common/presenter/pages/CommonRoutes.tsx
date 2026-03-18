import { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";
import Components from "./Components";


const CommonRoutes: RouteObject[] = [
  { path: "/components", element: <Components /> },
  { path: "*", element: <NotFound /> },
];

export { CommonRoutes };
