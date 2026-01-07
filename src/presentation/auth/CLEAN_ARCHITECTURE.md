# Clean Architecture - Estrutura Aplicada

## 📁 Estrutura de Camadas

```
src/
├── presentation/          # Camada de Apresentação
│   └── auth/
│       ├── AuthForm.tsx          # Container com lógica
│       └── AuthFormView.tsx      # Componente visual puro
│
├── domain/               # Camada de Domínio
│   └── auth/
│       └── AuthState.ts          # Tipos e interfaces do domínio
│
├── infrastructure/       # Camada de Infraestrutura
│   └── auth/
│       └── useAuthAdapter.ts     # Adapter para o hook useAuth
│
└── hooks/
    └── useAuth.ts               # Implementação original (mantida)
```

## 🏗️ Princípios Aplicados

### 1. **Separação de Responsabilidades**

- **Domain**: Define o que é um User e AuthState (regras de negócio)
- **Infrastructure**: Adapta implementações técnicas (Supabase) para o domínio
- **Presentation**: Gerencia UI e lógica de apresentação

### 2. **Inversão de Dependência**

- A camada de apresentação depende da abstração (AuthAdapter)
- A infraestrutura implementa essa abstração
- Fácil trocar Supabase por outra solução sem alterar a UI

### 3. **Container/Presenter Pattern**

- `AuthForm.tsx`: Container (lógica, state management)
- `AuthFormView.tsx`: Presenter (apenas renderização)

## 🔄 Fluxo de Dados

```
useAuth (hooks)
    ↓
useAuthAdapter (infrastructure) - adapta para o domínio
    ↓
AuthForm (presentation) - container com lógica
    ↓
AuthFormView (presentation) - componente visual puro
```

## ✅ Benefícios

1. **Testabilidade**: Componentes visuais puros são fáceis de testar
2. **Manutenibilidade**: Cada camada tem responsabilidade clara
3. **Escalabilidade**: Fácil adicionar novos provedores de autenticação
4. **Reutilização**: AuthFormView pode ser usado em diferentes contextos
5. **Compatibilidade**: Mantém imports antigos funcionando

## 📝 Próximos Passos

Para continuar aplicando Clean Architecture no projeto:

1. Refatorar outros componentes (Home, Profile, Transactions)
2. Criar adapters para outros hooks (useTransactions, useBankAccounts)
3. Mover lógica de negócio para a camada de domínio
4. Criar casos de uso específicos quando necessário
