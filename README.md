
# Flow Project

## Overview
Flow is a monorepo that contains multiple applications and shared packages. The main applications include:

- **apps/api**: A backend API built with NestJS.
- **apps/web**: A frontend web application built with Next.js featuring a custom workflow editor.

Additional packages include shared ESLint configurations, TypeScript settings, and UI components.

## Repository Structure

```
.gitignore
.npmrc
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
README.md
turbo.json
.next/
apps/
  api/            # Backend API (NestJS)
  web/            # Frontend Web App (Next.js)
packages/
  eslint-config/  # Internal ESLint configurations
  typescript-config/ # TypeScript configurations
  ui/             # Shared UI components
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- pnpm (for package management)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Applications
- **Development**
  - For the Next.js frontend, run:
    ```bash
    pnpm --filter web dev
    ```
  - For the NestJS API, run:
    ```bash
    pnpm --filter api dev
    ```

- **Production**
  - Build the Next.js app:
    ```bash
    pnpm --filter web build
    ```
  - Build the NestJS API:
    ```bash
    pnpm --filter api build
    ```

### Testing
The project uses Vitest and related tools for testing:
```bash
pnpm test
```

### Linting
Linting is configured with ESLint. To run lint checks:
```bash
pnpm lint
```

## Storybook
The project includes Storybook for developing and showcasing UI components.

- Start Storybook:
  ```bash
  pnpm --filter web storybook
  ```
- Build Storybook:
  ```bash
  pnpm --filter web build-storybook
  ```

## Additional Resources
- **Next.js Documentation**: [Next.js Docs](https://nextjs.org/docs)
- **NestJS Documentation**: [NestJS Docs](https://docs.nestjs.com)
- **Storybook Documentation**: [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)
- **React Flow**: [React Flow](https://reactflow.dev/)

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## License
This project is licensed under the MIT License.