# Clean Architecture - Transaction Form Module

## 📋 Visão Geral

Este módulo implementa o **formulário de transação** seguindo os princípios de **Clean Architecture** e **SOLID**.

O formulário de transação é um dos componentes mais complexos do app, responsável por:

- Criar novas transações
- Editar transações existentes
- Upload de comprovantes (câmera/galeria)
- Validação de formulário
- Formatação de valores monetários
- Seleção de tipos e categorias

## 🏗️ Estrutura

```
src/
├── domain/
│   └── transaction-form/
│       └── TransactionFormState.ts       # Tipos, interfaces, constantes do domínio
├── infrastructure/
│   └── transaction-form/
│       └── useTransactionFormAdapter.ts   # Adapter - Lógica de negócio e adaptação
└── presentation/
    └── transaction-form/
        ├── TransactionForm.tsx            # Container - Conecta adapter ao view
        ├── TransactionFormView.tsx        # View - Componente visual puro
        └── components/
            └── FormSelectors.tsx          # Sub-componentes: TypeSelector, CategorySelector
```

## 📦 Camadas

### 1. Domain Layer (`domain/transaction-form/`)

Define os **tipos puros** e **constantes** do domínio de formulário de transação.

**Responsabilidades:**

- ✅ Definir tipos TypeScript (TransactionFormData, FormErrors, etc.)
- ✅ Definir interfaces para estado e ações
- ✅ Definir constantes (TRANSACTION_TYPES, TRANSACTION_CATEGORIES)
- ❌ Não contém lógica de negócio
- ❌ Não importa bibliotecas de UI
- ❌ Não depende de outras camadas

**Arquivos:**

- `TransactionFormState.ts`: Tipos do formulário, constantes de tipos/categorias

### 2. Infrastructure Layer (`infrastructure/transaction-form/`)

Contém a **lógica de negócio** e **adapta** hooks externos para a apresentação.

**Responsabilidades:**

- ✅ Gerenciar estado do formulário (valores, erros, modais)
- ✅ Validar dados do formulário
- ✅ Formatar valores monetários
- ✅ Integrar Expo ImagePicker (câmera/galeria)
- ✅ Adaptar hooks externos (useTheme, useToast, useAuth)
- ✅ Converter dados para formato esperado pelo serviço
- ✅ Lidar com modo de edição vs criação
- ❌ Não contém JSX/componentes visuais

**Arquivos:**

- `useTransactionFormAdapter.ts`: Hook customizado que retorna estado e ações para o formulário

**Principais funcionalidades:**

- `validateForm()`: Valida campos obrigatórios
- `formatCurrency()`: Formata entrada de valor monetário
- `handleImagePick()`: Mostra opções de câmera ou galeria
- `handleCameraPick()`: Captura foto da câmera com validação de tamanho
- `handleLibraryPick()`: Seleciona foto da galeria com validação
- `handleSubmit()`: Processa criação ou atualização de transação

### 3. Presentation Layer (`presentation/transaction-form/`)

Camada de **apresentação visual** - componentes React Native.

**Responsabilidades:**

- ✅ Renderizar UI (inputs, botões, modais)
- ✅ Capturar interações do usuário
- ✅ Delegar lógica para o adapter
- ✅ Adaptar-se ao tema (dark/light)
- ❌ Não contém lógica de negócio
- ❌ Não acessa diretamente hooks externos (exceto no container)

#### 3.1 Container (`TransactionForm.tsx`)

- Conecta o **adapter** (infrastructure) ao **view** (presentation)
- Chama `useTransactionFormAdapter()` e passa props para o `TransactionFormView`

#### 3.2 View (`TransactionFormView.tsx`)

- Componente **stateless** (recebe tudo via props)
- Renderiza formulário completo com todos os campos
- Usa sub-componentes (FormSelectors)
- Adapta cores ao tema (dark/light)

#### 3.3 Sub-componentes (`components/FormSelectors.tsx`)

- `TypeSelector`: Modal para selecionar tipo de transação
- `CategorySelector`: Modal para selecionar categoria

## 🎯 Princípios SOLID Aplicados

### **S - Single Responsibility Principle**

- `TransactionFormState.ts`: Apenas define tipos e constantes
- `useTransactionFormAdapter.ts`: Apenas gerencia lógica e estado
- `TransactionFormView.tsx`: Apenas renderiza UI
- `FormSelectors.tsx`: Apenas modais de seleção

