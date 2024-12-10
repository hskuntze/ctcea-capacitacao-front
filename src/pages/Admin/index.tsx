import "./styles.css";
import UsuarioList from "./List";
import { Route, Routes } from "react-router-dom";
import UsuarioForm from "./Form";
import UsuarioInspect from "./Inspect";

/**
 * Página de controle do administrador
 * Rota correspondente: /usuario
 * 
 * List: lista os registros do módulo
 * Form: formulário para registrar ou atualizar determinado registro baseado no ID
 * Inspect: exibe todas as informações do registro baseado no ID
 */
const Admin = () => {
  return (
    <Routes>
      <Route path="" element={<UsuarioList />} />
      <Route path=":id" element={<UsuarioForm />} />
      <Route path="/visualizar/:id" element={<UsuarioInspect />} />
    </Routes>
  );
};

export default Admin;
