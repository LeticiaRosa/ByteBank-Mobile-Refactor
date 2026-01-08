# Clean Architecture - Componentes do Extrato

## ✅ Arquitetura Completa Aplicada

Todos os componentes do Extrato foram refatorados seguindo a **Clean Architecture** com separação completa de camadas (Domain, Infrastructure, Presentation).

## 📁 Estrutura de Camadas

```
src/
├── domain/extrato/components/            # Camada de Domínio
│   ├── ExtractFiltersState.ts           # Tipos e regras de filtros
│   ├── TransactionItemState.ts          # Tipos e regras de item de transação
│   └── index.ts                         # Barrel export
│
├── infrastructure/extrato/components/    # Camada de Infraestrutura
│   ├── useExtractFiltersAdapter.ts      # Adapter para filtros
│   ├── useTransactionItemAdapter.ts     # Adapter para item de transação
│   └── index.ts                         # Barrel export
│
└── presentation/extrato/components/      # Camada de Apresentação
    ├── ExtractFilters.tsx               # Container (usa adapter)
    ├── ExtractFiltersView.tsx           # View pura
    ├── TransactionItem.tsx              # Container (usa adapter)
    ├── TransactionItemView.tsx          # View pura
    └── index.tsx                        # Barrel export
```

## 🎯 Componentes Refatorados

### 1. ExtractFilters

**Domain Layer (`ExtractFiltersState.ts`)**:

- `ExtractFiltersProps`: Props públicas do componente
- `FiltersModalState`: Estado dos modais de seleção
- `FiltersActions`: Ações disponíveis (filtrar, resetar, etc)
- `ExtractFiltersViewState`: Estado completo para a View
- `FILTER_OPTIONS`: Opções de filtros (tipos, status)
- `FILTERS_RULES`: Regras de negócio (formatação de data, validação)

**Infrastructure Layer (`useExtractFiltersAdapter.ts`)**:

- Gerencia estado dos filtros
- Controla expansão e modais
- Implementa ações de filtro (quick filter, date change)
- Usa `FILTERS_RULES` do domínio
- Retorna `ExtractFiltersViewState`

**Presentation Layer**:

- `ExtractFilters.tsx`: Container que usa adapter
- `ExtractFiltersView.tsx`: View pura que renderiza UI

### 2. TransactionItem

**Domain Layer (`TransactionItemState.ts`)**:

- `TransactionItemProps`: Props públicas do componente
- `TransactionItemMenuState`: Estado do menu
- `TransactionItemActions`: Ações disponíveis
- `TransactionItemViewState`: Estado completo para a View
- `TRANSACTION_ITEM_RULES`: Regras de negócio (formatação, validação, permissões)

**Infrastructure Layer (`useTransactionItemAdapter.ts`)**:

- Gerencia estado do menu
- Conecta `useTheme` para aplicar tema
- Implementa ações (edit, delete, process)
- Retorna `TransactionItemViewState`

**Presentation Layer**:

- `TransactionItem.tsx`: Container que usa adapter
- `TransactionItemView.tsx`: View pura que renderiza UI

## 🏗️ Responsabilidades de Cada Camada

### 1. Domain (Domínio)

**Responsabilidades**:

- Definir tipos e interfaces
- Implementar regras de negócio puras
- Constantes e opções de configuração
- Não depende de nenhuma camada
- Não conhece React, React Native, ou frameworks

**Exemplos de Regras no Extrato**:

```typescript
// FILTERS_RULES
formatDisplayDate: (date?: Date | string) => string;
getDateFromDaysAgo: (days: number) => Date;
isValidDateRange: (dateFrom?: Date, dateTo?: Date) => boolean;

// TRANSACTION_ITEM_RULES
isPending: (transaction: Transaction) => boolean;
canEdit: (transaction: Transaction) => boolean;
formatAmount: (amount: number) => string;
getColorClass: (type: string) => string;
```

### 2. Infrastructure (Infraestrutura)

**Responsabilidades**:

- Conectar hooks externos (useTheme, useState)
- Gerenciar estado local
- Processar dados usando regras do domínio
- Aplicar tema da aplicação
- Retornar dados no formato esperado pelo domínio

**Diferença entre Adapters**:

