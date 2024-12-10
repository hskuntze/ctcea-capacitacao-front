import Navbar from "components/Navbar";
import Admin from "pages/Admin";
import Auth from "pages/Auth";
import Avaliacao from "pages/Avaliacao";
import Capacitado from "pages/Capacitado";
import Confirmar from "pages/Confirmar";
import Home from "pages/Home";
import NaoEncontrado from "pages/NaoEncontrado";
import Ocorrencia from "pages/Ocorrencia";
import Relatorio from "pages/Relatorio";
import Treinamento from "pages/Treinamento";
import PrivateRoute from "PrivateRoute";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { isAuthenticated } from "utils/auth";

/**
 * Componente que controla as rotas da aplicação.
 * O prefixo definido para as rotas é "/sgc".
 * Utiliza o BrowserRouter, comum para aplicações web 
 * e SPA (Single Page Applications), sendo capaz de 
 * gerenciar o histórico de navegação.
 */
const Routes = () => {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Navbar />}
      <main id="main">
        <Switch>
          <Route path="/" element={<Navigate to="/sgc" />} />
          <Route path="/sgc/*" element={<Auth />} />
          <Route path="/sgc/confirmado" element={<Confirmar />} />
          <Route path="/sgc/nao-encontrado" element={<NaoEncontrado />} />
          <Route
            path="/sgc"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/treinamento/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Treinamento />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/capacitado/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Capacitado />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/ocorrencia/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Ocorrencia />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/usuario/*"
            element={
              <PrivateRoute roles={[{ id: 1, autorizacao: "PERFIL_ADMIN" }]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/avaliacao/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Avaliacao />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/relatorio"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Relatorio />
              </PrivateRoute>
            }
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
