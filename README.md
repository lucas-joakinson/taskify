# Purple SaaS Dashboard - Taskify

Este é um projeto de Dashboard SaaS moderno e elegante, desenvolvido com foco em UI/UX para portfólios. O projeto utiliza uma estética "Purple Dark Glow" com efeitos de vidro (glassmorphism), gradientes roxos e tipografia moderna.

## 🚀 Tecnologias Utilizadas

- **React + Vite** (Base do projeto)
- **TypeScript** (Tipagem estática)
- **TailwindCSS** (Estilização moderna e responsiva)
- **Lucide React** (Ícones modernos)
- **Chart.js + React-Chartjs-2** (Gráficos interativos)
- **Framer Motion** (Animações e interatividade suave)
- **React Router Dom** (Navegação SPA)

## ✨ Funcionalidades

- **Login Fake:** Simulação de autenticação com salvamento no `localStorage`.
- **Dashboard Overview:** Métricas de tarefas em tempo real com gráficos de pizza e barra.
- **CRUD Completo:** Listagem, criação, atualização de status e exclusão de tarefas.
- **Filtros e Busca:** Filtragem por status (Todas/Pendentes/Concluídas) e busca por título.
- **Identidade Visual Premium:** Tema dark (#0f0f14), fundo com grid, efeitos de brilho (glow) e cards em estilo glassmorphism.
- **Persistência Local:** Os dados das tarefas persistem mesmo após recarregar a página através do `localStorage`.

## 📁 Estrutura de Pastas

```text
src/
├── components/   # Componentes reutilizáveis (Sidebar, Header, TaskCard, etc.)
├── pages/        # Páginas principais (Login, Dashboard, Tasks)
├── services/     # Serviços de API (Simulação de fetch/axios com localStorage)
├── types/        # Definições de interfaces TypeScript
├── App.tsx       # Configuração de rotas e layout principal
├── index.css     # Estilos globais e configurações do Tailwind
└── main.tsx      # Ponto de entrada da aplicação
```

## 🛠️ Como Executar

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório ou baixe os arquivos.**
2. **Abra o terminal na pasta raiz do projeto.**
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
5. **Acesse no navegador:**
   `http://localhost:5173`

---

Desenvolvido para fins de estudo e portfólio. Sinta-se à vontade para customizar!
