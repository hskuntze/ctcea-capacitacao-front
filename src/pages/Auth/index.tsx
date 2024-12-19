import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Recover from "./Recover";
import EnviarEmail from "./EnviarEmail";

/**
 * Página de controle do login
 * Rota correspondente: / (quando não se está logado)
 * 
 * Login: tela de login
 * Recover: tela para realizar a troca da senha
 * EnviarEmail: tela para realizar o envio de e-mail para trocar a senha
 */
const Auth = () => {
  return (
    <section>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/recuperarsenha/:token" element={<Recover />} /> */}
        <Route path="/trocarsenha" element={<Recover />} />
        <Route path="/enviaremail" element={<EnviarEmail />} />
      </Routes>
    </section>
  );
};

export default Auth;
