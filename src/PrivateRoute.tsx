import Denied from "components/Denied";
import { Navigate, useLocation } from "react-router-dom";
import { Perfil } from "types/perfil";
import { hasAnyRoles, isAuthenticated } from "utils/auth";

/**
 * Componente de segurança que é capaz de limitar os acessos
 * a determinadas páginas da aplicação. Recebe dois argumentos:
 * - children: JSX.Element >> componente que será exibido em tela
 * - roles: Array<Perfil> >> array de perfis que podem acessar 'children'
 * 
 * Utiliza as funções "hasAnyRoles" e "isAuthenticated" para fazer este controle.
 */
const PrivateRoute = ({
    children,
    roles,
  }: {
    children: JSX.Element;
    roles: Array<Perfil>;
  }) => {
    let location = useLocation();
  
    const hasRoles = hasAnyRoles(roles);
  
    if (!isAuthenticated()) {
      return <Navigate replace to="/sgc/login" state={{ from: location }} />;
    }
  
    if (isAuthenticated() && !hasRoles) {
      return <Denied />;
    }
  
    return children;
  };
  
  export default PrivateRoute;