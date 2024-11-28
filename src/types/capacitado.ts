import { Posto } from "./posto";
import { TreinamentoType } from "./treinamento";

export type CapacitadoType = {
  id: number;
  tipo: number;
  nomeCompleto: string;
  nomeGuerra: string;
  email: string;
  celular: string;
  brigadaMilitar: string;
  /**
   * Instituição para o civil é a empresa, para o militar é a OM
   */
  instituicao: string;
  avaliacaoPratica: boolean;
  avaliacaoTeorica: boolean;
  exigeNotaPratica: boolean;
  exigeNotaTeorica: boolean;
  notaPratica: number;
  notaTeorica: number;
  turma: string;
  certificado: boolean;
  tipoCertificado: string[];
  numeroBi: string;
  observacoesAvaliacaoPratica: string;
  observacoesAvaliacaoTeorica: string;
  treinamento: TreinamentoType;
  posto: Posto;
  funcao: string;
};
