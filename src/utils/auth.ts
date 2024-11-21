import { jwtDecode } from "jwt-decode";
import { TokenData } from "types/token";
import { getAuthData } from "./storage";
import { Perfil } from "types/perfil";

export const getTokenData = (): TokenData | undefined => {
  try {
    return jwtDecode(getAuthData().access_token) as TokenData;
  } catch (err) {
    return undefined;
  }
};

export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();
  return tokenData && tokenData.exp * 1000 > Date.now() ? true : false;
};

export const hasAnyRoles = (roles: Perfil[]): boolean => {
  const tokenData = getTokenData();

  if (tokenData !== undefined) {
    return roles.some((role) =>
      tokenData.authorities.includes(role.autorizacao)
    );
  }

  return false;
};