```typescript
// useExtractFiltersAdapter
// - Gerencia múltiplos estados (filters, modals, expanded)
// - Implementa lógica de quick filters
// - Usa FILTERS_RULES para formatação

// useTransactionItemAdapter
// - Gerencia estado do menu
// - Conecta useTheme (movido da Presentation!)
// - Implementa callbacks de ações
```

### 3. Presentation (Apresentação)

**Responsabilidades**:

- **Container**: Usa adapter e passa dados para View
- **View**: Componente puro que apenas renderiza
- Sem lógica de negócio
- Sem conexão direta com hooks (exceto UI específicos como useTheme na View para estilos dinâmicos)

**Importante**: `useTheme` foi movido do Container para o Adapter, mantendo a separação correta!

## 🔄 Fluxo de Dados

```
External World (hooks, APIs)
    ↓
Infrastructure (Adapters)
    ↓ (aplica regras de)
Domain (Business Rules)
    ↓
Presentation (Container)
    ↓
Presentation (View - Pure UI)
```

## 📊 Exemplo Completo: TransactionItem

### 1. Domain Layer

```typescript
// TransactionItemState.ts
export interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onProcess?: (transactionId: string, action: "complete" | "fail") => void;
}

export const TRANSACTION_ITEM_RULES = {
  canEdit: (transaction: Transaction) =>
    transaction.status === "pending" || transaction.status === "failed",
  formatAmount: (amount: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100),
};
```

### 2. Infrastructure Layer

```typescript
// useTransactionItemAdapter.ts
export function useTransactionItemAdapter(props: TransactionItemProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isDark } = useTheme(); // Tema aqui, não na Presentation!

  // Implementa ações
  const handleEdit = () => {
    setIsMenuVisible(false);
    props.onEdit?.(props.transaction);
  };

  // Retorna estado completo
  return {
    transaction: props.transaction,
    isDark,
    isMenuVisible,
    onToggleMenu: () => setIsMenuVisible(!isMenuVisible),
    onEdit: props.onEdit ? handleEdit : undefined,
    // ...
  };
}
```

### 3. Presentation Layer

```typescript
// TransactionItem.tsx (Container)
export function TransactionItem(props: TransactionItemProps) {
  const viewState = useTransactionItemAdapter(props);
  return <TransactionItemView {...viewState} />;
}

// TransactionItemView.tsx (View)
export function TransactionItemView({
  transaction,
  isDark,
  onToggleMenu,
}: // ...
TransactionItemViewState) {
  // Apenas renderização pura
  return <View>...</View>;
}
```

## ✅ Princípios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)

- **Domain**: Apenas regras de negócio e tipos
- **Infrastructure**: Apenas adaptação de mundo externo
- **Presentation**: Apenas renderização

### 2. Open/Closed Principle (OCP)

- Regras do domínio são fechadas para modificação
- Adapters podem ser extendidos sem alterar domínio

### 3. Liskov Substitution Principle (LSP)

- Adapters podem ser substituídos sem quebrar a aplicação
- Views podem receber diferentes implementações de estado

### 4. Interface Segregation Principle (ISP)

- Interfaces específicas para cada responsabilidade
- Views recebem apenas o necessário

### 5. Dependency Inversion Principle (DIP)

- Presentation depende de abstrações (tipos do Domain)
- Infrastructure implementa essas abstrações
- Domain não depende de nada

## 🎯 Benefícios Alcançados

### 1. Testabilidade Máxima

```typescript
// Testar regras do domínio (sem mocks)
test("canEdit", () => {
  const pendingTransaction = { status: "pending" };
  expect(TRANSACTION_ITEM_RULES.canEdit(pendingTransaction)).toBe(true);
});

// Testar adapter (mocking hooks)
test("useTransactionItemAdapter", () => {
  mockUseTheme.mockReturnValue({ isDark: true });
  const result = useTransactionItemAdapter({ transaction });
  expect(result.isDark).toBe(true);
});

// Testar view (props mockadas)
test("TransactionItemView", () => {
  render(<TransactionItemView {...mockViewState} />);
  expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
});
```

### 2. Manutenibilidade

- Mudanças em UI: Editar apenas Views
- Mudanças em regras: Editar apenas Domain
- Mudanças em fontes de dados: Editar apenas Infrastructure

