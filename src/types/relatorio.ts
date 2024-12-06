import { CapacitadoType } from "./capacitado";
import { TreinamentoType } from "./treinamento";

export type RelatorioType = {
  treinamento: TreinamentoType & {
    capacitados: CapacitadoType[];
  };
  nomesCompletos: string;
};
