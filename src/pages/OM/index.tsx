import { Route, Routes } from "react-router-dom";
import OMList from "./List";
import OMForm from "./Form";

const OMs = () => {
  return (
    <Routes>
      <Route path="" element={<OMList />} />
      <Route path=":id" element={<OMForm />} />
    </Routes>
  );
};

export default OMs;
