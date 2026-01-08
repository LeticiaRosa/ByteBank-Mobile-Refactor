# Clean Architecture - Componentes do Home

## ✅ Arquitetura Completa Aplicada

Todos os componentes do Home foram refatorados seguindo a **Clean Architecture** com separação completa de camadas.

## 📁 Estrutura de Camadas

```
src/
├── domain/home/components/               # Camada de Domínio
│   ├── AccountInfosState.ts             # Tipos, interfaces e regras de negócio
│   ├── ChartState.ts                    # Tipos comuns para gráficos
│   ├── ExpensesCategoryState.ts         # Regras de gastos por categoria
│   └── index.ts                         # Barrel export
│
├── infrastructure/home/components/       # Camada de Infraestrutura
│   ├── useAccountInfosAdapter.ts        # Adapter para AccountInfos
│   ├── useBalanceChartAdapter.ts        # Adapter para BalanceChart
│   ├── useExpensesPieChartAdapter.ts    # Adapter para ExpensesPieChart
│   ├── useMonthlyRevenueChartAdapter.ts # Adapter para MonthlyRevenueChart
│   └── index.ts                         # Barrel export
│
└── presentation/home/components/         # Camada de Apresentação
    ├── AccountInfos.tsx                 # Container (usa adapter)
    ├── AccountInfosView.tsx             # View pura
    ├── BalanceChart.tsx                 # Container (usa adapter)
    ├── BalanceChartView.tsx             # View pura
    ├── ExpensesPieChart.tsx             # Container (usa adapter)
    ├── ExpensesPieChartView.tsx         # View pura
    ├── MonthlyRevenueChart.tsx          # Container (usa adapter)
    ├── MonthlyRevenueChartView.tsx      # View pura
    └── index.ts                         # Barrel export
```

## 🏗️ Responsabilidades de Cada Camada

### 1. Domain (Domínio)

**O que é**: Regras de negócio, tipos e interfaces. Núcleo da aplicação.

**Responsabilidades**:

- Definir tipos e interfaces
- Implementar regras de negócio puras
- Não depende de nenhuma outra camada
- Não conhece frameworks ou bibliotecas externas

**Exemplos**:

- `AccountInfosState.ts`: Define tipos de props, estado, ações e regras (formatação, validação)
- `ChartState.ts`: Define tipos comuns de gráficos e regras de processamento de dados
- `ExpensesCategoryState.ts`: Regras de ordenação, agrupamento e formatação de gastos

### 2. Infrastructure (Infraestrutura)

**O que é**: Adapters que conectam o mundo externo (hooks, APIs, tema) ao domínio.

**Responsabilidades**:

- Conectar hooks de dados (`useMonthlyBalanceData`, `useExpensesByCategory`)
- Aplicar tema da aplicação
- Gerenciar animações
- Processar dados usando regras do domínio
- Retornar dados no formato esperado pelo domínio

**Exemplos**:

- `useAccountInfosAdapter.ts`: Gerencia estado, animações, tema e formatação
- `useBalanceChartAdapter.ts`: Busca dados e prepara para o gráfico usando regras do domínio
- `useExpensesPieChartAdapter.ts`: Processa categorias usando `EXPENSES_CATEGORY_RULES`

### 3. Presentation (Apresentação)

**O que é**: Componentes visuais que apenas renderizam UI.

**Responsabilidades**:

- Container: Usa adapter da infrastructure e passa dados para View
- View: Recebe props e renderiza UI pura (stateless)
- Não contém lógica de negócio
- Não conecta diretamente com hooks ou APIs

**Exemplos**:

- `AccountInfos.tsx`: Container que usa `useAccountInfosAdapter` e passa para View
- `AccountInfosView.tsx`: View pura que apenas renderiza com base em props

## 🔄 Fluxo de Dados

```
External (Hooks, APIs)
    ↓
Infrastructure (Adapters)
    ↓ (usa regras do)
Domain (Regras de Negócio)
    ↓
Presentation (Container)
    ↓
Presentation (View)
```

## 📊 Exemplo Completo: AccountInfos

### 1. Domain Layer

```typescript
// AccountInfosState.ts
export interface AccountInfosProps {
  amount: number;
  colorType?: "primary" | "success" | "destructive";
  // ...
}

export const ACCOUNT_INFOS_RULES = {
  formatValue: (value: number, formatType: "currency" | "number") => {
    // Regra de negócio pura
  },
  getColorClass: (colorType) => {
    // Regra de negócio pura
  },
};
```

### 2. Infrastructure Layer

```typescript
// useAccountInfosAdapter.ts
export function useAccountInfosAdapter(props: AccountInfosProps) {
  // Conecta hooks externos
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  // Gerencia estado
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Usa regras do domínio
  const formatValue = (value: number) =>
    ACCOUNT_INFOS_RULES.formatValue(value, props.formatType);

  // Retorna tudo para a apresentação
  return { ...props, isBalanceVisible, formatValue, theme };
}
```

