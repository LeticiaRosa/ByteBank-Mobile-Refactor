# Componentes do Extrato - Clean Architecture

Este documento descreve a arquitetura Clean aplicada aos componentes do Extrato, seguindo o mesmo padrão estabelecido em `AuthFormView.tsx`.

## Estrutura de Arquivos

```
src/
├── domain/
│   └── extrato/
│       ├── ExtratoState.ts          # Estados e tipos do Extrato principal
│       └── FiltersState.ts          # Estados e tipos dos Filtros
├── infrastructure/
│   └── extrato/
│       └── useFiltersAdapter.ts     # Adapter para lógica de filtros
└── presentation/
    └── extrato/
        ├── Extrato.tsx              # Container principal do Extrato
        ├── ExtratoView.tsx          # View principal do Extrato
        └── components/
            ├── index.tsx            # Exporta todos os componentes
            ├── TransactionItem.tsx  # Container do item de transação
            ├── TransactionItemView.tsx  # View do item de transação
            ├── SimplePagination.tsx # Componente de paginação (stateless)
            ├── ExtractFilters.tsx   # Container dos filtros
            └── ExtractFiltersView.tsx   # View dos filtros
```

## Componentes

### 1. TransactionItem

**Responsabilidade**: Exibir um item de transação com menu de ações (editar/excluir).

#### Domain Layer

- Usa `Transaction` de `ExtratoState.ts` para tipos

#### Container (`TransactionItem.tsx`)

```typescript
- Gerencia estado do menu (visível/oculto)
- Define handlers para abrir/fechar menu
- Passa estado e ações para a View
```

#### View (`TransactionItemView.tsx`)

```typescript
- Componente stateless puro
- Recebe transação, handlers e estados via props
- Renderiza:
  - Badge de status da transação
  - Informações da transação (descrição, categoria, data)
  - Valor formatado com cor baseada no tipo
  - Menu dropdown com opções de editar/excluir
```

**Linha de dependência**: Domain ← Container ← View

---

### 2. SimplePagination

**Responsabilidade**: Exibir controles de paginação (anterior/próximo).

#### Características

- Componente stateless (sem estado interno)
- Recebe todas as props necessárias para renderização
- Não acessa diretamente nenhuma camada
- Props:
  ```typescript
  {
    currentPage: number
    totalPages: number
    totalCount: number
    pageSize: number
    onNextPage: () => void
    onPrevPage: () => void
  }
  ```

**Linha de dependência**: Nenhuma (componente puro)

---

### 3. ExtractFilters

**Responsabilidade**: Permitir filtragem de transações por diversos critérios.

#### Domain Layer (`FiltersState.ts`)

```typescript
- FilterOptions: tipo com todos os filtros disponíveis
- FiltersModalState: estado dos modais de seleção
- FiltersActions: interface de ações disponíveis
- FILTER_OPTIONS: constantes de opções de filtro
```

#### Infrastructure Layer (`useFiltersAdapter.ts`)

```typescript
- Gerencia estado dos filtros
- Controla estado dos modais (data, tipo, status, categoria)
- Implementa handlers:
  - handleFilterChange: atualiza filtro específico
  - handleReset: limpa todos os filtros
  - handleApplyQuickFilter: aplica filtro rápido (últimos N dias)
  - handleDateChange: atualiza datas de/até
  - handleToggleModal: abre/fecha modais de seleção
  - handleToggleExpanded: expande/colapsa filtros
- Formata datas para exibição (pt-BR)
```

#### Container (`ExtractFilters.tsx`)

```typescript
- Conecta useFiltersAdapter à View
- Recebe callbacks de mudança de filtro e reset
- Passa estado e ações para a View
```

#### View (`ExtractFiltersView.tsx`)

```typescript
- Componente stateless puro
- Renderiza interface completa de filtros:
  - Campo de busca por descrição
  - Filtros rápidos (7, 15, 30 dias)
  - Seletores customizados (tipo, status, categoria)
  - Date pickers (data de/até)
  - Botão de limpar filtros
- Sub-componentes internos:
  - CustomSelect: selector estilizado
  - SelectModal: modal de seleção com lista
```

**Linha de dependência**: Domain ← Infrastructure ← Container ← View

---

## Princípios Aplicados

### 1. Single Responsibility Principle (SRP)

- Cada componente tem uma única responsabilidade clara
- Domain: Define tipos e contratos
- Infrastructure: Implementa lógica de negócio
- Presentation: Container conecta, View renderiza

### 2. Dependency Inversion Principle (DIP)

- Views dependem de abstrações (props/interfaces)
- Não há dependência direta de implementações
- Container injeta dependências na View

### 3. Separation of Concerns

- Estado separado de UI
- Lógica separada de apresentação
- Tipos/contratos separados de implementação

### 4. Testability

- Views stateless são fáceis de testar (snapshot tests)
- Adapters podem ser testados isoladamente
- Containers testáveis com mocks dos adapters

### 5. Reusability

- Views podem ser reutilizadas com diferentes containers
- Adapters podem ser usados por diferentes views
- Componentes puros (SimplePagination) reutilizáveis em qualquer contexto

---

## Compatibilidade com Código Antigo

Todos os componentes mantêm compatibilidade via re-exports em:

```
src/components/UserRoutes/Extrato/components/
├── index.tsx
├── TransactionItem.tsx
├── SimplePagination.tsx
└── ExtractFilters.tsx
```

Cada arquivo de compatibilidade apenas re-exporta o componente da nova estrutura:

```typescript
export { ComponentName } from "../../../../presentation/extrato/components/ComponentName";
```

Isso garante que:

- Código antigo continue funcionando sem alterações
- Novos desenvolvimentos usem a estrutura Clean
- Migração gradual seja possível

---

## Patterns Utilizados

### Container/Presenter Pattern

- **Container**: Gerencia estado e lógica (TransactionItem, ExtractFilters)
- **Presenter/View**: Componente stateless que apenas renderiza (todas as Views)

### Adapter Pattern

- `useFiltersAdapter`: Adapta lógica de filtros para interface esperada pela View
- Desacopla implementação de apresentação

### Facade Pattern

- `index.tsx` na camada de apresentação
- Fornece interface simplificada para importação de componentes

---

## Exemplo de Fluxo: Alterar Filtro

1. **User**: Clica em selector de tipo de transação
2. **View**: Chama `actions.onToggleModal('showTransactionTypeModal')`
3. **Container**: Passa ação para adapter
4. **Adapter**: Atualiza `modalsState.showTransactionTypeModal = true`
5. **View**: Re-renderiza com modal visível
6. **User**: Seleciona "Depósito"
7. **View**: Chama `actions.onFilterChange('type', 'deposit')`
8. **Adapter**:
   - Atualiza `filters.type = 'deposit'`
   - Chama `onFilterChange(newFilters)` (callback do componente pai)
9. **Extrato**: Recebe novos filtros e re-carrega transações

---

## Benefícios da Arquitetura

1. **Manutenibilidade**: Mudanças de UI não afetam lógica
2. **Testabilidade**: Cada camada testável isoladamente
3. **Escalabilidade**: Fácil adicionar novos filtros/funcionalidades
4. **Legibilidade**: Separação clara de responsabilidades
5. **Reusabilidade**: Componentes podem ser reutilizados
6. **Type Safety**: TypeScript garante contratos entre camadas

---

## Próximos Passos

1. Aplicar mesma arquitetura aos componentes restantes (Home, Dashboard)
2. Criar testes unitários para adapters
3. Criar snapshot tests para views
4. Documentar padrões de erro handling
5. Adicionar logs para debug
