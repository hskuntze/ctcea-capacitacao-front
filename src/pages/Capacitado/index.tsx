import { Route, Routes } from "react-router-dom";
import CapacitadoList from "./List";
import CapacitadoForm from "./Form";
import CapacitacaoInspect from "./Inspect";

const Capacitado = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<CapacitadoList />} />
        <Route path=":id" element={<CapacitadoForm />} />
        <Route path="/visualizar/:id" element={<CapacitacaoInspect />} />
      </Routes>
    </>
  );
};

export default Capacitado;