### 3. Presentation Layer

```typescript
// AccountInfos.tsx (Container)
export function AccountInfos(props: AccountInfosProps) {
  const viewState = useAccountInfosAdapter(props);
  return <AccountInfosView {...viewState} />;
}

// AccountInfosView.tsx (View)
export function AccountInfosView({ amount, formatValue, ... }: ViewState) {
  return <View>...</View>; // Apenas renderização
}
```

## ✅ Princípios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)

- **Domain**: Apenas regras de negócio
- **Infrastructure**: Apenas adaptação de dados externos
- **Presentation**: Apenas renderização

### 2. Open/Closed Principle (OCP)

- Aberto para extensão: Novos adapters podem ser criados
- Fechado para modificação: Regras do domínio não mudam

### 3. Liskov Substitution Principle (LSP)

- Adapters podem ser substituídos sem quebrar a aplicação

### 4. Interface Segregation Principle (ISP)

- Views recebem apenas as props necessárias
- Interfaces específicas para cada responsabilidade

### 5. Dependency Inversion Principle (DIP)

- **Presentation** depende de abstrações (props do Domain)
- **Infrastructure** implementa essas abstrações
- Domain não depende de nada

## 🎯 Benefícios Alcançados

### 1. Testabilidade Máxima

```typescript
// Testar regras do domínio (sem mocks)
test("formatValue", () => {
  expect(ACCOUNT_INFOS_RULES.formatValue(1000, "currency")).toBe("R$ 1.000,00");
});

// Testar adapter (mocking hooks)
test("useAccountInfosAdapter", () => {
  mockUseTheme.mockReturnValue({ isDark: true });
  const result = useAccountInfosAdapter({ amount: 100 });
  expect(result.theme).toBeDefined();
});

// Testar view (props mockadas)
test("AccountInfosView", () => {
  render(<AccountInfosView {...mockProps} />);
  expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
});
```

### 2. Manutenibilidade

- Mudanças na UI: Editar apenas Views
- Mudanças em regras: Editar apenas Domain
- Mudanças em fontes de dados: Editar apenas Infrastructure

### 3. Reutilização

- Regras do domínio podem ser usadas em qualquer lugar
- Views podem ser usadas com diferentes adapters
- Adapters podem ser compostos

### 4. Independência de Framework

- Regras de negócio não conhecem React, React Native
- Fácil migrar para outro framework

### 5. Documentação Clara

- Estrutura auto-explicativa
- Cada camada tem propósito bem definido

## 📝 Como Usar

### Import Simplificado

```typescript
// Domain
import {
  AccountInfosProps,
  ACCOUNT_INFOS_RULES,
} from "@/domain/home/components";

// Infrastructure
import { useAccountInfosAdapter } from "@/infrastructure/home/components";

// Presentation
import { AccountInfos } from "@/presentation/home/components";
```

### Uso em Componentes

```typescript
// Usando o componente completo
<AccountInfos
  title="Saldo"
  amount={1500.5}
  colorType="primary"
  isLoadingAccounts={false}
/>;

// Ou criando adapter customizado
const customViewState = useAccountInfosAdapter({ amount: 100 });
<AccountInfosView {...customViewState} />;
```

## 🔄 Migração dos Componentes Antigos

**Status**: ✅ Migração completa

Os componentes antigos em `/src/components/UserRoutes/Home/components/` podem ser removidos após confirmar que não há regressões.

## 🚀 Próximos Passos

1. ✅ Aplicar mesma arquitetura em outras telas (Extrato, Perfil, Transações)
2. ⏳ Criar testes unitários para Domain (regras de negócio)
3. ⏳ Criar testes de integração para Infrastructure (adapters)
4. ⏳ Criar testes de componente para Presentation (views)
5. ⏳ Considerar memoization (React.memo) nas views
6. ⏳ Avaliar uso de Context API para tema global

## 📚 Comparação: Antes vs Depois

### Antes (Container/Presenter)

```
presentation/home/components/
├── AccountInfos.tsx        (lógica + estado)
└── AccountInfosView.tsx    (renderização)
```

**Problemas**:

- Lógica misturada com hooks
- Difícil testar regras de negócio
- Dependência direta de frameworks

### Depois (Clean Architecture)

```
domain/home/components/AccountInfosState.ts       (tipos + regras)
infrastructure/home/components/useAccountInfosAdapter.ts  (adapter)
presentation/home/components/AccountInfos.tsx     (container)
presentation/home/components/AccountInfosView.tsx (view)
```

**Vantagens**:

- Regras de negócio isoladas e testáveis
- Adapters reutilizáveis
- Views completamente independentes
- Fácil trocar implementações

## 🎓 Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- AuthForm - Exemplo base deste projeto

---

**Refatoração**: Janeiro 2026  
**Status**: ✅ Arquitetura Completa Implementada  
**Padrão**: Clean Architecture (Domain + Infrastructure + Presentation)
