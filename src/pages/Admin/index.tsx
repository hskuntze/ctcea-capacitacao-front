import "./styles.css";
import UsuarioList from "./List";
import { Route, Routes } from "react-router-dom";
import UsuarioForm from "./Form";

const Admin = () => {
  return (
    <Routes>
      <Route path="" element={<UsuarioList />} />
      <Route path=":id" element={<UsuarioForm />} />
    </Routes>
  );
};

export default Admin;
