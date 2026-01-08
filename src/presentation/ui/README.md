# Componentes UI - Clean Architecture

## 📝 Visão Geral

Os componentes UI foram refatorados seguindo **Clean Architecture** com 3 camadas bem definidas:

- **Domain**: Tipos, interfaces e regras de negócio
- **Infrastructure**: Adapters que conectam React Native à lógica de domínio
- **Presentation**: Componentes visuais (Container + View)

## 📁 Estrutura de Pastas

```
src/
├── domain/ui/                      # DOMAIN LAYER
│   ├── AnimationState.ts           # Tipos e regras de animação
│   ├── ModalState.ts               # Tipos e regras de modais
│   ├── ToastState.ts               # Tipos e regras de toasts
│   ├── TextState.ts                # Tipos e regras de texto
│   └── index.ts                    # Barrel exports
│
├── infrastructure/ui/              # INFRASTRUCTURE LAYER
│   ├── useAnimationAdapters.ts     # Adapters de animação
│   ├── useModalAdapters.ts         # Adapters de modais
│   ├── useToastAdapters.ts         # Adapters de toasts
│   ├── useTextAdapters.ts          # Adapters de texto
│   └── index.ts                    # Barrel exports
│
└── presentation/ui/                # PRESENTATION LAYER
    ├── AnimatedScrollView.tsx      # Container
    ├── AnimatedScrollViewView.tsx  # View
    ├── FadeInView.tsx              # Container
    ├── FadeInViewView.tsx          # View
    ├── PageTransition.tsx          # Container
    ├── PageTransitionView.tsx      # View
    ├── ConfirmDeleteModal.tsx      # Container
    ├── ConfirmDeleteModalView.tsx  # View
    ├── Text.tsx                    # Container
    ├── CustomTextView.tsx          # View
    ├── ToastConfig.tsx             # Config
    └── index.ts                    # Barrel exports
```

## 🔄 Padrão de Arquitetura

### 1. Domain Layer (Regras de Negócio)

Contém **apenas lógica pura**, sem dependências externas:

```typescript
// domain/ui/AnimationState.ts
export const ANIMATION_RULES = {
  getInitialTranslate: (direction: AnimationDirection): number => {
    const OFFSET = 30;
    switch (direction) {
      case "up":
        return OFFSET;
      case "down":
        return -OFFSET;
      // ...
    }
  },

  calculateHeaderOpacity: (
    scrollOffset: number,
    threshold: number = 50
  ): number => {
    if (scrollOffset > threshold) return 0;
    return 1 - scrollOffset / threshold;
  },
} as const;
```

**Características**:

- ✅ Funções puras
- ✅ Tipos e interfaces
- ✅ Constantes de configuração
- ❌ Sem hooks do React
- ❌ Sem dependências externas

### 2. Infrastructure Layer (Adapters)

Conecta o React Native Animated ao Domain:

```typescript
// infrastructure/ui/useAnimationAdapters.ts
export function useFadeInAdapter(
  duration: number,
  delay: number,
  direction: AnimationDirection
) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(
    new Animated.Value(ANIMATION_RULES.getInitialTranslate(direction))
  ).current;

  useEffect(() => {
    // Lógica de animação usando ANIMATION_RULES
  }, [fadeAnim, translateAnim, delay, duration]);

  return {
    opacity: fadeAnim,
    transform: [
      /* ... */
    ],
  };
}
```

**Características**:

- ✅ Usa hooks do React/React Native
- ✅ Usa regras do Domain
- ✅ Gerencia estado e efeitos
- ❌ Sem JSX/renderização

### 3. Presentation Layer (UI)

Separado em **Container** (lógica) e **View** (visual):

#### Container

```typescript
// presentation/ui/FadeInView.tsx
export function FadeInView({
  children,
  delay = ANIMATION_DEFAULTS.FADE_IN.delay,
  duration = ANIMATION_DEFAULTS.FADE_IN.duration,
  direction = ANIMATION_DEFAULTS.FADE_IN.direction,
  style,
}: FadeInViewProps) {
  const animatedStyle = useFadeInAdapter(duration, delay, direction);

  return (
    <FadeInViewView animatedStyle={animatedStyle} style={style}>
      {children}
    </FadeInViewView>
  );
}
```

