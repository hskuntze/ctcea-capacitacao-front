import { Instrutor } from "./instrutor";
import { LogisticasTreinamento } from "./logisticasTreinamento";
import { MaterialDidatico } from "./materialDidatico";
import { OM } from "./om";
import { Turma } from "./turma";

export type TreinamentoType = {
  id: number | null;
  sad: string;
  material: string;
  treinamento: string;
  tipo: number;
  subsistema: string;
  modalidade: number | string;
  brigada: string;
  om: OM;
  turmas: Turma[];
  executor: number;
  instituicao: string;
  dataInicio: string;
  dataFim: string;
  vagas: number;
  status: number;
  avaliacaoPratica: boolean;
  avaliacaoTeorica: boolean;
  certificado: boolean;
  logisticaTreinamento: string;
  nivelamento: boolean;
  descNivelamento: string;
  cargaHoraria: number;
  publicoAlvo: number;
  descricaoAtividade: string;
  observacoes: string;
  preRequisitos: string;
  instrutores: Instrutor[];
  materiaisDidaticos: MaterialDidatico[];
  logisticaTreinamentos: LogisticasTreinamento[];
};
