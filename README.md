# SGC - Sistema de Gestão de Capacitação

O SGC é uma aplicação desenvolvida para facilitar a gestão de capacitações, permitindo o gerenciamento eficiente de treinamentos, capacitados, ocorrências, avaliação dos treinamentos e relatórios.
O sistema oferece uma interface intuitiva e funcionalidades avançadas como geração de gráficos, autenticação JWT e exportação de dados para Excel.

---

## 🚀 Tecnologias utilizadas

- **React**: versão 18
- **Node.js**: versão 22
- **Create React App**: base para iniciar o projeto
- **Typescript**: superset do Javascript para utilizar tipos garantindo mais segurança para o código

### Bibliotecas principais

| Biblioteca              | Versão   | Finalidade                                       |
|-------------------------|----------|--------------------------------------------------|
| **ApexCharts**          | ^4.1.0   | Gráficos interativos                             |
| **Axios**               | ^1.7.7   | Comunicação com APIs                             |
| **Bootstrap**           | ^5.3.3   | Estilização e design responsivo                  |
| **Day.js**              | ^1.11.13 | Manipulação de datas                             |
| **jsPDF**               | ^2.5.2   | Geração de arquivos PDF                          |
| **jwt-decode**          | ^4.0.0   | Decodificação de tokens JWT                      |
| **qs**                  | ^6.13.1  | Manipulação de queries                           |
| **Sass**                | ^1.81.0  | Pré-processamento de CSS                         |
| **@mui/material**       | ^6.1.8   | Componentes de UI do Material-UI                 |
| **@mui/x-date-pickers** | ^7.22.3  | Seleção de datas                                 |
| **XLSX**                | ^0.18.5  | Exportação de dados para Excel                   |

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- Node.js (versão 22 ou superior)
- Gerenciador de pacotes (npm ou yarn)
- Navegador atualizado

## 📂 Estrutura do projeto

src/
├── assets/          # Recursos da aplicação (fontes, imagens e estilos)
├── components/      # Componentes reutilizáveis
├── pages/           # Páginas principais da aplicação
├── types/           # Tipagens que a aplicação usa
├── utils/           # Funções utilitárias
└── App.tsx          # Componente raiz da aplicação

## 📦 Instalação

1. Clone o repositório e acesse a pasta do clone (cd ctcea-capacitacao-front):
--> https://github.com/hskuntze/ctcea-capacitacao-front

2. Criar o arquivo config.ts:
--> Este arquivo é um objeto "config" que tem duas propriedades:
- CLIENT_ID: string;
- CLIENT_SECRET: string;

3. Baixar as dependências da aplicação:
--> npm install

4. Iniciar a aplicação:
--> npm start

## 📜 Scripts disponíveis
- npm start: Inicia a aplicação em modo de desenvolvimento (porta padrão [3000]).
- npm run build: Gera os arquivos de produção.
- npm test: Roda os testes configurados.