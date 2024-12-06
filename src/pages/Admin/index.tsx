import "./styles.css";
import UsuarioList from "./List";
import { Route, Routes } from "react-router-dom";
import UsuarioForm from "./Form";
import UsuarioInspect from "./Inspect";

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
