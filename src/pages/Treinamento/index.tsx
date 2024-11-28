import { Route, Routes } from "react-router-dom";
import TreinamentoForm from "./Form";
import TreinamentoList from "./List";
import TreinamentoInspect from "./Inspect";

const Treinamento = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<TreinamentoList />} />
        <Route path=":id" element={<TreinamentoForm />} />
        <Route path="/visualizar/:id" element={<TreinamentoInspect />} />
      </Routes>
    </>
  );
};

export default Treinamento;
