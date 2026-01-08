# Estrutura Clean Architecture - Módulo Extrato

## 📁 Organização de Pastas

```
src/
├── domain/extrato/                   # Camada de Domínio
│   ├── ExtratoState.ts              # Estados e tipos do Extrato
│   ├── FiltersState.ts              # Estados e tipos dos Filtros
│   └── TransactionItemState.ts      # Estados e tipos do TransactionItem
│
├── infrastructure/extrato/           # Camada de Infraestrutura
│   ├── useExtratoAdapter.ts         # Adapter do Extrato principal
│   ├── useFiltersAdapter.ts         # Adapter dos Filtros
│   └── useTransactionItemAdapter.ts # Adapter do TransactionItem
│
└── presentation/extrato/             # Camada de Apresentação
    ├── Extrato.tsx                   # Container do Extrato
    ├── ExtratoView.tsx               # View do Extrato
    ├── components/                   # Containers com lógica
    │   ├── index.tsx
    │   ├── ExtractFilters.tsx        # Container dos Filtros
    │   ├── ExtractFiltersView.tsx    # View dos Filtros
    │   ├── TransactionItem.tsx       # Container do Item
    │   └── TransactionItemView.tsx   # View do Item
    └── ui/                           # Componentes UI puros
        ├── index.ts
        └── SimplePagination.tsx      # Componente stateless puro
```

## 🎯 Responsabilidades por Camada

### Domain (domain/extrato/)

**O QUE FAZ:**

- Define tipos, interfaces e contratos
- Estabelece estruturas de dados
- Define ações e estados disponíveis

**NÃO FAZ:**

- Implementação de lógica
- Acesso a APIs
- Renderização de UI

**ARQUIVOS:**

- `ExtratoState.ts`: Transaction, FilterOptions, ExtratoState, DEFAULT_FILTERS
- `FiltersState.ts`: FiltersModalState, FiltersActions, FILTER_OPTIONS
- `TransactionItemState.ts`: TransactionItemProps, TransactionItemMenuState, TransactionItemActions

---

### Infrastructure (infrastructure/extrato/)

**O QUE FAZ:**

- Implementa lógica de negócio
- Gerencia estados complexos
- Processa dados
- Adapta dados entre camadas

**NÃO FAZ:**

- Renderização de componentes
- Definição de tipos (usa do domain)
- Acesso direto a componentes visuais

**ARQUIVOS:**

- `useExtratoAdapter.ts`: Lógica de carregamento, paginação, CRUD de transações
- `useFiltersAdapter.ts`: Lógica de filtros, modais, datas, filtros rápidos
- `useTransactionItemAdapter.ts`: Lógica do menu do item, handlers de ações

---

### Presentation (presentation/extrato/)

**O QUE FAZ:**

- Conecta adapters às views (containers)
- Renderiza UI (views)
- Gerencia tema e estilos

**NÃO FAZ:**

- Implementa lógica de negócio
- Define tipos (importa do domain)

**ESTRUTURA:**

#### 📦 components/ (Containers + Views)

Componentes que possuem lógica ou estado:

1. **ExtractFilters** (Container + View)

   - Container: Conecta `useFiltersAdapter` à View
   - View: Renderiza inputs, selects, modals, date pickers

2. **TransactionItem** (Container + View)
   - Container: Conecta `useTransactionItemAdapter` à View
   - View: Renderiza card da transação com menu

#### 🎨 ui/ (Componentes Puros)

Componentes stateless sem lógica:

1. **SimplePagination**
   - Componente puro que recebe tudo via props
   - Renderiza botões de navegação
   - Não possui estado interno ou adapters

---

## 🔄 Fluxo de Dados

### Exemplo: Alterar Filtro de Tipo

