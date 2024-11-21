import { Perfil } from "./perfil";

export type User = {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  habilitado: boolean;
  registroCompleto: boolean;
  perfis: Perfil[];
};
