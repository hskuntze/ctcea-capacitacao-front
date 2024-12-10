import { OM } from "./om";
import { Perfil } from "./perfil";
import { Posto } from "./posto";

export type User = {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  nomeGuerra: string | null;
  tipo: number;
  identidade: string;
  instituicao: string;
  telefone: string;
  habilitado: boolean;
  registroCompleto: boolean;
  perfis: Perfil[];
  posto: Posto;
  brigada: string;
  om: OM;
  funcao: string;
};
