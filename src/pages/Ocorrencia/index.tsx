import { Route, Routes } from "react-router-dom";
import OcorrenciaList from "./List";
import OcorrenciaForm from "./Form";
import OcorrenciaInspect from "./Inspect";

/**
 * Página de controle do módulo de ocorrências
 * Rota correspondente: /ocorrencia
 * 
 * List: lista os registros do módulo
 * Form: formulário para registrar ou atualizar determinado registro baseado no ID
 * Inspect: exibe todas as informações do registro baseado no ID
 */
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
