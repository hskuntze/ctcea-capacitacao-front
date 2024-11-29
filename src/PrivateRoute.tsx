import Denied from "components/Denied";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Perfil } from "types/perfil";
import { hasAnyRoles, isAuthenticated } from "utils/auth";

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
      toast.error("Token inválido ou expirado.");
      return <Navigate replace to="/sgc/login" state={{ from: location }} />;
    }
  
    if (isAuthenticated() && !hasRoles) {
      return <Denied />;
    }
  
    return children;
  };
  
  export default PrivateRoute;