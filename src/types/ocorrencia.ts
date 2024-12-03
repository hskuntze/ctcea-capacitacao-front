import { TreinamentoType } from "./treinamento";

export type OcorrenciaType = {
  id: number;
  titulo: string;
  descricaoOcorrencia: string;
  dataOcorrencia: string;
  tipoOcorrencia: number;
  descricaoTipoOutros: string;
  impactoOcorrencia: boolean;
  nivelImpacto: number;
  descricaoImpacto: string;
  statusClassificacao: number;
  solucaoAdotada: string;
  dataSolucao: string;
  nomeResponsavelSolucao: string;
  contatoResponsavelSolucao: string;
  instituicaoResponsavelSolucao: string;
  descricaoClassificacao: string;
  probabilidadeRecorrencia: number;
  descricaoLicoesAprendidas: string;
  nomeResponsavelOcorrencia: string;
  contatoResponsavelOcorrencia: string;
  instituicaoResponsavelOcorrencia: string;
  dataRegistro: string;
  observacoesGerais: string;
  treinamento: TreinamentoType;
};
