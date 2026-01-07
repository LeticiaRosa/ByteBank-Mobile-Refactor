````markdown
# Clean Architecture - Login Module

## 📁 Estrutura de Camadas

```
src/
├── presentation/          # Camada de Apresentação
│   └── login/
│       ├── LoginForm.tsx         # Container com lógica
│       └── LoginFormView.tsx     # Componente visual puro
│
├── domain/               # Camada de Domínio
│   └── login/
│       └── LoginState.ts         # Tipos e interfaces do domínio
│
├── infrastructure/       # Camada de Infraestrutura
│   └── login/
│       └── useLoginAdapter.ts    # Adapter para hooks (useAuth, useTheme, useToast)
│
└── components/
    └── UserRoutes/
        └── Login/
            └── index.tsx         # Componente de compatibilidade (mantém imports antigos)
```

## 🏗️ Princípios Aplicados

### 1. **Separação de Responsabilidades**

- **Domain** (`LoginState.ts`):

  - Define tipos: `LoginMode`, `LoginFormData`, `LoginState`
  - Define interface de ações: `LoginFormActions`
  - Camada independente de frameworks

- **Infrastructure** (`useLoginAdapter.ts`):

  - Adapta hooks existentes (useAuth, useTheme, useToast)
  - Gerencia estado local do formulário
  - Implementa lógica de validação e submit
  - Isola implementações técnicas

- **Presentation**:
  - `LoginForm.tsx`: Container (conecta adapter com view)
  - `LoginFormView.tsx`: Presenter (apenas renderização, stateless)

### 2. **Inversão de Dependência**

```
Hooks originais (useAuth, useTheme, useToast)
    ↓
useLoginAdapter (adapta para o domínio)
    ↓
LoginForm (container)
    ↓
LoginFormView (componente visual puro)
```

- A camada de apresentação não depende diretamente dos hooks
- O adapter isola as implementações técnicas
- Fácil trocar implementações sem alterar a UI

### 3. **Container/Presenter Pattern**

- **LoginForm.tsx**: Container com lógica

  - Conecta com o adapter
  - Passa dados e callbacks para a view

- **LoginFormView.tsx**: Presenter puro
  - Recebe tudo via props
  - Não gerencia estado
  - Fácil de testar e reutilizar

### 4. **Single Responsibility Principle (SOLID)**

Cada arquivo tem uma única responsabilidade:

- **LoginState.ts**: Define o domínio
- **useLoginAdapter.ts**: Adapta hooks e gerencia estado
- **LoginForm.tsx**: Orquestra a lógica
- **LoginFormView.tsx**: Renderiza a UI

## 🔄 Fluxo de Dados

```
1. User Action (LoginFormView)
    ↓
2. Callback (LoginForm)
    ↓
3. Action (useLoginAdapter)
    ↓
4. Hook Original (useAuth, useToast)
    ↓
5. Backend API (Supabase)
```

## 📦 Componentes

### Domain Layer

#### `LoginState.ts`

```typescript
- LoginMode: "login" | "signup"
- LoginFormData: { email, password, fullName? }
- LoginState: estado completo do formulário
- LoginFormActions: interface de ações disponíveis
```

### Infrastructure Layer

#### `useLoginAdapter.ts`

```typescript
- Adapta useAuth, useTheme, useToast
- Gerencia estado local (email, password, fullName, etc)
- Implementa validações
- Implementa handleLogin, handleSignUp, etc
- Retorna LoginAdapter interface
```

### Presentation Layer

#### `LoginForm.tsx`

```typescript
- Container component
- Usa useLoginAdapter
- Conecta adapter com LoginFormView
- Passa props e callbacks
```

#### `LoginFormView.tsx`

```typescript
- Componente stateless (puro)
- Recebe tudo via props
- Apenas renderização visual
- Fácil de testar com diferentes estados
```

### Compatibility Layer

#### `components/UserRoutes/Login/index.tsx`

```typescript
- Mantém imports antigos funcionando
- Re-exporta LoginForm
- Garante compatibilidade com código existente
```

