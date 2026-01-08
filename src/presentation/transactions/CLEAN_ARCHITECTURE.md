````markdown
# Clean Architecture - Transactions Module

## 📁 Estrutura de Camadas

```
src/
├── presentation/          # Camada de Apresentação
│   └── transactions/
│       ├── Transactions.tsx        # Container com lógica
│       └── TransactionsView.tsx    # Componente visual puro
│
├── domain/               # Camada de Domínio
│   └── transactions/
│       └── TransactionsState.ts    # Tipos e interfaces do domínio
│
├── infrastructure/       # Camada de Infraestrutura
│   └── transactions/
│       └── useTransactionsAdapter.ts  # Adapter para hook useTransactions
│
└── components/
    └── UserRoutes/
        └── Transactions/
            ├── index.tsx           # Componente de compatibilidade
            └── components/
                └── NewTransactionForm.tsx  # Formulário de transação (mantido)
```

## 🏗️ Princípios Aplicados

### 1. **Separação de Responsabilidades**

- **Domain** (`TransactionsState.ts`):

  - Define tipos: `TransactionsState`, `TransactionsActions`
  - Agrupa estado de transações, contas bancárias, conexão real-time
  - Define interface de ações CRUD e edição
  - Camada independente de frameworks

- **Infrastructure** (`useTransactionsAdapter.ts`):

  - Adapta hook complexo `useTransactions`
  - Gerencia estado de edição de transação
  - Isola lógica de real-time e sincronização
  - Implementa cancelamento de edição

- **Presentation**:
  - `Transactions.tsx`: Container (conecta adapter com view)
  - `TransactionsView.tsx`: Presenter (apenas renderização)
  - `NewTransactionForm.tsx`: Componente complexo reutilizado (mantido)

### 2. **Inversão de Dependência**

```
useTransactions (hook original com real-time)
    ↓
useTransactionsAdapter (adapta para o domínio)
    ↓
Transactions (container)
    ↓
TransactionsView (componente visual puro)
    ↓
NewTransactionForm (formulário reutilizável)
```

- A camada de apresentação não depende diretamente do hook complexo
- O adapter isola lógica de real-time e operações
- Fácil trocar implementações sem alterar a UI

### 3. **Container/Presenter Pattern**

- **Transactions.tsx**: Container com lógica

  - Conecta com o adapter
  - Passa estado e ações para a view

- **TransactionsView.tsx**: Presenter puro
  - Recebe estado e ações via props
  - Não gerencia estado
  - Renderiza loading state e formulário
  - Delega para NewTransactionForm

### 4. **Single Responsibility Principle (SOLID)**

Cada arquivo tem uma única responsabilidade:

- **TransactionsState.ts**: Define o domínio de transações
- **useTransactionsAdapter.ts**: Adapta hook e gerencia edição
- **Transactions.tsx**: Orquestra a lógica
- **TransactionsView.tsx**: Renderiza loading e formulário
- **NewTransactionForm.tsx**: Gerencia formulário complexo

## 🔄 Fluxo de Dados

```
1. User Action (NewTransactionForm)
    ↓
2. Callback (TransactionsView)
    ↓
3. Action (Transactions)
    ↓
4. useTransactionsAdapter
    ↓
5. Hook Original (useTransactions)
    ↓
6. Backend API + Real-time (Supabase)
```

## 📦 Componentes

### Domain Layer

#### `TransactionsState.ts`

```typescript
- TransactionsState: estado completo incluindo:
  - transactions: lista de transações
  - bankAccounts, primaryAccount: contas bancárias
  - isLoading*, *Error: estados de operações
  - isConnected, connectionState: estado real-time
  - editingTransaction: transação em edição

- TransactionsActions: interface de ações:
  - createTransaction, updateTransaction, deleteTransaction
  - refreshTransactions, refreshBankAccounts
  - setEditingTransaction, cancelEdit
  - getTransaction
```

### Infrastructure Layer

#### `useTransactionsAdapter.ts`

```typescript
- Adapta useTransactions (hook complexo)
- Gerencia estado local de editingTransaction
- Implementa cancelEdit
- Retorna TransactionsAdapter: { state, actions }
```

### Presentation Layer

#### `Transactions.tsx`

```typescript
- Container component
- Usa useTransactionsAdapter
- Conecta adapter com TransactionsView
- Passa estado e ações
```

#### `TransactionsView.tsx`

```typescript
- Componente stateless (puro)
- Renderiza loading state customizado
- Renderiza NewTransactionForm com props
- Passa callbacks para ações
```

### Compatibility Layer

#### `components/UserRoutes/Transactions/index.tsx`

```typescript
- Mantém imports antigos funcionando
- Re-exporta Transactions
- Garante compatibilidade com código existente
```

### Existing Component (Maintained)

#### `NewTransactionForm.tsx`

```typescript
- Componente complexo mantido como está
- 1106 linhas de formulário detalhado
- Gerencia categorias, tipos, validações
- Upload de recibo (imagem)
- Modo edição e criação
- Será refatorado em etapa futura se necessário
```

## ✅ Benefícios

1. **Testabilidade**

   - TransactionsView pode ser testado com estado mockado
   - useTransactionsAdapter pode ser testado isoladamente
   - NewTransactionForm pode ser testado com props mockadas