### **O - Open/Closed Principle**

- Adicionar nova categoria: apenas atualizar `TRANSACTION_CATEGORIES` no domain
- Adicionar novo tipo: apenas atualizar `TRANSACTION_TYPES` no domain
- Extensível sem modificar código existente

### **L - Liskov Substitution Principle**

- Interfaces bem definidas permitem substituir implementações
- View pode ser substituído por outro componente visual que receba mesmas props

### **I - Interface Segregation Principle**

- Interfaces separadas para estado, ações, erros
- Components recebem apenas props necessárias

### **D - Dependency Inversion Principle**

- View depende de abstrações (props interface), não de implementações concretas
- Adapter abstrai hooks externos (useTheme, useToast, useAuth)
- Fácil testar mockando o adapter

## 🔄 Fluxo de Dados

```
User Interaction (View)
        ↓
    Container
        ↓
    Adapter (Infrastructure)
        ↓
External Hooks (useTransactions, useTheme, useAuth, ImagePicker)
        ↓
    Backend (Supabase)
        ↓
Update State in Adapter
        ↓
Re-render View with new state
```

## 💡 Benefícios

### ✅ Testabilidade

- Lógica isolada no adapter pode ser testada sem UI
- View stateless pode ser testada com Storybook/snapshot
- Fácil mockar o adapter em testes

### ✅ Manutenibilidade

- Código organizado por responsabilidades
- Mudanças em UI não afetam lógica
- Mudanças em lógica não afetam UI

### ✅ Reutilização

- Adapter pode ser usado em outras UIs (web, tablet)
- Sub-componentes (FormSelectors) podem ser reutilizados
- Constantes (tipos/categorias) compartilhadas no domínio

### ✅ Escalabilidade

- Fácil adicionar novos campos no formulário
- Fácil adicionar novas validações
- Fácil adicionar novos tipos/categorias
- Fácil migrar para outro framework UI (sem refactor da lógica)

## 🚀 Como Usar

### Importando o Componente

```typescript
import { TransactionForm } from "@/presentation/transaction-form/TransactionForm";

// Ou usando o path antigo (mantém compatibilidade):
import { NewTransactionForm } from "@/components/UserRoutes/Transactions/components/NewTransactionForm";
```

### Exemplo de Uso

```typescript
<TransactionForm
  primaryAccount={primaryAccount}
  bankAccounts={bankAccounts}
  isCreating={isCreating}
  onCreateTransaction={handleCreate}
  // Props opcionais para modo de edição:
  isEditing={isEditing}
  editingTransaction={editingTransaction}
  isUpdating={isUpdating}
  onUpdateTransaction={handleUpdate}
  onCancelEdit={handleCancelEdit}
/>
```

## 📝 Modo de Edição vs Criação

O formulário suporta dois modos:

### Modo Criação (padrão)

- `isEditing={false}` (ou omitido)
- Formulário vazio, pronto para nova transação
- Botão: "Efetuar Transação"

### Modo Edição

- `isEditing={true}`
- `editingTransaction` preenchido
- Formulário carregado com dados da transação
- Botão: "Atualizar Transação"
- Mostra indicador visual de edição
- Botão "Cancelar" para sair do modo de edição

## 🎨 Adaptação de Tema

O formulário se adapta automaticamente ao tema (dark/light):

- Background colors
- Text colors
- Border colors
- Input backgrounds
- Modal overlays

## 📸 Upload de Comprovante

Suporta duas fontes de imagem:

- **Câmera**: Captura foto diretamente
- **Galeria**: Seleciona foto existente

Validações implementadas:

- Verifica permissões (câmera/galeria)
- Limita tamanho máximo (5MB)
- Reduz qualidade para otimizar upload
- Remove metadados EXIF

## 🛡️ Validações

Campos obrigatórios:

- ✅ Valor (deve ser > 0)
- ✅ Descrição (não pode ser vazio)

Validações específicas:

- Conta de destino (opcional, mas validada se fornecida)
- Tamanho de imagem (máx 5MB)
- Formato de valor monetário

## 🔗 Integração com Backend

O formulário se integra com:

- `useTransactions` hook para operações CRUD
- `useAuth` hook para obter conta primária
- `useBankAccounts` hook para lista de contas
- Supabase Storage para upload de comprovantes

## 📚 Referências

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Container/Presenter Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
