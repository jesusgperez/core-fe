import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";


const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />}/>
    </Routes>
  )
}

export { CommonRoutes }