### 3. Reutilização

- Regras do domínio reutilizáveis em qualquer lugar
- Adapters composáveis
- Views independentes de lógica

### 4. Independência de Framework

- Regras de negócio não conhecem React/React Native
- Fácil migração para outro framework
- Core da aplicação preservado

### 5. Correção Arquitetural

**Antes**: `useTheme` estava no Container (Presentation)  
**Depois**: `useTheme` está no Adapter (Infrastructure) ✅

## 📝 Como Usar

### Import Simplificado

```typescript
// Domain
import {
  ExtractFiltersProps,
  TransactionItemProps,
  FILTERS_RULES,
  TRANSACTION_ITEM_RULES,
} from "@/domain/extrato/components";

// Infrastructure
import {
  useExtractFiltersAdapter,
  useTransactionItemAdapter,
} from "@/infrastructure/extrato/components";

// Presentation
import {
  ExtractFilters,
  TransactionItem,
} from "@/presentation/extrato/components";
```

### Uso em Telas

```typescript
<ExtractFilters
  onFilterChange={(filters) => console.log(filters)}
  onReset={() => console.log('reset')}
/>

<TransactionItem
  transaction={transaction}
  onEdit={(tx) => console.log('edit', tx)}
  onDelete={(id) => console.log('delete', id)}
/>
```

## 🔄 Migração dos Arquivos Antigos

**Arquivos a deprecar** (após validação):

- `/domain/extrato/FiltersState.ts` → Use `/domain/extrato/components/ExtractFiltersState.ts`
- `/domain/extrato/TransactionItemState.ts` → Use `/domain/extrato/components/TransactionItemState.ts`
- `/infrastructure/extrato/useFiltersAdapter.ts` → Use `/infrastructure/extrato/components/useExtractFiltersAdapter.ts`
- `/infrastructure/extrato/useTransactionItemAdapter.ts` → Use `/infrastructure/extrato/components/useTransactionItemAdapter.ts`

## 🚀 Próximos Passos

1. ✅ Aplicar mesma arquitetura em outras telas (Perfil, Transações)
2. ⏳ Criar testes unitários para Domain
3. ⏳ Criar testes de integração para Infrastructure
4. ⏳ Criar testes de componente para Presentation
5. ⏳ Avaliar remoção dos arquivos antigos
6. ⏳ Considerar Context API para tema global

## 📚 Comparação: Antes vs Depois

### Antes

```
presentation/extrato/components/
├── ExtractFilters.tsx         (container + useFiltersAdapter)
├── ExtractFiltersView.tsx     (view pura)
├── TransactionItem.tsx        (container + useTheme + useAdapter)
└── TransactionItemView.tsx    (view pura)

domain/extrato/
├── FiltersState.ts            (tipos misturados)
└── TransactionItemState.ts    (tipos misturados)

infrastructure/extrato/
├── useFiltersAdapter.ts       (adapter)
└── useTransactionItemAdapter.ts (adapter sem tema)
```

**Problemas**:

- `useTheme` na camada de Presentation (TransactionItem.tsx)
- Tipos espalhados em arquivos raiz
- Sem organização clara de components

### Depois

```
domain/extrato/components/
├── ExtractFiltersState.ts     (tipos + regras)
├── TransactionItemState.ts    (tipos + regras)
└── index.ts

infrastructure/extrato/components/
├── useExtractFiltersAdapter.ts    (adapter)
├── useTransactionItemAdapter.ts   (adapter + useTheme)
└── index.ts

presentation/extrato/components/
├── ExtractFilters.tsx         (container)
├── ExtractFiltersView.tsx     (view)
├── TransactionItem.tsx        (container)
├── TransactionItemView.tsx    (view)
└── index.tsx
```

**Vantagens**:

- ✅ Separação completa de camadas
- ✅ `useTheme` movido para Infrastructure
- ✅ Organização clara em subpastas `/components`
- ✅ Regras de negócio isoladas e testáveis
- ✅ Adapters reutilizáveis e composáveis

---

**Refatoração**: Janeiro 2026  
**Status**: ✅ Arquitetura Completa Implementada  
**Padrão**: Clean Architecture (Domain + Infrastructure + Presentation)  
**Modelo**: Baseado em Home e AuthForm
