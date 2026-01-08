# Home - Clean Architecture

Refatoração do componente Home seguindo o padrão Clean Architecture estabelecido em `AuthFormView.tsx`.

## 📁 Estrutura de Arquivos

```
src/
├── domain/home/
│   └── HomeState.ts                 # Estados, ações e constantes
│
├── infrastructure/home/
│   └── useHomeAdapter.ts            # Adapter que gerencia lógica e dados
│
└── presentation/home/
    ├── Home.tsx                     # Container
    └── HomeView.tsx                 # View stateless
```

## 🎯 Componente Home

**Responsabilidade**: Dashboard principal do aplicativo com saldo, receitas, gastos e gráficos.

### Domain Layer (`HomeState.ts`)

**Define:**

- `HomeState`: Estado completo do dashboard
  - Saldo reativo em tempo real
  - Resumo financeiro mensal (receitas/gastos)
  - Estados de loading
  - Estado das animações
- `HomeActions`: Ações disponíveis (startAnimations)
- `HOME_CONSTANTS`: Configuração de animações
- `AnimationConfig`: Tipo para configuração de animações

### Infrastructure Layer (`useHomeAdapter.ts`)

**Gerencia:**

- Hook `useReactiveBalance`: Saldo em tempo real com RxJS + Supabase Realtime
- Hook `useMonthlyFinancialSummary`: Receitas/gastos mensais
- Hook `useStaggeredAnimation`: Animações escalonadas dos cards
- Efeito colateral: Iniciar animações quando dados carregam
- Retorna estado, ações e função `getAnimatedStyle`

**Dependências:**

```typescript
- useReactiveBalance (saldo reativo)
- useMonthlyFinancialSummary (resumo mensal)
- useStaggeredAnimation (animações)
```

### Presentation Layer

#### Container (`Home.tsx`)

```typescript
- Conecta useHomeAdapter à HomeView
- Passa state, actions e getAnimatedStyle
- Componente de 15 linhas
```

#### View (`HomeView.tsx`)

```typescript
- Componente stateless puro
- Recebe state, actions e getAnimatedStyle via props
- Renderiza:
  - ScrollView com 6 seções animadas
  - AccountInfos (Saldo, Receitas, Gastos)
  - ExpensesPieChart (Gráfico de pizza - gastos por categoria)
  - BalanceChart (Gráfico de linha - evolução do saldo)
  - MonthlyRevenueChart (Gráfico de barras - receitas mensais)
- Usa AnimatedSection para animar cada card
- Estilos inline com StyleSheet
```

## 🔄 Fluxo de Dados

### Carregamento Inicial

```
1. Home (Container) instanciado
   ↓
2. useHomeAdapter executado:
   - useReactiveBalance busca saldo em tempo real
   - useMonthlyFinancialSummary calcula resumo mensal
   - useStaggeredAnimation prepara animações
   ↓
3. useEffect detecta que dados carregaram:
   - startAnimations() é chamado
   ↓
4. HomeView re-renderiza com dados:
   - state.animationsStarted = true
   - Cada AnimatedSection anima na ordem (0→5)
   ↓
5. Cards aparecem com efeito stagger (escalonado)
```

### Atualização em Tempo Real (RxJS + Supabase)

```
1. Nova transação criada/atualizada no Supabase
   ↓
2. Supabase Realtime envia evento
   ↓
3. RxJS Observable (useReactiveBalance) recebe evento
   ↓
4. state.realtimeBalance atualizado
   ↓
5. HomeView re-renderiza AccountInfos de saldo
   ↓
6. Valor atualizado aparece instantaneamente
```

## 📊 Componentes Filhos

O Home renderiza 4 tipos de componentes:

### 1. AccountInfos

- Exibe saldo, receitas ou gastos
- Props: title, amount, icon, colorType, etc.
- Suporta toggle de visibilidade (olho)
- Indicador de conexão real-time

### 2. BalanceChart

- Gráfico de linha (LineChart)
- Hook: `useMonthlyBalanceData`
- Mostra evolução do saldo ao longo dos meses

### 3. ExpensesPieChart

- Gráfico de pizza (PieChart)
- Hook: `useExpensesByCategory`
- Top 5 categorias + "Outras"

### 4. MonthlyRevenueChart

- Gráfico de barras (BarChart)
- Hook: `useMonthlyBalanceData`
- Mostra receitas mês a mês

## ✨ Features Especiais

### 🚀 Saldo Reativo (Real-time)

```typescript
const { balance, isConnected, isLoading } = useReactiveBalance();
```

- Atualização instantânea via Supabase Realtime
- Indicador visual de conexão (`isRealtimeConnected`)
- Baseado em RxJS Observables

### 📊 Resumo Financeiro Mensal

```typescript
const {
  monthlyRevenue, // Receitas do mês atual (centavos)
  monthlyExpenses, // Gastos do mês atual (centavos)
  revenueGrowth, // "+15%" ou "-5%"
  expensesGrowth, // "+10%" ou "-8%"
  isLoading,
} = useMonthlyFinancialSummary();
```

### ✨ Animações Escalonadas

```typescript
const { startAnimations, getAnimatedStyle } = useStaggeredAnimation({
  itemCount: 6,
  duration: 600,
  staggerDelay: 150,
  initialDelay: 200,
});
```

- Cada card aparece com 150ms de diferença
- Efeito visual profissional de entrada
- Total de 6 seções animadas

## 🎨 Código de Cores

```typescript
iconColor = theme.primary; // Ícone do saldo (carteira)
successColor = colors.charts.main.green; // Receitas (verde)
destructiveColor = theme.destructive; // Gastos (vermelho)
```

## 📈 Métricas da Refatoração

| Métrica                            | Antes | Depois        |
| ---------------------------------- | ----- | ------------- |
| Linhas (index.tsx)                 | 134   | 6 (re-export) |
| Container (Home.tsx)               | N/A   | 15            |
| Adapter (useHomeAdapter.ts)        | N/A   | 60            |
| View (HomeView.tsx)                | N/A   | 135           |
| **Separação de Responsabilidades** | ❌    | ✅            |
| **Testabilidade**                  | Baixa | Alta          |

## ✅ Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)

- Domain: Define contratos
- Infrastructure: Gerencia dados e estado
- Presentation: Container conecta, View renderiza

### Dependency Inversion Principle (DIP)

- HomeView depende de abstrações (props)
- Não conhece implementação dos hooks
- Container injeta dependências

### Open/Closed Principle (OCP)

- Fácil adicionar novos cards sem modificar código existente
- AnimatedSection é extensível

## 🔗 Compatibilidade

```typescript
// Import antigo (ainda funciona)
import { Home } from "../components/UserRoutes/Home";

// Import novo (recomendado)
import { Home } from "../presentation/home/Home";
```

Re-export em: `src/components/UserRoutes/Home/index.tsx`

## 🚀 Próximos Passos

- [ ] Aplicar Clean Architecture aos sub-componentes (AccountInfos, Charts)
- [ ] Criar testes unitários para `useHomeAdapter`
- [ ] Criar snapshot tests para `HomeView`
- [ ] Adicionar error boundaries
- [ ] Implementar retry logic para falhas de conexão
