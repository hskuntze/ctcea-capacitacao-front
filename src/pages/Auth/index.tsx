import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Recover from "./Recover";
import EnviarEmail from "./EnviarEmail";

const Auth = () => {
  return (
    <section>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recuperarsenha/:token" element={<Recover />} />
        <Route path="/enviaremail" element={<EnviarEmail />} />
      </Routes>
    </section>
  );
};

export default Auth;
