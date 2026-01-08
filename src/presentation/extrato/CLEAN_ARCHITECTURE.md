# Clean Architecture - Extrato Module

## 📋 Visão Geral

Este módulo implementa a **página de extrato bancário** seguindo os princípios de **Clean Architecture** e **SOLID**.

O Extrato é responsável por:

- Exibir lista paginada de transações
- Filtrar transações por múltiplos critérios
- Editar transações existentes
- Excluir transações com confirmação
- Processar transações (completar/falhar)
- Gerenciar paginação de resultados

## 🏗️ Estrutura

```
src/
├── domain/
│   └── extrato/
│       └── ExtratoState.ts              # Tipos, interfaces, constantes do domínio
├── infrastructure/
│   └── extrato/
│       └── useExtratoAdapter.ts         # Adapter - Lógica de negócio e adaptação
└── presentation/
    └── extrato/
        ├── Extrato.tsx                  # Container - Conecta adapter ao view
        └── ExtratoView.tsx              # View - Componente visual puro
```

## 📦 Camadas

### 1. Domain Layer (`domain/extrato/`)

Define os **tipos puros** e **constantes** do domínio de extrato bancário.

**Responsabilidades:**

- ✅ Definir tipos TypeScript (FilterOptions, ExtratoState, etc.)
- ✅ Definir interfaces para estado e ações
- ✅ Definir constantes (tipos de transação, status, categorias)
- ✅ Definir filtros padrão
- ❌ Não contém lógica de negócio
- ❌ Não importa bibliotecas de UI
- ❌ Não depende de outras camadas

**Arquivos:**

- `ExtratoState.ts`: Tipos completos do módulo, constantes e valores padrão

**Principais tipos:**

- `FilterOptions`: Opções de filtro disponíveis
- `DeleteModalState`: Estado do modal de confirmação de exclusão
- `EditModalState`: Estado do modal de edição
- `PaginationInfo`: Informações de paginação
- `ExtratoState`: Estado completo do extrato
- `ExtratoActions`: Ações disponíveis

### 2. Infrastructure Layer (`infrastructure/extrato/`)

Contém a **lógica de negócio** e **adapta** hooks externos para a apresentação.

**Responsabilidades:**

- ✅ Gerenciar estado de filtros, paginação e modais
- ✅ Adaptar hooks externos (useTransactions, useAuth, useTheme, useToast)
- ✅ Decidir entre transações filtradas ou todas as transações
- ✅ Aplicar paginação manual quando necessário
- ✅ Lidar com criação, edição, exclusão de transações
- ✅ Gerenciar confirmação de exclusão
- ❌ Não contém JSX/componentes visuais

**Arquivos:**

- `useExtratoAdapter.ts`: Hook customizado que retorna estado e ações

**Principais funcionalidades:**

- `handleFilterChange()`: Atualiza filtros e reseta paginação
- `handleResetFilters()`: Limpa todos os filtros
- `handlePageChange()`: Navega entre páginas
- `handleEditTransaction()`: Abre modal de edição
- `handleUpdateTransaction()`: Atualiza transação no backend
- `handleDeleteTransaction()`: Abre modal de confirmação
- `confirmDeleteTransaction()`: Confirma e executa exclusão
- `cancelDeleteTransaction()`: Cancela exclusão
- `handleProcessTransaction()`: Processa transação (completar/falhar)

**Lógica inteligente:**

- Detecta se há filtros ativos automaticamente
- Usa `useFilteredTransactions` quando há filtros
- Usa `useTransactions` (todas) quando não há filtros
- Aplica paginação manual quando não há filtros
- Reseta para página 1 quando filtros mudam

### 3. Presentation Layer (`presentation/extrato/`)

Camada de **apresentação visual** - componentes React Native.

**Responsabilidades:**

- ✅ Renderizar UI (lista, filtros, modais)
- ✅ Capturar interações do usuário
- ✅ Delegar lógica para o adapter
- ✅ Adaptar-se ao tema (dark/light)
- ❌ Não contém lógica de negócio
- ❌ Não acessa diretamente hooks externos (exceto no container)

#### 3.1 Container (`Extrato.tsx`)

- Conecta o **adapter** (infrastructure) ao **view** (presentation)
- Chama `useExtratoAdapter()` e passa props para o `ExtratoView`
- Único ponto que conhece ambas as camadas

#### 3.2 View (`ExtratoView.tsx`)

- Componente **stateless** (recebe tudo via props)
- Renderiza lista paginada de transações
- Usa componentes existentes (TransactionItem, ExtractFilters, SimplePagination)
- Mostra estados: loading, erro, lista vazia, lista com dados
- Renderiza modais de edição e exclusão

## 🎯 Princípios SOLID Aplicados

### **S - Single Responsibility Principle**

- `ExtratoState.ts`: Apenas define tipos e constantes
- `useExtratoAdapter.ts`: Apenas gerencia lógica e estado
- `ExtratoView.tsx`: Apenas renderiza UI
- Sub-componentes têm responsabilidades específicas (TransactionItem, ExtractFilters, SimplePagination)

### **O - Open/Closed Principle**

