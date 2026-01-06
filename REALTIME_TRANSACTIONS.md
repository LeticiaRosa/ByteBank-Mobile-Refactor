# Sistema de Transações em Tempo Real

## 📦 Arquivos Criados

- `src/services/reactive/transactions.service.ts` - Serviço RxJS para transações
- `src/hooks/useReactiveTransactions.ts` - Hook React para transações realtime

## 🚀 Como Usar

### 1. Hook Principal (Recomendado)

```tsx
import { useTransactions } from "@/hooks/useTransactions";

function MinhasTransacoes() {
  const {
    transactions, // Transaction[] - atualizado em tempo real
    isLoadingTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions();

  // As transações são atualizadas automaticamente quando:
  // - Uma nova transação é criada (INSERT)
  // - Uma transação existente é editada (UPDATE)
  // - Uma transação é deletada (DELETE)

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      onRefresh={refreshTransactions}
      refreshing={isLoadingTransactions}
    />
  );
}
```

### 2. Hook Realtime Direto

```tsx
import { useReactiveTransactions } from "@/hooks/useReactiveTransactions";

function Dashboard() {
  const {
    transactions,
    isConnected, // Status da conexão realtime
    isLoading,
    lastUpdate, // Última transação que mudou
  } = useReactiveTransactions();

  // Exibir indicador de conexão
  return (
    <View>
      <Text>Status: {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}</Text>
      <Text>Total: {transactions.length} transações</Text>

      {lastUpdate && (
        <Text>
          Última atualização: {lastUpdate.eventType} -
          {lastUpdate.transaction.transaction_type}
        </Text>
      )}
    </View>
  );
}
```

### 3. Hooks Especializados

```tsx
import {
  useTransactionsList,
  useNewTransactions,
  useTransactionsByType,
  useTransactionsByStatus,
} from "@/hooks/useReactiveTransactions";

// Apenas a lista de transações
function SimpleList() {
  const transactions = useTransactionsList();
  return <List data={transactions} />;
}

// Receber notificação de novas transações
function Notifications() {
  useNewTransactions((newTransaction) => {
    Toast.show({
      type: "success",
      text1: "Nova transação!",
      text2: `${newTransaction.transaction_type} - R$ ${newTransaction.amount}`,
    });
  });

  return null;
}

// Filtrar por tipo
function Deposits() {
  const deposits = useTransactionsByType("deposit");
  return <List data={deposits} />;
}

// Filtrar por status
function PendingTransactions() {
  const pending = useTransactionsByStatus("pending");
  return <List data={pending} />;
}
```

### 4. Uso Direto do Serviço (Avançado)

```tsx
import { useEffect, useState } from "react";
import { transactionsService } from "@/services/reactive/transactions.service";

function CustomComponent() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    // Subscrever apenas a depósitos
    const subscription = transactionsService
      .getTransactionsByType$("deposit")
      .subscribe(setDeposits);

    return () => subscription.unsubscribe();
  }, []);

  return <List data={deposits} />;
}
```

## 🔄 Eventos em Tempo Real

O sistema detecta automaticamente:

### INSERT (Nova Transação)

```typescript
// Quando uma transação é criada
const { createTransaction } = useTransactions();
await createTransaction({
  transaction_type: "deposit",
  amount: 100,
  // ...
});
// ✅ Todos os componentes com useTransactions/useReactiveTransactions
//    recebem a nova transação automaticamente
```

### UPDATE (Edição)

```typescript
// Quando uma transação é editada
const { updateTransaction } = useTransactions();
await updateTransaction(transactionId, {
  description: "Nova descrição",
});
// ✅ A transação é atualizada na lista automaticamente
```

### DELETE (Exclusão)

```typescript
// Quando uma transação é deletada
const { deleteTransaction } = useTransactions();
await deleteTransaction(transactionId);
// ✅ A transação é removida da lista automaticamente
```

## 🎯 Benefícios

1. **Sincronização Automática**: Mudanças aparecem instantaneamente em todos os componentes
2. **Performance**: Usa RxJS para gerenciar subscriptions de forma eficiente
3. **Cache Inteligente**: Primeira carga vem do banco, depois só updates incrementais
4. **Sem Polling**: Não precisa ficar fazendo refresh periódico
5. **Multi-componente**: Vários componentes podem usar sem duplicar conexões

## ⚙️ Configuração do Supabase

Para funcionar, a tabela `transactions` precisa ter Realtime habilitado:

```sql
-- 1. Habilitar REPLICA IDENTITY
ALTER TABLE transactions REPLICA IDENTITY FULL;

-- 2. Adicionar à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
```

## 🔍 Debug

Todos os logs têm prefixo `[TransactionsService]`:

```
🚀 [TransactionsService] Iniciando stream de transações
⏳ [TransactionsService] Buscando transações iniciais...
✅ [TransactionsService] Transações iniciais carregadas: 42
🔌 [TransactionsService] Configurando canal Realtime...
✅ [TransactionsService] Canal Realtime inscrito com sucesso
📡 [TransactionsService] EVENTO REALTIME RECEBIDO!
➕ [TransactionsService] Nova transação: {...}
```

## 🆚 Comparação com Sistema Anterior

### Antes (React Query com Polling)

```tsx
const { data, refetch } = useTransactionsList();

// Precisa atualizar manualmente
useEffect(() => {
  const interval = setInterval(refetch, 5000);
  return () => clearInterval(interval);
}, []);
```

### Agora (Realtime)

```tsx
const { transactions } = useTransactions();

// Atualiza automaticamente! 🎉
// Sem polling, sem interval, sem refetch manual
```

## 📚 Recursos Extras

### Observable com Debounce

```tsx
useEffect(() => {
  const sub = transactionsService.transactions$
    .pipe(debounceTime(500))
    .subscribe(setTransactions);

  return () => sub.unsubscribe();
}, []);
```

### Filtrar Apenas Inserções

```tsx
useEffect(() => {
  const sub = transactionsService
    .getUpdatesByEventType$("INSERT")
    .subscribe((update) => {
      console.log("Nova transação:", update.transaction);
    });

  return () => sub.unsubscribe();
}, []);
```

### Estado da Conexão

```tsx
const { connectionState } = useReactiveTransactions();

console.log({
  isConnected: connectionState.isConnected,
  accountId: connectionState.accountId,
  lastUpdate: connectionState.lastUpdate,
  error: connectionState.error,
});
```