#### View

```typescript
// presentation/ui/FadeInViewView.tsx
export function FadeInViewView({
  children,
  animatedStyle,
  style,
}: FadeInViewViewProps) {
  return (
    <Animated.View
      style={[
        {
          opacity: animatedStyle.opacity,
          transform: animatedStyle.transform,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
```

## 📊 Componentes Refatorados

### 1. AnimatedScrollView

**Funcionalidade**: ScrollView com animações de parallax e fade

**Camadas**:

- Domain: `AnimationState.ts` - Regras de parallax e scroll fade
- Infrastructure: `useScrollAnimationAdapter` - Gerencia Animated.Value
- Presentation: `AnimatedScrollView` + `AnimatedScrollViewView`

**Uso**:

```tsx
import { AnimatedScrollView } from "@/presentation/ui";

<AnimatedScrollView enableParallax parallaxFactor={0.5}>
  {children}
</AnimatedScrollView>;
```

### 2. FadeInView

**Funcionalidade**: Animação de fade in com direção customizável

**Camadas**:

- Domain: `AnimationState.ts` - Regras de fade in e direções
- Infrastructure: `useFadeInAdapter` - Gerencia animações
- Presentation: `FadeInView` + `FadeInViewView`

**Uso**:

```tsx
import { FadeInView } from "@/presentation/ui";

<FadeInView duration={600} delay={100} direction="up">
  <Text>Conteúdo</Text>
</FadeInView>;
```

### 3. PageTransition

**Funcionalidade**: Transições de página (slide, fade, scale)

**Camadas**:

- Domain: `AnimationState.ts` - Regras de transição
- Infrastructure: `usePageTransitionAdapter` - Gerencia transições
- Presentation: `PageTransition` + `PageTransitionView`

**Uso**:

```tsx
import { PageTransition } from "@/presentation/ui";

<PageTransition
  isVisible={isVisible}
  transitionType="slide"
  direction="horizontal"
>
  <Screen />
</PageTransition>;
```

### 4. ConfirmDeleteModal

**Funcionalidade**: Modal de confirmação de exclusão

**Camadas**:

- Domain: `ModalState.ts` - Regras de modal e validação
- Infrastructure: `useConfirmDeleteModalAdapter` - Gerencia estado
- Presentation: `ConfirmDeleteModal` + `ConfirmDeleteModalView`

**Uso**:

```tsx
import { ConfirmDeleteModal } from "@/presentation/ui";

<ConfirmDeleteModal
  visible={visible}
  onConfirm={handleDelete}
  onCancel={handleCancel}
  isDeleting={isDeleting}
/>;
```

### 5. CustomText

**Funcionalidade**: Componente de texto com classes CSS

**Camadas**:

- Domain: `TextState.ts` - Regras de combinação de classes
- Infrastructure: `useTextClassesAdapter` - Processa classes
- Presentation: `CustomText` + `CustomTextView`

**Uso**:

```tsx
import { CustomText } from "@/presentation/ui";

<CustomText className="font-bold text-lg">Texto customizado</CustomText>;
```

### 6. ToastConfig

**Funcionalidade**: Configuração de notificações toast

**Camadas**:

- Domain: `ToastState.ts` - Regras de cores e estilos
- Infrastructure: `useToastStyleAdapter` - Gera estilos
- Presentation: `ToastConfig` - Configuração exportada

**Uso**:

```tsx
// App.tsx
import Toast from "react-native-toast-message";
import { toastConfig } from "@/presentation/ui";

<Toast config={toastConfig} />;
```

## 🎯 Hooks Exportados

Além dos componentes, a camada de Presentation exporta hooks úteis:

```typescript
import {
  useParallaxEffect, // Efeito parallax em scroll
  useScrollFade, // Fade baseado em scroll
  useSkeletonAnimation, // Animação de skeleton loading
  useSectionTransition, // Transição entre seções
} from "@/presentation/ui";
```