- Adicionar novo filtro: atualizar `FilterOptions` no domain
- Adicionar novo status: atualizar `STATUS_OPTIONS` no domain
- Extensível sem modificar código existente

### **L - Liskov Substitution Principle**

- Interfaces bem definidas permitem substituir implementações
- View pode ser substituído por outro componente visual que receba mesmas props

### **I - Interface Segregation Principle**

- Interfaces separadas para estado, ações, filtros, paginação
- Components recebem apenas props necessárias
- Sub-componentes (TransactionItem, ExtractFilters) têm interfaces mínimas

### **D - Dependency Inversion Principle**

- View depende de abstrações (props interface), não de implementações concretas
- Adapter abstrai hooks externos
- Fácil testar mockando o adapter

## 🔄 Fluxo de Dados

```
User Interaction (View)
        ↓
    Container
        ↓
    Adapter (Infrastructure)
        ↓
External Hooks (useTransactions, useFilteredTransactions, useAuth)
        ↓
    Backend (Supabase)
        ↓
Update State in Adapter
        ↓
Re-render View with new state
```

## 💡 Benefícios

### ✅ Testabilidade

- Lógica isolada no adapter pode ser testada sem UI
- View stateless pode ser testada com snapshot
- Fácil mockar o adapter em testes

### ✅ Manutenibilidade

- Código organizado por responsabilidades
- Mudanças em UI não afetam lógica
- Mudanças em lógica não afetam UI
- Fácil encontrar onde cada coisa está

### ✅ Reutilização

- Adapter pode ser usado em outras UIs (web, tablet)
- Sub-componentes são reutilizáveis
- Constantes (filtros, status) compartilhadas no domínio

### ✅ Escalabilidade

- Fácil adicionar novos filtros
- Fácil adicionar novas ações
- Fácil adicionar novos status/tipos
- Fácil migrar para outro framework UI

## 🚀 Como Usar

### Importando o Componente

```typescript
import { Extrato } from "@/presentation/extrato/Extrato";

// Ou usando o path antigo (mantém compatibilidade):
import { ExtractPage } from "@/components/UserRoutes/Extrato";
```

### Exemplo de Uso

```typescript
// O componente não precisa de props - é totalmente auto-contido
<Extrato />

// Ou com o nome antigo:
<ExtractPage />
```

## 🔍 Sistema de Filtros

O extrato suporta filtros avançados:

### Filtros Disponíveis

- **Data (De/Até)**: Filtrar por período
- **Tipo de Transação**: Depósito, saque, transferência, pagamento, taxa
- **Status**: Concluída, pendente, falhou, cancelada
- **Valor (Mín/Máx)**: Filtrar por faixa de valor
- **Descrição**: Busca textual na descrição
- **Categoria**: Alimentação, transporte, saúde, etc.
- **Remetente/Pagador**: Nome do remetente

### Lógica Inteligente

- Detecta automaticamente se há filtros ativos
- Usa query otimizada no backend quando há filtros
- Usa cache local quando não há filtros
- Reseta paginação ao mudar filtros

## 📄 Sistema de Paginação

- **Tamanho da página**: 10 itens (configurável via `EXTRATO_CONSTANTS.PAGE_SIZE`)
- **Paginação automática**: Aplica no backend (filtros) ou cliente (sem filtros)
- **Informações exibidas**: "Mostrando X-Y de Z resultados"
- **Controles**: Botões Anterior/Próxima com desabilitação automática

## 🎨 Adaptação de Tema

O extrato se adapta automaticamente ao tema (dark/light):

- Background colors
- Text colors
- Border colors
- Card backgrounds
- Loading indicators

## ✏️ Edição de Transações

- Clique em transação abre modal de edição
- Usa o componente `TransactionForm` com modo de edição
- Atualiza lista automaticamente após salvar
- Fecha modal automaticamente ao cancelar

## 🗑️ Exclusão de Transações

- Clique em excluir abre modal de confirmação
- Modal customizado com `ConfirmDeleteModal`
- Mostra ID da transação para confirmação
- Estado de loading durante exclusão
- Atualiza lista automaticamente após exclusão

## 📊 Estados Visuais

O extrato renderiza diferentes estados:

1. **Loading**: Spinner com mensagem "Carregando transações..."
2. **Erro**: Mensagem de erro quando filtros falham
3. **Lista Vazia**:
   - Sem filtros: "Suas transações aparecerão aqui..."
   - Com filtros: "Tente ajustar os filtros..."
4. **Lista com Dados**: Lista paginada de transações

## 🔗 Integração com Backend

O extrato se integra com:

- `useTransactions` hook para operações CRUD e lista completa
- `useFilteredTransactions` hook para busca filtrada otimizada
- `useAuth` hook para identificar usuário
- `useBankAccounts` hook para contas do usuário
- Supabase para persistência

## 🧩 Componentes Reutilizados

O Extrato reutiliza componentes existentes:

- `TransactionItem`: Renderiza cada transação individual
- `ExtractFilters`: Componente de filtros avançados
- `SimplePagination`: Controles de paginação
- `ConfirmDeleteModal`: Modal de confirmação
- `TransactionForm`: Formulário de edição (Clean Architecture)

## 📚 Referências

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Container/Presenter Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
