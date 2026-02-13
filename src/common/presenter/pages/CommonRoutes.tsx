import { RouteObject } from "react-router-dom";
import NotFound from "./NotFound";


const CommonRoutes: RouteObject[] = [
  { path: "*", element: <NotFound /> },
];

export { CommonRoutes };
