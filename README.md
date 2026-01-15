# Core Frontend

A React frontend application built with **Clean Architecture** principles, providing a scalable and maintainable structure for enterprise applications.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Server State**: TanStack React Query
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd core-fe

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api/
```

### Running the Application

```bash
# Start development server
npm run dev

# Type checking
npm run check

# Linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Architecture Overview

This project follows **Clean Architecture** with three distinct layers per feature module:

```
src/<FeatureName>/
├── domain/           # Business logic (framework-agnostic)
│   ├── models/       # Entity interfaces
│   ├── repositories/ # Abstract repository interfaces
│   └── useCases/     # Business logic orchestration
│
├── infrastructure/   # External concerns (API, storage)
│   ├── models/
│   │   ├── dto/      # Data Transfer Objects (API shape)
│   │   └── adapters/ # DTO <-> Entity transformers
│   └── repositories/ # Concrete implementations
│
└── presenter/        # UI layer
    ├── components/   # Reusable UI components
    ├── pages/        # Route pages
    ├── hooks/        # React Query mutations/queries
    ├── contexts/     # React contexts
    ├── injections/   # Dependency injection wiring
    ├── validators/   # Yup form schemas
    └── layouts/      # Layout components
```

### Layer Responsibilities

| Layer | Responsibility | Dependencies |
|-------|----------------|--------------|
| **Domain** | Business rules, entities, use cases | None (pure TypeScript) |
| **Infrastructure** | API calls, data transformation | Domain layer |
| **Presenter** | UI components, hooks, state | Domain + Infrastructure |

### Key Patterns

- **Dependency Injection**: Manual DI through factory functions in `injections/`
- **Adapter Pattern**: Transform DTOs (API format) to Entities (domain format)
- **Repository Pattern**: Abstract data access behind interfaces
- **Page Pattern**: `index.tsx` → `Presenter.tsx` → `Component.tsx`

---

## Request Flow Example: User Login

Here's a complete example of how a user login request flows through the architecture:

### Visual Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTER LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   Component.tsx  │───▶│   Presenter.tsx  │───▶│  useLogin.hook   │       │
│  │   (Form UI)      │    │   (Orchestrator) │    │  (React Query)   │       │
│  └──────────────────┘    └──────────────────┘    └────────┬─────────┘       │
│                                                            │                 │
│                                                            ▼                 │
│                                                  ┌──────────────────┐       │
│                                                  │   injections/    │       │
│                                                  │   (DI Wiring)    │       │
│                                                  └────────┬─────────┘       │
└───────────────────────────────────────────────────────────┼─────────────────┘
                                                            │
┌───────────────────────────────────────────────────────────┼─────────────────┐
│                              DOMAIN LAYER                 │                  │
├───────────────────────────────────────────────────────────┼─────────────────┤
│                                                           ▼                  │
│  ┌──────────────────┐                          ┌──────────────────┐         │
│  │  ILogin.entity   │◀─────────────────────────│  Auth.useCase    │         │
│  │  (Data Model)    │                          │  (Business Logic)│         │
│  └──────────────────┘                          └────────┬─────────┘         │
│                                                          │                   │
│  ┌──────────────────┐                                   │                   │
│  │ IAuthRepository  │◀──────────────────────────────────┘                   │
│  │   (Interface)    │                                                        │
│  └──────────────────┘                                                        │
└───────────────────────────────────────────────────────────┬─────────────────┘
                                                            │
┌───────────────────────────────────────────────────────────┼─────────────────┐
│                          INFRASTRUCTURE LAYER             │                  │
├───────────────────────────────────────────────────────────┼─────────────────┤
│                                                           ▼                  │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │  Auth.repository │───▶│  LoginAdapter    │───▶│   login.dto      │       │
│  │  (API Calls)     │    │  (Transformer)   │    │   (API Shape)    │       │
│  └────────┬─────────┘    └──────────────────┘    └──────────────────┘       │
│           │                                                                  │
│           ▼                                                                  │
│  ┌──────────────────┐                                                        │
│  │ http.repository  │─────────────────▶  Backend API                        │
│  │    (Axios)       │◀─────────────────  Response                           │
│  └──────────────────┘                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Code Flow

#### 1. UI Component (User Interaction)

**File**: [Component.tsx](src/Auth/presenter/pages/Login/Component.tsx)

```typescript
// Pure UI component with form handling
const Component = ({onLogin}: LoginProps) => {
  const { control, handleSubmit } = useForm<ILoginEntity>({
    resolver: yupResolver(loginSchemeValidator),
  })

  return (
    <form onSubmit={handleSubmit(onLogin)}>
      <Input name="email" control={control} />
      <Input name="password" control={control} />
      <Button text="Login" />
    </form>
  )
}
```

#### 2. Presenter (Logic Orchestration)

**File**: [Presenter.tsx](src/Auth/presenter/pages/Login/Presenter.tsx)

