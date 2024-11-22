import Navbar from "components/Navbar";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Treinamento from "pages/Treinamento";
import PrivateRoute from "PrivateRoute";
import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { isAuthenticated } from "utils/auth";
import { AuthContext } from "utils/contexts/AuthContext";

const Routes = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const { authContextData, setAuthContextData } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthContextData({
        authenticated: true,
      });
      setIsUserAuthenticated(true);
    }
  }, [authContextData.authenticated, setAuthContextData]);

  return (
    <BrowserRouter>
      {isUserAuthenticated && <Navbar />}
      <main id="main">
        <Switch>
          <Route path="/" element={<Navigate to="/sgc" />} />
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
          <Route path="/sgc/login" element={<Auth />} />
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
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