## ✅ Benefícios da Arquitetura

### 1. Separação de Responsabilidades

- Domain: **O QUÊ** (regras de negócio)
- Infrastructure: **COMO** (implementação técnica)
- Presentation: **ONDE** (interface visual)

### 2. Testabilidade

- Domain: Testes unitários de funções puras
- Infrastructure: Testes de hooks com React Testing Library
- Presentation: Testes de componentes com snapshots

### 3. Reutilização

- Regras de Domain podem ser usadas em outros projetos
- Adapters podem ser trocados sem afetar o Domain
- Views podem ser estilizadas independentemente

### 4. Manutenibilidade

- Mudanças isoladas em cada camada
- Fácil localização de bugs
- Código auto-documentado

## 🔄 Migração dos Componentes Antigos

### Arquivos Antigos (podem ser removidos):

```
src/components/ui/
├── AnimatedScrollView.tsx     ❌ Substituído
├── ConfirmDeleteModal.tsx     ❌ Substituído
├── FadeInView.tsx             ❌ Substituído
├── PageTransition.tsx         ❌ Substituído
├── Text.tsx                   ❌ Substituído
└── ToastConfig.tsx            ❌ Substituído
```

### Novos Arquivos (Clean Architecture):

```
src/
├── domain/ui/                 ✅ Novo
├── infrastructure/ui/         ✅ Novo
└── presentation/ui/           ✅ Novo
```

## 📚 Importações

### Antes (Antigo):

```typescript
import { AnimatedScrollView } from "@/components/ui/AnimatedScrollView";
import { FadeInView } from "@/components/ui/FadeInView";
```

### Depois (Novo - Clean Architecture):

```typescript
import { AnimatedScrollView, FadeInView } from "@/presentation/ui";
```

## 🏗️ Hierarquia de Dependências

```
Presentation Layer
    ↓ (usa)
Infrastructure Layer
    ↓ (usa)
Domain Layer
    ↓ (sem dependências)
```

**Regra de Ouro**:

- Domain NÃO pode importar de Infrastructure ou Presentation
- Infrastructure NÃO pode importar de Presentation
- Presentation pode importar de Infrastructure e Domain

## 🎨 Exemplos Completos

### Exemplo 1: Componente com Animação

```tsx
import { FadeInView } from "@/presentation/ui";

export function ProfileCard() {
  return (
    <FadeInView duration={800} direction="up">
      <View style={styles.card}>
        <Text>Perfil do Usuário</Text>
      </View>
    </FadeInView>
  );
}
```

### Exemplo 2: Modal com Estado

```tsx
import { ConfirmDeleteModal } from "@/presentation/ui";
import { useState } from "react";

export function TransactionList() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTransaction();
    setIsDeleting(false);
    setShowModal(false);
  };

  return (
    <>
      <Button onPress={() => setShowModal(true)}>Excluir</Button>

      <ConfirmDeleteModal
        visible={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        isDeleting={isDeleting}
      />
    </>
  );
}
```

### Exemplo 3: Toast Notifications

```tsx
// App.tsx
import Toast from "react-native-toast-message";
import { toastConfig } from "@/presentation/ui";

export function App() {
  return (
    <>
      <AppContent />
      <Toast config={toastConfig} />
    </>
  );
}

// Qualquer componente
import Toast from "react-native-toast-message";

Toast.show({
  type: "success",
  text1: "Sucesso!",
  text2: "Transação criada com sucesso",
});
```

## 📊 Diagrama de Fluxo

```
User Action
    ↓
Component (Container)
    ↓
Adapter (Infrastructure)
    ↓
Business Rules (Domain)
    ↓
Adapter retorna dados processados
    ↓
View renderiza UI
    ↓
User vê resultado
```

---

**Refatoração**: Janeiro 2026  
**Status**: ✅ Completa  
**Padrão**: Clean Architecture (3 camadas)  
**Componentes Migrados**: 6 componentes + hooks auxiliares