```
1. User clica no select de tipo
   ↓
2. ExtractFiltersView chama actions.onToggleModal('showTransactionTypeModal')
   ↓
3. ExtractFilters (container) repassa para useFiltersAdapter
   ↓
4. useFiltersAdapter atualiza modalsState.showTransactionTypeModal = true
   ↓
5. ExtractFiltersView re-renderiza com modal visível
   ↓
6. User seleciona "Depósito"
   ↓
7. ExtractFiltersView chama actions.onFilterChange('type', 'deposit')
   ↓
8. useFiltersAdapter:
   - Atualiza filters.type = 'deposit'
   - Chama callback onFilterChange(newFilters)
   ↓
9. Extrato (componente pai) recebe novos filtros
   ↓
10. useExtratoAdapter recarrega transações com filtros
```

### Exemplo: Deletar Transação

```
1. User clica no menu do TransactionItem
   ↓
2. TransactionItemView chama onToggleMenu()
   ↓
3. TransactionItem (container) repassa para useTransactionItemAdapter
   ↓
4. useTransactionItemAdapter atualiza menuState.isVisible = true
   ↓
5. TransactionItemView re-renderiza com menu visível
   ↓
6. User clica em "Excluir"
   ↓
7. TransactionItemView chama onDelete()
   ↓
8. useTransactionItemAdapter:
   - Fecha o menu (menuState.isVisible = false)
   - Chama callback onDelete(transaction.id) do componente pai
   ↓
9. Extrato recebe ID e chama useExtratoAdapter.handleDelete()
   ↓
10. useExtratoAdapter executa lógica de exclusão
```

---

## ✅ Checklist de Organização

### Domain Layer

- [x] ExtratoState.ts com Transaction, FilterOptions, ExtratoState
- [x] FiltersState.ts com FiltersModalState, FiltersActions
- [x] TransactionItemState.ts com TransactionItemProps, TransactionItemMenuState

### Infrastructure Layer

- [x] useExtratoAdapter.ts para lógica do Extrato
- [x] useFiltersAdapter.ts para lógica dos Filtros
- [x] useTransactionItemAdapter.ts para lógica do TransactionItem

### Presentation Layer - Components

- [x] Extrato.tsx (container) + ExtratoView.tsx (view)
- [x] ExtractFilters.tsx (container) + ExtractFiltersView.tsx (view)
- [x] TransactionItem.tsx (container) + TransactionItemView.tsx (view)

### Presentation Layer - UI

- [x] SimplePagination.tsx (componente puro)

### Compatibility Layer

- [x] Re-exports em components/UserRoutes/Extrato/components/
- [x] Todos os imports antigos funcionando

---

## 🎓 Quando Usar Cada Pasta

### Use `domain/` quando:

- Criar tipos/interfaces novos
- Definir constantes de domínio
- Estabelecer contratos entre camadas

### Use `infrastructure/` quando:

- Implementar lógica complexa
- Gerenciar estados com useState/useEffect
- Processar/transformar dados
- Criar adapters/hooks customizados

### Use `presentation/components/` quando:

- Criar containers que conectam adapters a views
- Criar views que precisam acessar adapters

### Use `presentation/ui/` quando:

- Criar componentes stateless puros
- Componente não precisa de adapter
- Recebe tudo via props
- Pode ser reutilizado em qualquer contexto

---

## 📊 Métricas da Refatoração

| Componente       | Antes      | Depois (Container) | Depois (View/Adapter)                    |
| ---------------- | ---------- | ------------------ | ---------------------------------------- |
| TransactionItem  | 482 linhas | 24 linhas          | 55 linhas (adapter) + 494 linhas (view)  |
| ExtractFilters   | 644 linhas | 27 linhas          | 111 linhas (adapter) + 548 linhas (view) |
| SimplePagination | 141 linhas | 148 linhas (puro)  | N/A                                      |

**Total de linhas:** Similar, mas com separação clara de responsabilidades!

---

## 🚀 Benefícios Conquistados

1. **Testabilidade**: Cada camada testável isoladamente
2. **Manutenibilidade**: Mudanças localizadas, sem efeitos colaterais
3. **Reusabilidade**: Adapters e views reutilizáveis
4. **Legibilidade**: Código organizado por responsabilidade
5. **Escalabilidade**: Fácil adicionar novos componentes seguindo o padrão
6. **Type Safety**: TypeScript garante contratos entre camadas
