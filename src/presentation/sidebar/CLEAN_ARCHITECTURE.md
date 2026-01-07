````markdown
# Clean Architecture - Sidebar/Navigation Module

## 📁 Estrutura de Camadas

```
src/
├── presentation/          # Camada de Apresentação
│   └── sidebar/
│       ├── Sidebar.tsx           # Container com lógica
│       └── SidebarView.tsx       # Componente visual puro
│
├── domain/               # Camada de Domínio
│   └── sidebar/
│       └── SidebarState.ts       # Tipos e interfaces do domínio
│
├── infrastructure/       # Camada de Infraestrutura
│   └── sidebar/
│       └── useSidebarAdapter.ts  # Adapter para hooks (useTheme, useNavigation)
│
└── components/
    └── UserRoutes/
        └── Sidebar/
            └── index.tsx         # Componente de compatibilidade (mantém imports antigos)
```

## 🏗️ Princípios Aplicados

### 1. **Separação de Responsabilidades**

- **Domain** (`SidebarState.ts`):

  - Define tipos: `NavigationScreen`, `SidebarConfig`, `SidebarTheme`
  - Define interface de ações: `SidebarActions`
  - Camada independente de frameworks (React Navigation)

- **Infrastructure** (`useSidebarAdapter.ts`):

  - Adapta hooks existentes (useTheme, useNavigation)
  - Mapeia cores do tema para o formato do Sidebar
  - Implementa ações de navegação
  - Isola React Navigation da apresentação

- **Presentation**:
  - `Sidebar.tsx`: Container (conecta adapter com view)
  - `SidebarView.tsx`: Presenter (apenas renderização do Drawer Navigator)

### 2. **Inversão de Dependência**

```
Hooks originais (useTheme, useNavigation)
    ↓
useSidebarAdapter (adapta para o domínio)
    ↓
Sidebar (container)
    ↓
SidebarView (componente visual puro)
```

- A camada de apresentação não depende diretamente dos hooks
- O adapter isola React Navigation e temas
- Fácil trocar React Navigation por outro router sem alterar a UI

### 3. **Container/Presenter Pattern**

- **Sidebar.tsx**: Container com lógica

  - Conecta com o adapter
  - Passa tema e callbacks para a view

- **SidebarView.tsx**: Presenter puro
  - Recebe tema via props
  - Não acessa hooks diretamente
  - Responsável por renderizar Drawer Navigator

### 4. **Single Responsibility Principle (SOLID)**

Cada arquivo tem uma única responsabilidade:

- **SidebarState.ts**: Define o domínio de navegação
- **useSidebarAdapter.ts**: Adapta hooks e mapeia temas
- **Sidebar.tsx**: Orquestra a lógica
- **SidebarView.tsx**: Renderiza o Drawer Navigator

## 🔄 Fluxo de Dados

```
1. User Action (SidebarView - pressiona botão/menu)
    ↓
2. Callback (Sidebar)
    ↓
3. Action (useSidebarAdapter)
    ↓
4. Hook Original (useNavigation)
    ↓
5. React Navigation (mudança de tela)
```

## 📦 Componentes

### Domain Layer

#### `SidebarState.ts`

```typescript
- NavigationScreen: Define estrutura de uma tela
- SidebarConfig: Configurações do drawer
- SidebarTheme: Cores e estilos do tema
- SidebarActions: Interface de ações de navegação
```

### Infrastructure Layer

#### `useSidebarAdapter.ts`

```typescript
- Adapta useTheme e useNavigation
- Mapeia cores do tema para SidebarTheme
- Implementa navigateToProfile, navigateToScreen
- Retorna SidebarAdapter interface
```

### Presentation Layer

#### `Sidebar.tsx`

```typescript
- Container component
- Usa useSidebarAdapter
- Conecta adapter com SidebarView
- Passa tema e callbacks
```

#### `SidebarView.tsx`

```typescript
- Componente stateless (puro)
- Renderiza Drawer Navigator
- Lazy loading das telas (Home, Transactions, Profile, Extract)
- ScreenLoader para Suspense
- Ícones do Lucide React Native
```

### Compatibility Layer

#### `components/UserRoutes/Sidebar/index.tsx`

```typescript
- Mantém imports antigos funcionando
- Re-exporta Sidebar como MyDrawer
- Garante compatibilidade com código existente
```

## ✅ Benefícios

1. **Testabilidade**

   - SidebarView pode ser testado com temas mockados
   - useSidebarAdapter pode ser testado isoladamente
   - Não precisa mockar React Navigation diretamente

