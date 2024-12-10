import AvaliacaoForm from "./Form";
import AvaliacaoInspect from "./Inspect";
import AvaliacaoList from "./List";
import "./styles.css";
import { Route, Routes } from "react-router-dom";

/**
 * Página de controle do módulo de avaliações
 * Rota correspondente: /avaliacao
 * 
 * List: lista os registros do módulo
 * Form: formulário para registrar ou atualizar determinado registro baseado no ID
 * Inspect: exibe todas as informações do registro baseado no ID
 */
const Avaliacao = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<AvaliacaoList />} />
        <Route path=":id" element={<AvaliacaoForm />} />
        <Route path="/visualizar/:id" element={<AvaliacaoInspect />} />
      </Routes>
    </>
  );
};

export default Avaliacao;
