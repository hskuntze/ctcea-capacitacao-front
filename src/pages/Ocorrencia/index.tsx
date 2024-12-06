import { Route, Routes } from "react-router-dom";
import OcorrenciaList from "./List";
import OcorrenciaForm from "./Form";
import OcorrenciaInspect from "./Inspect";

const Ocorrencia = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<OcorrenciaList />} />
        <Route path=":id" element={<OcorrenciaForm />} />
        <Route path="/visualizar/:id" element={<OcorrenciaInspect />} />
      </Routes>
    </>
  );
};

export default Ocorrencia;
