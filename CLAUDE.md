# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run check        # TypeScript type checking only
npm run lint         # ESLint with TypeScript rules
npm run preview      # Preview production build

# App scaffolding
./manage.sh -a <app_name>    # Create new app with clean architecture structure
./manage.sh --help           # Show all manage script options
```

## Architecture

This is a React frontend using **Clean Architecture** with three layers per feature module:

### Layer Structure (per app)
```
src/<AppName>/
├── domain/           # Business logic (framework-agnostic)
│   ├── models/       # Entity interfaces (IEntity files)
│   ├── repositories/ # Abstract repository interfaces
│   └── useCases/     # Business logic orchestration
├── infrastructure/   # External concerns
│   ├── models/
│   │   ├── dto/      # Data Transfer Objects (API shape)
│   │   └── adapters/ # DTO <-> Entity transformers
│   └── repositories/ # Concrete implementations (API calls)
└── presenter/        # UI layer
    ├── components/   # Reusable UI components
    ├── pages/        # Route pages (index.tsx -> Presenter -> Component)
    ├── hooks/        # React Query mutations/queries
    ├── contexts/     # React contexts
    ├── injections/   # Dependency injection wiring
    ├── validators/   # Yup form schemas
    └── layouts/      # Layout components
```

### Key Patterns

- **Dependency Injection**: `presenter/injections/` wires up repository implementations to use cases
- **Adapters**: Transform between DTOs (API format) and Entities (domain format) - never pass DTOs directly to domain layer
- **Page Pattern**: Each page has `index.tsx` (export), `Presenter.tsx` (logic/hooks), `Component.tsx` (pure UI), `models.ts` (types)
- **App Creation**: `./manage.sh -a app_name` copies `.structure/` template and renames placeholders

### Shared Code

- `src/common/` - Shared domain models, HTTP infrastructure, and reusable UI components (Button, Input, Modal, Select, CheckBox)
- `src/helpers/` - Environment variables and utility functions

### Tech Stack

- Vite + React 18 + TypeScript
- TanStack React Query for server state
- React Hook Form + Yup for forms
- React Router for routing
- Axios for HTTP
- Tailwind CSS for styling
