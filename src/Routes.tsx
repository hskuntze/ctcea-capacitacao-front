import Navbar from "components/Navbar";
import Admin from "pages/Admin";
import Auth from "pages/Auth";
import Capacitado from "pages/Capacitado";
import Confirmar from "pages/Confirmar";
import Home from "pages/Home";
import Ocorrencia from "pages/Ocorrencia";
import Treinamento from "pages/Treinamento";
import PrivateRoute from "PrivateRoute";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { isAuthenticated } from "utils/auth";

const Routes = () => {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Navbar />}
      <main id="main">
        <Switch>
          <Route path="/" element={<Navigate to="/sgc" />} />
          <Route path="/sgc/*" element={<Auth />} />
          <Route path="/sgc/confirmado" element={<Confirmar />} />
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
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                ]}
              >
                <Admin />
              </PrivateRoute>
            }
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
