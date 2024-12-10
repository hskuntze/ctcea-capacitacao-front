import { Route, Routes } from "react-router-dom";
import CapacitadoList from "./List";
import CapacitadoForm from "./Form";
import CapacitacaoInspect from "./Inspect";

/**
 * Página de controle do módulo de capacitados
 * Rota correspondente: /capacitado
 * 
 * List: lista os registros do módulo
 * Form: formulário para registrar ou atualizar determinado registro baseado no ID
 * Inspect: exibe todas as informações do registro baseado no ID
 */
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
