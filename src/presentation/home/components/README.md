# Clean Architecture - Home Components

## 📁 Estrutura Aplicada

```
src/presentation/home/components/
├── AccountInfos.tsx              # Container com lógica e estado
├── AccountInfosView.tsx          # Componente visual puro
├── BalanceChart.tsx              # Container com lógica de dados
├── BalanceChartView.tsx          # Componente visual puro
├── ExpensesPieChart.tsx          # Container com lógica de dados
├── ExpensesPieChartView.tsx      # Componente visual puro
├── MonthlyRevenueChart.tsx       # Container com lógica de dados
├── MonthlyRevenueChartView.tsx   # Componente visual puro
├── index.ts                      # Barrel export
└── README.md                     # Esta documentação
```

## 🏗️ Princípios Aplicados

### 1. **Container/Presenter Pattern**

Cada componente foi dividido em duas partes:

- **Container** (ex: `AccountInfos.tsx`): Gerencia estado, lógica de negócio, hooks e animações
- **View** (ex: `AccountInfosView.tsx`): Apenas renderização, recebe props e exibe UI

### 2. **Separação de Responsabilidades (Single Responsibility Principle)**

- **Views**: Responsabilidade única de renderizar UI baseada em props
- **Containers**: Responsabilidade única de gerenciar estado e lógica

### 3. **Inversão de Dependência**

- Views não conhecem nada sobre hooks, estado ou lógica de negócio
- Containers podem ser facilmente testados mockando os hooks
- Views podem ser testadas com props simuladas

## 📊 Componentes Refatorados

### AccountInfos

**Responsabilidades do Container:**

- Gerenciar estado de visibilidade do saldo (`isBalanceVisible`)
- Controlar animações (scale, opacity)
- Aplicar tema e estilos
- Formatar valores (moeda/número)
- Determinar classes de cor baseadas no tipo

**Responsabilidades da View:**

- Renderizar card com informações
- Exibir skeleton durante loading
- Mostrar/ocultar valor com base em `isBalanceVisible`
- Renderizar ícone de olho (Eye/EyeOff)
- Exibir indicador de conexão real-time

### BalanceChart

**Responsabilidades do Container:**

- Buscar dados usando `useMonthlyBalanceData`
- Preparar dados para o formato do gráfico
- Configurar tema e estilos do gráfico
- Verificar se há dados disponíveis

**Responsabilidades da View:**

- Renderizar gráfico de linha (LineChart)
- Exibir estados de loading/error/sem dados
- Aplicar configurações visuais do gráfico

### ExpensesPieChart

**Responsabilidades do Container:**

- Buscar dados usando `useExpensesByCategory`
- Ordenar e processar categorias (top 5 + outras)
- Converter valores de centavos para reais
- Aplicar cores do tema ao gráfico
- Configurar legendas

**Responsabilidades da View:**

- Renderizar gráfico de pizza (PieChart)
- Exibir animações de entrada (FadeInView)
- Mostrar estados de loading/error/sem dados

### MonthlyRevenueChart

**Responsabilidades do Container:**

- Buscar dados usando `useMonthlyBalanceData`
- Preparar dados de receitas mensais
- Configurar tema e estilos do gráfico de barras
- Verificar disponibilidade de dados

**Responsabilidades da View:**

- Renderizar gráfico de barras (BarChart)
- Permitir scroll horizontal
- Exibir valores no topo das barras
- Mostrar estados de loading/error/sem dados

## 🔄 Fluxo de Dados

```
Hooks (useDashboardsCharts, useTheme)
    ↓
Container (lógica + estado + preparação de dados)
    ↓
View (renderização pura baseada em props)
```

## ✅ Benefícios

1. **Testabilidade**:

   - Views podem ser testadas com props simuladas
   - Containers podem ser testados mockando hooks

2. **Manutenibilidade**:

   - Separação clara entre lógica e UI
   - Fácil identificar onde fazer mudanças

3. **Reutilização**:

   - Views podem ser usadas em diferentes contextos
   - Containers podem trocar de View facilmente

4. **Legibilidade**:

   - Código mais organizado e fácil de entender
   - Responsabilidades bem definidas

5. **Performance**:
   - Otimizações podem ser aplicadas de forma isolada
   - Re-renders mais controlados

## 📝 Como Usar

### Importação Simples

```tsx
import {
  AccountInfos,
  BalanceChart,
  ExpensesPieChart,
  MonthlyRevenueChart,
} from "@/presentation/home/components";
```

### Uso em Telas

```tsx
<AccountInfos
  title="Saldo Disponível"
  amount={1500.50}
  isLoadingAccounts={false}
  colorType="primary"
  formatType="currency"
  isRealtimeConnected={true}
/>

<BalanceChart />
<ExpensesPieChart />
<MonthlyRevenueChart />
```

## 🔄 Compatibilidade

Os componentes antigos em `/src/components/UserRoutes/Home/components/` podem ser mantidos temporariamente para garantir compatibilidade. Para migrar:

1. Atualize imports de `@/components/UserRoutes/Home/components` para `@/presentation/home/components`
2. Teste a funcionalidade
3. Remova os componentes antigos quando não houver mais referências

## 🎯 Próximos Passos

1. Aplicar o mesmo padrão aos componentes de outras telas
2. Criar testes unitários para Views (componentes puros)
3. Criar testes de integração para Containers
4. Considerar usar Context API para compartilhar tema globalmente
5. Implementar memoization (React.memo) nas Views para otimização
