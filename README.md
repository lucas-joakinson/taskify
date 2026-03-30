# ⚡ Taskify — Enterprise-Grade Task Management & Analytics

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Taskify** é uma plataforma robusta de gerenciamento de fluxo de trabalho baseada na metodologia Kanban, projetada para alta performance e visibilidade de dados. Mais do que um simples "To-Do", o projeto foca na experiência do usuário (UX) e em uma arquitetura de software escalável, simulando um ambiente real de produção.

---

## 🎯 O Produto

O Taskify foi concebido para resolver a fragmentação de informações em equipes de alta performance. Ele combina a agilidade de um quadro Kanban interativo com a profundidade analítica de um Dashboard de BI, permitindo que usuários monitorem gargalos e produtividade em tempo real.

### 🚀 Principais Features

*   **Gestão de Fluxo Kanban**: Interface intuitiva com suporte a transições de status fluidas.
*   **Dashboard Analítico**: Visualização de métricas semanais e distribuição de carga de trabalho via gráficos dinâmicos (Chart.js).
*   **Optimistic UI Updates**: Atualizações instantâneas na interface com mecanismos de *rollback* em caso de falha na persistência.
*   **Sistema de Busca Global**: Filtros granulares que operam em todo o estado da aplicação.
*   **Autenticação Persistente**: Fluxo de login simulado com persistência de sessão e proteção de rotas (Private Routes).
*   **Design Responsivo & Glassmorphism**: UI moderna, otimizada para todos os dispositivos, com foco em legibilidade e estética "Dark Mode".

---

## 🛠️ Engenharia de Software e Arquitetura

O projeto foi desenvolvido seguindo princípios de **Clean Code** e **SOLID**, garantindo que a base de código seja manutenível e fácil de escalar.

### 📂 Estrutura de Diretórios (Decoupled Design)

A arquitetura separa estritamente a lógica de negócio da camada de apresentação:

*   `/src/services`: Camada de abstração de dados (API Layer). Centraliza a comunicação com fontes externas, facilitando a troca do `localStorage` por uma API REST real sem tocar na UI.
*   `/src/components`: Componentes atômicos e reutilizáveis (Input, Button, Toast, Modal).
*   `/src/pages`: Orquestradores de alto nível que gerenciam o estado local e fluxos de dados.
*   `/src/types`: Contratos TypeScript rigorosos para garantir integridade de dados em toda a aplicação.

### 🧠 Diferenciais Técnicos (Tech Lead Insights)

1.  **State Management Estratégico**: Uso consciente de `useState` e `useMemo` para evitar re-renders desnecessários em cálculos de estatísticas pesadas.
2.  **Type Safety de Ponta a Ponta**: Interfaces TypeScript que refletem fielmente as entidades do domínio, reduzindo drasticamente erros em tempo de execução.
3.  **Abstração de API**: Implementação de um `delay` nos serviços para simular latência de rede real, permitindo o tratamento adequado de estados de `loading` e `skeleton screens`.
4.  **Error Handling Centralizado**: Sistema de tratamento de exceções que propaga mensagens amigáveis para a UI através de Toasts customizados.

---

## 🧪 Tecnologias e Justificativas

*   **React 18**: Escolhido pela sua eficiência em renderização e vasto ecossistema de hooks.
*   **TypeScript**: Adotado para trazer previsibilidade e facilitar refatorações em larga escala.
*   **Tailwind CSS + Headless UI**: Utilizado para criar um sistema de design consistente com zero runtime de CSS extra.
*   **Framer Motion**: Aplicado para "Meaningful Motion", onde cada animação serve para guiar o olhar do usuário e não apenas como estética.
*   **Chart.js**: Selecionado pela performance na renderização de dados complexos em Canvas.

---

## 📈 Performance e Otimizações

*   **Memoização**: Processamento de métricas do dashboard e filtros de busca protegidos por `useMemo`.
*   **Asset Management**: Uso de ícones vetoriais (Lucide) e fontes otimizadas para reduzir o LCP (Largest Contentful Paint).
*   **Tree Shaking**: Configuração de build via Vite para garantir que apenas o código utilizado seja enviado ao cliente final.

---

## 🏁 Como Rodar o Projeto

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/taskify.git
    ```
2.  **Instale as dependências**:
    ```bash
    npm install
    ```
3.  **Inicie o ambiente de desenvolvimento**:
    ```bash
    npm run dev
    ```

---

## 🗺️ Roadmap de Evolução (Próximos Níveis)

*   [ ] **Integração Backend**: Substituição do mock service por uma API Node.js/FastAPI.
*   [ ] **Drag and Drop Real**: Implementação de `dnd-kit` para movimentação de tarefas via mouse.
*   [ ] **Suporte a Multi-Equipes**: Arquitetura para espaços de trabalho (workspaces) isolados.
*   [ ] **Testes de Cobertura**: Implementação de testes unitários com Vitest e E2E com Playwright.

---

Taskify - Feito com uma coquinha e muito Código.
