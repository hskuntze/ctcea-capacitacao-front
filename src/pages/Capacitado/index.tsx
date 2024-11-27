import { Route, Routes } from "react-router-dom";
import CapacitadoList from "./List";
import CapacitadoForm from "./Form";

const Capacitado = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<CapacitadoList />} />
        <Route path=":id" element={<CapacitadoForm />} />
      </Routes>
    </>
  );
};

export default Capacitado;