2. **Manutenibilidade**

   - Estado complexo isolado no adapter
   - Fácil entender fluxo de dados
   - Mudanças isoladas em cada camada

3. **Escalabilidade**

   - Fácil adicionar novos tipos de transação
   - Fácil adicionar filtros e ordenação
   - Fácil trocar backend (Supabase → outro)

4. **Real-time Support**

   - Conexão real-time isolada no adapter
   - Estado de conexão disponível na view
   - Fácil desabilitar real-time se necessário

5. **Compatibilidade**
   - Imports antigos continuam funcionando
   - NewTransactionForm reutilizado sem modificações
   - Zero breaking changes

## 🎯 Comparação: Antes vs Depois

### Antes (Componente Monolítico)

```tsx
// src/components/UserRoutes/Transactions/index.tsx
- 60 linhas de código
- Mistura lógica + estado + UI
- Hook useTransactions direto no componente
- Estado de edição local
- Acoplado ao hook complexo
```

### Depois (Clean Architecture)

```
Domain:        TransactionsState.ts (62 linhas)
Infrastructure: useTransactionsAdapter.ts (85 linhas)
Presentation:   Transactions.tsx (13 linhas)
Presentation:   TransactionsView.tsx (67 linhas)
Compatibility:  index.tsx (8 linhas)
Mantido:       NewTransactionForm.tsx (1106 linhas - não refatorado)

Total: 5 arquivos novos + 1 mantido
- Fácil de testar cada camada
- Fácil de manter
- Fácil de estender
- Imports antigos continuam funcionando
- NewTransactionForm reutilizado
```

## 📝 Exemplos de Uso

### Uso Normal (compatível com código antigo)

```tsx
import { Transactions } from "../../components/UserRoutes/Transactions";

// Funciona exatamente como antes
<Transactions />;
```

### Uso da Nova Arquitetura (recomendado)

```tsx
import { Transactions } from "../../presentation/transactions/Transactions";

<Transactions />;
```

### Uso Apenas da View (para testes)

```tsx
import { TransactionsView } from "../../presentation/transactions/TransactionsView";

const mockState = {
  transactions: [],
  isLoadingTransactions: false,
  // ... outras props
};

const mockActions = {
  createTransaction: jest.fn(),
  // ... outras actions
};

<TransactionsView state={mockState} actions={mockActions} />;
```

## 🔍 Testes

### Testando a View (Componente Puro)

```tsx
// TransactionsView.test.tsx
import { render } from "@testing-library/react-native";
import { TransactionsView } from "./TransactionsView";

test("should render NewTransactionForm with correct props", () => {
  const mockState = {
    bankAccounts: [],
    primaryAccount: null,
    isLoadingAccounts: false,
    isCreating: false,
    isUpdating: false,
    editingTransaction: null,
    // ... outras props
  };

  const mockActions = {
    createTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    cancelEdit: jest.fn(),
  };

  const { getByText } = render(
    <TransactionsView state={mockState} actions={mockActions} />
  );

  // Verificar renderização
});
```

### Testando o Adapter

```tsx
// useTransactionsAdapter.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useTransactionsAdapter } from "./useTransactionsAdapter";

test("should manage editing transaction state", () => {
  const { result } = renderHook(() => useTransactionsAdapter());

  const mockTransaction = { id: "1", amount: 100 /* ... */ };

  act(() => {
    result.current.actions.setEditingTransaction(mockTransaction);
  });

  expect(result.current.state.editingTransaction).toEqual(mockTransaction);

  act(() => {
    result.current.actions.cancelEdit();
  });

  expect(result.current.state.editingTransaction).toBeNull();
});
```

## 🎨 Características Mantidas

1. **Hook useTransactions**

   - Real-time sync via Supabase
   - CRUD operations
   - Connection state management
   - Error handling
   - Loading states

2. **NewTransactionForm**

   - Formulário complexo mantido intacto
   - Categorias e tipos de transação
   - Validações
   - Upload de recibo
   - Modo edição e criação
   - Formatação de valores monetários

3. **Bank Accounts**
   - Primary account selection
   - Multiple accounts support
   - Loading states

## 📚 Próximos Passos

Para continuar aplicando Clean Architecture:

1. ✅ Login/Signup - **CONCLUÍDO**
2. ✅ Sidebar/Navigation - **CONCLUÍDO**
3. ✅ Transactions - **CONCLUÍDO**
4. 🔄 NewTransactionForm - **Refatorar futuramente (componente muito complexo)**
5. 🔄 Home/Dashboard
6. 🔄 Extract (extrato de transações)
7. 🔄 Profile (já iniciado, finalizar completamente)

## 🔧 Melhorias Futuras

1. **NewTransactionForm**: Refatorar em múltiplos componentes menores
2. **Filtros**: Adicionar filtros de transações na view
3. **Paginação**: Implementar paginação de transações
4. **Busca**: Adicionar busca de transações
5. **Export**: Exportar transações em CSV/PDF

## 🎓 Referências

- Clean Architecture (Robert C. Martin)
- SOLID Principles
- Container/Presenter Pattern
- Real-time State Management
- React Hooks Best Practices
````