```typescript
// Connects component with hooks
const Presenter = () => {
  const { mutateAsync: loginUser } = useLogin()

  const onLogin = (loginData: ILoginEntity) => {
    loginUser(loginData)
  }

  return <Component onLogin={onLogin} />
}
```

#### 3. Hook (React Query Integration)

**File**: [useLogin.hook.ts](src/Auth/presenter/hooks/useLogin.hook.ts)

```typescript
const useLogin = () => {
  const { setUser } = useContext(GlobalContext)
  const navigate = useNavigate()

  return useMutation<ITokenEntity, Error, ILoginEntity>({
    // Calls use case through dependency injection
    mutationFn: (data) => injections.AuthUseCase.loginUser(data),
    onSuccess: (data) => {
      storage.setStorage('token', data)
      setUser(decodeToken(data))
      navigate('/home')
    },
    onError: (error) => {
      // Show error modal
    }
  })
}
```

#### 4. Dependency Injection

**File**: [injections/index.ts](src/Auth/presenter/injections/index.ts)

```typescript
// Wire up all dependencies
const httpInstance = HttpRepositoryInfrastructure()
const authRepository = AuthRepositoryInfrastructure(httpInstance)
const authUseCases = useCasesAuth(authRepository)

export default authUseCases
```

#### 5. Use Case (Business Logic)

**File**: [Auth.useCase.ts](src/Auth/domain/useCases/Auth.useCase.ts)

```typescript
export class AuthUseCase {
  constructor(readonly Auth: IAuthRepository) {}

  loginUser = async (loginData: ILoginEntity): Promise<ITokenEntity> =>
    await this.Auth.loginUser(loginData)
}
```

#### 6. Repository Implementation (API Call)

**File**: [Auth.repository.ts](src/Auth/infrastructure/repositories/Auth.repository.ts)

```typescript
export class AuthRepository implements IAuthRepository {
  constructor(readonly http: IHttp) {}

  async loginUser(loginData: ILoginEntity): Promise<ITokenEntity> {
    // Transform Entity → DTO
    const dto = LoginAdapter.LoginEntityToLoginDto(loginData)

    // Make API request
    const response = await this.http.request<ITokenDto>({
      method: HttpMethod.post,
      url: `${API_URL}tkauth/login/`,
      body: dto
    })

    // Transform DTO → Entity
    return TokenAdapter.TokenDtoToTokenEntity(response)
  }
}
```

#### 7. Adapter (Data Transformation)

**File**: [login.adapter.ts](src/Auth/infrastructure/models/adapters/login.adapter.ts)

```typescript
export class LoginAdapter {
  static LoginEntityToLoginDto(data: ILoginEntity): ILoginDto {
    return {
      email: data.email,
      password: data.password,
    }
  }
}
```

### Files Touched in Order

| Step | File | Purpose |
|------|------|---------|
| 1 | [Component.tsx](src/Auth/presenter/pages/Login/Component.tsx) | User submits form |
| 2 | [Presenter.tsx](src/Auth/presenter/pages/Login/Presenter.tsx) | Handles submission |
| 3 | [useLogin.hook.ts](src/Auth/presenter/hooks/useLogin.hook.ts) | Triggers mutation |
| 4 | [injections/index.ts](src/Auth/presenter/injections/index.ts) | Provides use case instance |
| 5 | [Auth.useCase.ts](src/Auth/domain/useCases/Auth.useCase.ts) | Executes business logic |
| 6 | [Auth.repository.ts](src/Auth/infrastructure/repositories/Auth.repository.ts) | Makes API call |
| 7 | [login.adapter.ts](src/Auth/infrastructure/models/adapters/login.adapter.ts) | Transforms data |
| 8 | [http.repository.ts](src/common/infrastructure/repositories/http.repository.ts) | Axios request |

---

## Creating a New Feature

Use the scaffolding script to create a new feature with the full architecture:

```bash
./manage.sh -a feature_name
```

This creates a complete structure under `src/FeatureName/` with all layers pre-configured.

---

## Shared Resources

### Common Components

Located in [src/common/presenter/components/](src/common/presenter/components/):

- **Button** - Styled button with loading/disabled states
- **Input** - Form input with error handling
- **Modal** - Dialog component
- **Select** - Dropdown with search
- **CheckBox** - Checkbox with group support

### Global State

- **GlobalContext** - User state management
- **useLocalStorage** - Persistent storage hook

---

## Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI)
npm run test:run
```

Tests are colocated with their source files or in dedicated `__tests__` folders.

---

## Project Structure

```
src/
├── Auth/                 # Authentication feature
├── common/               # Shared code
│   ├── domain/          # Shared entities and interfaces
│   ├── infrastructure/  # HTTP client, storage
│   └── presenter/       # Shared components
├── helpers/              # Utilities
│   ├── getEnvironments.ts
│   └── utils.ts
├── test/                 # Test setup
├── .structure/           # Feature template
└── App.tsx               # Root component
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript check + production build |
| `npm run check` | TypeScript type checking only |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `./manage.sh -a <name>` | Create new feature module |
