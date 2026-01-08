# Migração de Componentes UI para Clean Architecture

## 📋 Resumo das Mudanças

### Estrutura Anterior ❌

```
src/components/ui/
├── AnimatedScrollView.tsx       (80 linhas - lógica + UI misturadas)
├── ConfirmDeleteModal.tsx       (204 linhas - lógica + UI misturadas)
├── FadeInView.tsx               (119 linhas - lógica + UI misturadas)
├── PageTransition.tsx           (171 linhas - lógica + UI misturadas)
├── Text.tsx                     (18 linhas - lógica + UI misturadas)
└── ToastConfig.tsx              (111 linhas - configuração estática)
```

**Problemas**:

- ❌ Lógica de negócio misturada com UI
- ❌ Difícil de testar
- ❌ Regras de negócio espalhadas
- ❌ Acoplamento alto com React Native

### Estrutura Nova ✅

```
src/
├── domain/ui/                           # REGRAS DE NEGÓCIO
│   ├── AnimationState.ts                (145 linhas - lógica pura)
│   ├── ModalState.ts                    (70 linhas - lógica pura)
│   ├── ToastState.ts                    (67 linhas - lógica pura)
│   ├── TextState.ts                     (31 linhas - lógica pura)
│   └── index.ts
│
├── infrastructure/ui/                   # ADAPTERS
│   ├── useAnimationAdapters.ts          (310 linhas - hooks)
│   ├── useModalAdapters.ts              (60 linhas - hooks)
│   ├── useToastAdapters.ts              (25 linhas - hooks)
│   ├── useTextAdapters.ts               (15 linhas - hooks)
│   └── index.ts
│
└── presentation/ui/                     # VISUAL
    ├── AnimatedScrollView.tsx           (36 linhas - container)
    ├── AnimatedScrollViewView.tsx       (17 linhas - view)
    ├── FadeInView.tsx                   (32 linhas - container)
    ├── FadeInViewView.tsx               (38 linhas - view)
    ├── PageTransition.tsx               (42 linhas - container)
    ├── PageTransitionView.tsx           (26 linhas - view)
    ├── ConfirmDeleteModal.tsx           (36 linhas - container)
    ├── ConfirmDeleteModalView.tsx       (208 linhas - view)
    ├── Text.tsx                         (18 linhas - container)
    ├── CustomTextView.tsx               (17 linhas - view)
    ├── ToastConfig.tsx                  (53 linhas - config)
    └── index.ts
```

**Benefícios**:

- ✅ 3 camadas bem definidas
- ✅ Lógica de negócio testável (funções puras)
- ✅ Componentes visuais puros
- ✅ Adapters isolados
- ✅ Fácil manutenção

## 🔄 Comparação Componente a Componente

### 1. AnimatedScrollView

#### Antes (80 linhas misturadas)

```tsx
export function AnimatedScrollView({ children, enableParallax, ... }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeHeaderAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = Animated.event([...], {
    listener: (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const headerOpacity = offsetY > 50 ? 0 : 1 - offsetY / 50; // ❌ Lógica hardcoded
      fadeHeaderAnim.setValue(headerOpacity);
    },
  });

  return <ScrollView onScroll={handleScroll}>{children}</ScrollView>;
}
```

#### Depois (3 arquivos separados)

**Domain** (Regras):

```typescript
export const ANIMATION_RULES = {
  calculateHeaderOpacity: (
    scrollOffset: number,
    threshold: number = 50
  ): number => {
    if (scrollOffset > threshold) return 0;
    return 1 - scrollOffset / threshold; // ✅ Lógica extraída e testável
  },
};
```

**Infrastructure** (Adapter):

```typescript
export function useScrollAnimationAdapter(enableParallax, parallaxFactor) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeHeaderAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = Animated.event([...], {
    listener: (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const headerOpacity = ANIMATION_RULES.calculateHeaderOpacity(offsetY); // ✅ Usa regra do Domain
      fadeHeaderAnim.setValue(headerOpacity);
    },
  });

  return { scrollY, fadeHeaderAnim, handleScroll };
}
```

**Presentation** (UI):

```tsx
export function AnimatedScrollView({ children, ...props }) {
  const { handleScroll } = useScrollAnimationAdapter(
    enableParallax,
    parallaxFactor
  );
  return (
    <AnimatedScrollViewView onScroll={handleScroll} {...props}>
      {children}
    </AnimatedScrollViewView>
  );
}

export function AnimatedScrollViewView({ children, ...props }) {
  return <ScrollView {...props}>{children}</ScrollView>;
}
```

### 2. ConfirmDeleteModal

#### Antes (204 linhas misturadas)

```tsx
export function ConfirmDeleteModal({ visible, onConfirm, ... }) {
  const { isDark } = useTheme(); // ❌ Hook misturado com UI
  const theme = getTheme(isDark);
  const styles = createStyles(isDark, theme);

  return (
    <Modal visible={visible} ...>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 150 linhas de JSX */}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (isDark, theme) => { /* ... */ }; // ❌ Estilos misturados
```

#### Depois (2 arquivos + Domain)

**Domain** (Regras):

```typescript
export const MODAL_RULES = {
  canDismiss: (state: ModalState, config: ModalConfig): boolean => {
    return config.dismissible && !state.isLoading; // ✅ Lógica testável
  },
  canConfirm: (state: ModalState): boolean => {
    return !state.isLoading;
  },
};
```