2. **Manutenibilidade**

   - Fácil modificar temas sem tocar na navegação
   - Fácil adicionar/remover telas
   - Lógica de navegação centralizada

3. **Escalabilidade**

   - Fácil trocar React Navigation por outro router
   - Fácil adicionar novos tipos de navegação
   - Fácil adicionar lógica de analytics/tracking

4. **Reutilização**

   - SidebarView pode ser usado com diferentes temas
   - useSidebarAdapter pode ser compartilhado
   - Tema isolado e configurável

5. **Compatibilidade**
   - Imports antigos continuam funcionando (MyDrawer)
   - Migração gradual sem quebrar código existente
   - Zero breaking changes

## 🎯 Comparação: Antes vs Depois

### Antes (Componente Monolítico)

```tsx
// src/components/UserRoutes/Sidebar/index.tsx
- 240 linhas de código
- Mistura navegação + tema + lazy loading
- Acoplado aos hooks
- Difícil de testar
- Difícil trocar React Navigation
```

### Depois (Clean Architecture)

```
Domain:        SidebarState.ts (30 linhas)
Infrastructure: useSidebarAdapter.ts (50 linhas)
Presentation:   Sidebar.tsx (15 linhas)
Presentation:   SidebarView.tsx (220 linhas)
Compatibility:  index.tsx (8 linhas)

Total: 5 arquivos com responsabilidades claras
- Fácil de testar cada camada
- Fácil de manter
- Fácil de estender
- Imports antigos continuam funcionando
```

## 📝 Exemplos de Uso

### Uso Normal (compatível com código antigo)

```tsx
import { MyDrawer } from "../../components/UserRoutes/Sidebar";

// Funciona exatamente como antes
<MyDrawer />;
```

### Uso da Nova Arquitetura (recomendado)

```tsx
import { Sidebar } from "../../presentation/sidebar/Sidebar";

<Sidebar />;
```

### Uso Apenas da View (para testes ou customização)

```tsx
import { SidebarView } from "../../presentation/sidebar/SidebarView";

const customTheme = {
  isDark: false,
  mainColor: "#0066cc",
  secondaryColor: "#0052a3",
  // ... outras props
};

<SidebarView
  theme={customTheme}
  onNavigateToProfile={() => console.log("Profile")}
/>;
```

## 🔍 Testes

### Testando a View (Componente Puro)

```tsx
// SidebarView.test.tsx
import { render, fireEvent } from "@testing-library/react-native";
import { SidebarView } from "./SidebarView";

test("should call onNavigateToProfile when button is pressed", () => {
  const onNavigateToProfile = jest.fn();
  const mockTheme = {
    isDark: false,
    mainColor: "#0066cc",
    // ... outras props
  };

  const { getByTestId } = render(
    <SidebarView theme={mockTheme} onNavigateToProfile={onNavigateToProfile} />
  );

  // Simular pressionar botão de perfil
  // expect(onNavigateToProfile).toHaveBeenCalled();
});
```

### Testando o Adapter

```tsx
// useSidebarAdapter.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useSidebarAdapter } from "./useSidebarAdapter";

test("should provide theme based on isDark mode", () => {
  const { result } = renderHook(() => useSidebarAdapter());

  expect(result.current.theme).toBeDefined();
  expect(result.current.theme.mainColor).toBeDefined();
  expect(result.current.actions.navigateToProfile).toBeDefined();
});
```

## 🎨 Características Mantidas

1. **Lazy Loading**

   - Home, Transactions, Profile, Extract carregam sob demanda
   - Performance logs mantidos
   - Suspense com ScreenLoader customizado

2. **Drawer Navigation**

   - 4 telas principais (Inicio, Nova Transação, Extrato, Perfil)
   - Ícones do Lucide React Native
   - Botão de perfil no header

3. **Tema Dinâmico**
   - Suporta modo claro/escuro
   - Cores adaptadas automaticamente
   - Baseado no theme.ts simplificado

## 📚 Próximos Passos

Para continuar aplicando Clean Architecture:

1. ✅ Login/Signup - **CONCLUÍDO**
2. ✅ Sidebar/Navigation - **CONCLUÍDO**
3. 🔄 Home/Dashboard
4. 🔄 Transactions (lista e formulário)
5. 🔄 Extract (extrato de transações)
6. 🔄 Profile (já iniciado, finalizar)

## 🎓 Referências

- Clean Architecture (Robert C. Martin)
- SOLID Principles
- Container/Presenter Pattern
- React Navigation Best Practices
- Lazy Loading & Code Splitting
````
