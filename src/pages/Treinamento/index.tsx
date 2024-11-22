import { Route, Routes } from "react-router-dom";
import TreinamentoForm from "./Form";
import TreinamentoList from "./List";

const Treinamento = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<TreinamentoList />} />
        <Route path=":id" element={<TreinamentoForm />} />
      </Routes>
    </>
  );
};

export default Treinamento;