**Presentation Container**:

```tsx
export function ConfirmDeleteModal({ visible, onConfirm, ... }) {
  const { isDark } = useTheme(); // ✅ Apenas tema
  const theme = getTheme(isDark);

  return (
    <ConfirmDeleteModalView
      visible={visible}
      onConfirm={onConfirm}
      isDark={isDark}
      theme={theme}
      {...props}
    />
  );
}
```

**Presentation View**:

```tsx
export function ConfirmDeleteModalView({ visible, isDark, theme, ... }) {
  const styles = createStyles(isDark, theme); // ✅ Estilos isolados

  return (
    <Modal visible={visible}>
      {/* JSX puro */}
    </Modal>
  );
}
```

### 3. FadeInView

#### Antes (119 linhas)

```tsx
export function FadeInView({ children, delay, duration, direction, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function getInitialTranslate(dir: string): number {
    // ❌ Função dentro do componente
    switch (dir) {
      case "up":
        return 30;
      case "down":
        return -30;
      // ...
    }
  }

  const translateAnim = useRef(
    new Animated.Value(getInitialTranslate(direction))
  ).current;

  useEffect(
    () => {
      Animated.parallel([
        /* ... */
      ]).start();
    },
    [
      /* ... */
    ]
  );

  return (
    <Animated.View
      style={
        [
          /* ... */
        ]
      }
    >
      {children}
    </Animated.View>
  );
}
```

#### Depois (Domain + Infrastructure + Presentation)

**Domain**:

```typescript
export const ANIMATION_RULES = {
  getInitialTranslate: (direction: AnimationDirection): number => {
    // ✅ Função pura extraída
    const OFFSET = 30;
    switch (direction) {
      case "up":
        return OFFSET;
      case "down":
        return -OFFSET;
      // ...
    }
  },
};
```

**Infrastructure**:

```typescript
export function useFadeInAdapter(duration, delay, direction) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(
    new Animated.Value(ANIMATION_RULES.getInitialTranslate(direction)) // ✅ Usa regra do Domain
  ).current;

  useEffect(
    () => {
      Animated.parallel([
        /* ... */
      ]).start();
    },
    [
      /* ... */
    ]
  );

  return {
    opacity: fadeAnim,
    transform: [
      /* ... */
    ],
  };
}
```

**Presentation**:

```tsx
export function FadeInView({ children, delay, duration, direction, style }) {
  const animatedStyle = useFadeInAdapter(duration, delay, direction);
  return (
    <FadeInViewView animatedStyle={animatedStyle} style={style}>
      {children}
    </FadeInViewView>
  );
}

export function FadeInViewView({ children, animatedStyle, style }) {
  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}
```

## 📊 Métricas

### Antes

- **Total**: 703 linhas em 6 arquivos
- **Camadas**: 1 (tudo misturado)
- **Testabilidade**: Baixa (precisa mockar React Native)
- **Reutilização**: Baixa (acoplado ao React Native)

### Depois

- **Total**: ~1.100 linhas em 27 arquivos
- **Camadas**: 3 (Domain, Infrastructure, Presentation)
- **Testabilidade**: Alta (Domain tem funções puras)
- **Reutilização**: Alta (Domain independente)
- **Manutenibilidade**: Muito melhor (responsabilidades claras)

**Observação**: Mais linhas de código, mas com **muito** mais qualidade, organização e testabilidade.

## 🎯 Fluxo de Dados

### Antes ❌

```
Component
  ↓ (tudo junto)
Lógica + Estado + UI + Regras + Animações
```

### Depois ✅

```
User Action
    ↓
Presentation (Container)
    ↓
Infrastructure (Adapter)
    ↓
Domain (Business Rules)
    ↓
Infrastructure (retorna dados processados)
    ↓
Presentation (View renderiza)
    ↓
User vê resultado
```

## ✅ Checklist de Migração

- [x] Analisar componentes antigos
- [x] Extrair regras de negócio para Domain
- [x] Criar adapters na Infrastructure
- [x] Separar Container/View na Presentation
- [x] Criar barrel exports (index.ts)
- [x] Validar imports e exports
- [x] Verificar erros de TypeScript
- [x] Criar documentação completa
- [ ] Atualizar imports em componentes que usam os UI
- [ ] Remover arquivos antigos de `src/components/ui/`
- [ ] Criar testes unitários para Domain
- [ ] Criar testes de integração para Infrastructure
- [ ] Criar testes de componente para Presentation

## 🚀 Próximos Passos

1. **Atualizar Imports**: Buscar e substituir todos os imports antigos:

   ```bash
   # Buscar:
   from "@/components/ui/AnimatedScrollView"

   # Substituir por:
   from "@/presentation/ui"
   ```

2. **Remover Arquivos Antigos**:

   ```bash
   rm -rf src/components/ui/
   ```

3. **Criar Testes**:

   - Domain: Testes unitários de funções puras
   - Infrastructure: Testes de hooks
   - Presentation: Testes de snapshot

4. **Aplicar mesmo padrão em outros componentes**:
   - Profile
   - Transactions
   - Sidebar
   - etc.

---

**Refatoração Completa**: Janeiro 2026  
**Componentes Migrados**: 6 componentes UI  
**Arquitetura**: Clean Architecture (3 camadas)  
**Status**: ✅ Pronto para uso
