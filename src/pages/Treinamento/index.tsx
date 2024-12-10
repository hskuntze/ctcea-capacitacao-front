import { Route, Routes } from "react-router-dom";
import TreinamentoForm from "./Form";
import TreinamentoList from "./List";
import TreinamentoInspect from "./Inspect";

/**
 * Página de controle do módulo de treinamentos
 * Rota correspondente: /treinamento
 * 
 * List: lista os registros do módulo
 * Form: formulário para registrar ou atualizar determinado registro baseado no ID
 * Inspect: exibe todas as informações do registro baseado no ID
 */
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
