# App Shell - Authenticated App

## 📝 Visão Geral

O componente `AuthenticatedApp` (anteriormente `UserRoutes`) é o **shell principal do aplicativo** para usuários autenticados. Ele configura toda a estrutura base necessária para a navegação e layout do app.

## 📁 Localização

```
src/presentation/app/
├── AuthenticatedApp.tsx        # Container com lógica de tema
├── AuthenticatedAppView.tsx    # View pura
└── index.ts                    # Barrel export
```

## 🎯 Responsabilidades

### Container (`AuthenticatedApp.tsx`)

- Gerenciar tema (dark/light mode) via `useTheme`
- Passar configurações de tema para a view

### View (`AuthenticatedAppView.tsx`)

- Configurar `SafeAreaProvider` (safe area para dispositivos)
- Configurar `StatusBar` com tema correto
- Configurar `NavigationContainer` (React Navigation)
- Renderizar `Sidebar` (navegação principal)

## 🔄 Mudanças da Refatoração

### Antes

```
src/components/UserRoutes/index.tsx
```

**Problemas**:

- ❌ Nome `UserRoutes` não descreve bem a função
- ❌ Localização em `/components` (não segue Clean Architecture)
- ❌ Lógica e view no mesmo arquivo

### Depois

```
src/presentation/app/
├── AuthenticatedApp.tsx        # Container
└── AuthenticatedAppView.tsx    # View
```

**Melhorias**:

- ✅ Nome `AuthenticatedApp` descreve claramente a função
- ✅ Localização em `/presentation/app` (segue Clean Architecture)
- ✅ Separação de Container/View (SRP)
- ✅ View pura e testável

## 📊 Estrutura do Componente

```tsx
// AuthenticatedApp.tsx (Container)
export function AuthenticatedApp() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <AuthenticatedAppView
      backgroundColor={theme.background}
      cardBackgroundColor={theme.card}
      statusBarStyle={isDark ? "dark-content" : "light-content"}
    />
  );
}

// AuthenticatedAppView.tsx (View)
export function AuthenticatedAppView({
  backgroundColor,
  cardBackgroundColor,
  statusBarStyle,
}: AuthenticatedAppViewProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={cardBackgroundColor}
          translucent={false}
        />
        <NavigationContainer>
          <Sidebar />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

## 🔌 Uso

### No AuthFormView

```tsx
import { AuthenticatedApp } from "../app";

export function AuthFormView({ authStatus }: AuthFormViewProps) {
  // ...

  if (authStatus === "authenticated") {
    return <AuthenticatedApp />;
  }

  // ...
}
```

## 🏗️ Arquitetura

Este componente faz parte da **camada de Presentation** e segue o padrão **Container/View**:

```
Presentation Layer
    ↓
AuthenticatedApp (Container)
    ↓ (usa)
useTheme hook
    ↓ (passa props para)
AuthenticatedAppView (View)
    ↓ (renderiza)
NavigationContainer + Sidebar
```

## ✅ Benefícios

1. **Nome Descritivo**: "AuthenticatedApp" deixa claro que é o app para usuários logados
2. **Localização Correta**: Em `/presentation/app` segue a estrutura do projeto
3. **Separação de Responsabilidades**: Container (lógica) + View (UI)
4. **Testabilidade**: View pode ser testada com props mockadas
5. **Manutenibilidade**: Fácil encontrar e modificar

## 🔄 Migração

**Arquivo antigo** (pode ser removido após validação):

- `src/components/UserRoutes/index.tsx`

**Novos arquivos**:

- `src/presentation/app/AuthenticatedApp.tsx`
- `src/presentation/app/AuthenticatedAppView.tsx`
- `src/presentation/app/index.ts`

**Atualizado**:

- `src/presentation/auth/AuthFormView.tsx` - Agora usa `AuthenticatedApp`

## 🎨 Hierarquia de Componentes

```
App.tsx
  └── AuthForm
        └── AuthFormView
              ├── LoginForm (se não autenticado)
              └── AuthenticatedApp (se autenticado)
                    └── NavigationContainer
                          └── Sidebar
                                ├── Home
                                ├── Extrato
                                ├── Transações
                                └── Perfil
```

## 📚 Relacionados

- [AuthFormView](../auth/AuthFormView.tsx) - Usa AuthenticatedApp
- [Sidebar](../sidebar/Sidebar.tsx) - Navegação principal renderizada pelo AuthenticatedApp
- [useTheme](../../hooks/useTheme.ts) - Hook usado para tema

---

**Refatoração**: Janeiro 2026  
**Status**: ✅ Migração Completa  
**Nome Antigo**: `UserRoutes`  
**Nome Novo**: `AuthenticatedApp`
