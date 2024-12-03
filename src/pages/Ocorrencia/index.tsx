import { Route, Routes } from "react-router-dom";
import OcorrenciaList from "./List";
import OcorrenciaForm from "./Form";

const Ocorrencia = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<OcorrenciaList />} />
        <Route path=":id" element={<OcorrenciaForm />} />
      </Routes>
    </>
  );
};

export default Ocorrencia;
