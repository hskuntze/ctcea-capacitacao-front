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