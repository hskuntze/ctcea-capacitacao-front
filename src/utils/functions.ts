/**
 * Função que recebe uma data (em string) no formato 'yyyy-mm-dd' e formata para 'dd/mm/yyyy'
 * @param date - String
 * @returns String formatada
 */
export const formatarData = (date: string) => {
  const [year, month, day] = date.split("-"); // Divide a string em ano, mês e dia
  return `${day}/${month}/${year}`;
};

/**
 * Função que interpreta o tipo baseado no seu id e retorna o valor
 * @param tipo - Number
 * @returns tipo - String
 */
export const formatarTipo = (tipo: number) => {
  const tipos: { [key: number]: string } = {
    1: "Reciclagem",
    2: "Nova aquisição",
    3: "Atualização",
  };

  return tipos[tipo] || "Tipo inválido";
};

/**
 * Função que interpreta o status baseado no seu id e retorna o valor
 * @param stt - Number
 * @returns status - String
 */
export const formatarStatus = (stt: number) => {
  const status: { [key: number]: string } = {
    1: "Cancelada",
    2: "Realizada",
    3: "Adiada",
  };

  return status[stt] || "Status inválido";
};

/**
 * Função que interpreta o status baseado no seu id e retorna o valor
 * @param stt - String
 * @returns status - Number
 */
export const formatarInversoStatus = (stt: string): number => {
  const status: { [key: string]: number } = {
    "Cancelada": 1,
    "Realizada": 2,
    "Adiada": 3,
  };

  return status[stt] || -1;
};

/**
 * Função que interpreta a modalidade baseado no seu id e retorna o valor
 * @param stt - Number
 * @returns status - String
 */
export const formatarModalidade = (modalidade: number) => {
  const modalidades: { [key: number]: string } = {
    1: "Presencial",
    2: "EAD",
    3: "Híbrido",
  };

  return modalidades[modalidade] || "Modalidade inválida";
};

/**
 * Função que interpreta o público-alvo baseado no seu id e retorna o valor
 * @param stt - Number
 * @returns status - String
 */
export const formatarPublicoAlvo = (publicoAlvo: number) => {
  const publicosAlvo: { [key: number]: string } = {
    1: "Militar",
    2: "Civil",
    3: "Misto",
  };

  return publicosAlvo[publicoAlvo] || "Público-alvo inválida";
};

/**
 * Função que interpreta a avaliação baseado no valor da nota
 * @param nota
 * @returns avaliação - String
 */
export const formatarAvaliacao = (nota: number) => {
  const avaliacoes: { [key: number]: string } = {
    1: "Insatisfatório",
    2: "Regular",
    3: "Bom",
    4: "Muito bom",
    5: "Excelente",
  };

  return avaliacoes[nota] || "Nota inválida";
};

/**
 * Função que interpreta o tipo de ocorrência baseado no tipo numérico
 * @param tipo 
 * @returns tipo - String
 */
export const formatarTipoOcorrencia = (tipo: number) => {
  const tipos: { [key: number]: string } = {
    1: "Logística",
    2: "Técnica",
    3: "Organizacional",
    4: "Didática",
    5: "Outros",
  };

  return tipos[tipo] || "Tipo de ocorrência inválida";
};

/**
 * Função que interpreta o nível do impacto baseado no tipo numérico
 * @param nivel 
 * @returns nivel - String
 */
export const formatarNivelImpacto = (nivel: number) => {
  const niveis: { [key: number]: string } = {
    1: "Baixo",
    2: "Médio",
    3: "Alto",
  };

  return niveis[nivel] || "Nível de impacto inválido";
};

/**
 * Função que interpreta o status da ocorrência baseado no tipo numérico
 * @param status 
 * @returns status - String
 */
export const formatarStatusOcorrencia = (status: number) => {
  const statuses: { [key: number]: string } = {
    1: "Solucionado",
    2: "Em análise",
    3: "Pendente",
    4: "Não se aplica",
  };

  return statuses[status] || "Status de ocorrência inválido";
};

/**
 * Função que interpreta a probabilidade de recorrência da ocorrência baseado no tipo numérico
 * @param status 
 * @returns status - String
 */
export const formatarProbabilidadeRecorrencia = (probabilidade: number) => {
  const probabilidades: { [key: number]: string } = {
    1: "Baixa",
    2: "Média",
    3: "Alta",
  };

  return probabilidades[probabilidade] || "Status de ocorrência inválido";
};