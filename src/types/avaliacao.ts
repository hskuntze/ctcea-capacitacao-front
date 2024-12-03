import { TreinamentoType } from "./treinamento";

export type AvaliacaoType = {
  id: number;
  qualidadeMaterial: number;
  apostilaObjetiva: number;
  apostilaAtualizada: number;
  questoesRelacionadas: number;
  questoesClaras: number;
  avaliacaoGeralTreinamento: number;
  abrangeuTodosObjetivos: number;
  treinamento: TreinamentoType;
  nomeResponsavel: string;
  funcaoResponsavel: string;
  comentariosSugestoes: string;
};