## ✅ Benefícios

1. **Testabilidade**

   - LoginFormView pode ser testado com props mockadas
   - useLoginAdapter pode ser testado isoladamente
   - Não precisa mockar hooks diretamente

2. **Manutenibilidade**

   - Responsabilidades claras
   - Fácil encontrar e modificar lógica
   - Mudanças isoladas em cada camada

3. **Escalabilidade**

   - Fácil adicionar novos métodos de autenticação
   - Fácil adicionar novos campos ao formulário
   - Fácil trocar providers (Supabase → Firebase, etc)

4. **Reutilização**

   - LoginFormView pode ser usado em diferentes contextos
   - useLoginAdapter pode ser compartilhado
   - Lógica centralizada

5. **Compatibilidade**
   - Imports antigos continuam funcionando
   - Migração gradual sem quebrar código existente
   - Zero breaking changes

## 🎯 Comparação: Antes vs Depois

### Antes (Componente Monolítico)

```tsx
// src/components/UserRoutes/Login/index.tsx
- 277 linhas de código
- Mistura UI + lógica + estado
- Difícil de testar
- Acoplado aos hooks
- Difícil de reutilizar
```

### Depois (Clean Architecture)

```
Domain:       LoginState.ts (30 linhas)
Infrastructure: useLoginAdapter.ts (130 linhas)
Presentation:  LoginForm.tsx (25 linhas)
Presentation:  LoginFormView.tsx (290 linhas)
Compatibility: index.tsx (8 linhas)

Total: 5 arquivos com responsabilidades claras
- Fácil de testar cada camada
- Fácil de manter
- Fácil de estender
- Imports antigos continuam funcionando
```

## 📝 Exemplos de Uso

### Uso Normal (compatível com código antigo)

```tsx
import { Login } from "../../components/UserRoutes/Login";

// Funciona exatamente como antes
<Login />;
```

### Uso da Nova Arquitetura (recomendado)

```tsx
import { LoginForm } from "../../presentation/login/LoginForm";

<LoginForm />;
```

### Uso Apenas da View (para testes ou customização)

```tsx
import { LoginFormView } from "../../presentation/login/LoginFormView";

// Passar todas as props necessárias
<LoginFormView
  mode="login"
  formData={{ email: "", password: "" }}
  showPassword={false}
  loading={false}
  isDark={false}
  onLogin={handleLogin}
  // ... outras props
/>;
```

## 🔍 Testes

### Testando a View (Componente Puro)

```tsx
// LoginFormView.test.tsx
import { render, fireEvent } from "@testing-library/react-native";
import { LoginFormView } from "./LoginFormView";

test("should call onLogin when button is pressed", () => {
  const onLogin = jest.fn();
  const { getByText } = render(
    <LoginFormView
      mode="login"
      formData={{ email: "test@test.com", password: "123456" }}
      onLogin={onLogin}
      // ... outras props
    />
  );

  fireEvent.press(getByText("Entrar"));
  expect(onLogin).toHaveBeenCalled();
});
```

### Testando o Adapter

```tsx
// useLoginAdapter.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useLoginAdapter } from "./useLoginAdapter";

test("should toggle mode from login to signup", () => {
  const { result } = renderHook(() => useLoginAdapter());

  expect(result.current.mode).toBe("login");

  act(() => {
    result.current.actions.toggleMode();
  });

  expect(result.current.mode).toBe("signup");
});
```

## 📚 Próximos Passos

Para continuar aplicando Clean Architecture:

1. ✅ Login/Signup - **CONCLUÍDO**
2. 🔄 Profile (perfil do usuário)
3. 🔄 Transactions (lista de transações)
4. 🔄 Home/Dashboard
5. 🔄 Banking operations (depósito, saque, transferência)

## 🎓 Referências

- Clean Architecture (Robert C. Martin)
- SOLID Principles
- Container/Presenter Pattern
- Separation of Concerns
- Dependency Inversion Principle
````
