# FamilyCash - Product Documentation Reference (PDR)

## 1. Visão Geral e Objetivo
**FamilyCash** é uma aplicação de gerenciamento financeiro colaborativo focado em famílias.
O objetivo principal é permitir que membros de uma família compartilhem contas, controlem despesas conjuntas, visualizem saldos consolidados e planejem orçamentos em tempo real.

Diferente de apps tradicionais de controle pessoal, o FamilyCash é *Family-First*, ou seja, todas as transações e contas pertencem a um contexto familiar compartilhado, mas mantendo a individualidade através de perfis de membros.

## 2. Funcionalidades Principais (Funções)

### Autenticação e Onboarding
- **Registro/Login**: Autenticação segura via Supabase Auth (Email/Senha).
- **Onboarding**: Fluxo guiado para criar uma nova família ou entrar em uma existente via ID.
- **Perfil de Usuário**: Gerenciamento de nome e papel (Admin/Membro).

### Gestão Financeira
- **Dashboard**: Visão rápida do "Disponível Agora", "Projeção de Saldo" ao fim do mês e status de limites de Cartão de Crédito.
- **Timeline (Extrato)**: Lista de transações agrupadas por data, com ícones intuitivos e indicadores de entrada/saída.
- **Transações**:
    - Adicionar Receita, Despesa e Transferência.
    - Suporte a transações recorrentes (planejado na estrutura).
    - Categorização de lançamentos.
- **Contas e Cartões**:
    - Suporte a múltiplas contas (Corrente, Poupança, Investimento, Dinheiro).
    - Gestão de Cartões de Crédito com controle de limite e faturas.

### Planejamento
- **Orçamentos (Budgets)**: Definição de tetos de gastos por categoria (Feature em desenvolvimento).

## 3. Arquitetura e Modularidade

O projeto foi construído visando robustez e facilidade de manutenção, utilizando uma arquitetura modular baseada em React (Vite) + TypeScript.

### Estrutura de Pastas
O código-fonte (`src`) é organizado por domínios e responsabilidades:

- `components/`: Componentes visuais reutilizáveis.
    - `ui/`: Componentes base (Botões, Inputs, Modais) agnósticos ao negócio.
    - `forms/`, `transactions/`, `settings/`: Componentes de negócio específicos.
    - `layout/`: Estrutura global da aplicação (Sidebar, Navbar).
- `pages/`: Componentes de página (Roteamento). Cada página é um contêiner de componentes de negócio.
- `hooks/`: Lógica de estado e efeitos encapsulada.
    - `useFamilyData`: Hook centralizado para buscar e sincronizar dados do Supabase.
    - `useFinanceEngine`: Motor de cálculo financeiro (projeções, saldos) separado da UI.
- `contexts/`: Estado global (Autenticação).
- `services/`: (Opcional) Camada de serviço para abstrair chamadas diretas ao banco.

### Guia para Adicionar Novos Recursos
Para manter a modularidade, siga este padrão ao criar novas features:

1.  **Modelo de Dados**: Defina as interfaces em `src/types/index.ts`.
2.  **Lógica**: Se houver lógica complexa ou chamadas de API, crie um hook em `src/hooks/`. Evite lógica pesada dentro dos componentes visuais.
3.  **Componentes**:
    - Crie componentes pequenos e focados em `src/components/[feature]`.
    - Use os componentes de `src/components/ui` para manter a consistência visual.
4.  **Página**: Componha a página em `src/pages/` utilizando os componentes criados.

## 4. Stack Tecnológica
- **Linguagem**: TypeScript
- **Frontend**: React 19, Vite, TailwindCSS v4
- **Backend/Auth/DB**: Supabase
- **Ícones**: Lucide React
- **Datas**: date-fns
