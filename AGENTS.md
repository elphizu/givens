## Naming

- Components: `PascalCase`.
- Hooks: `useSomething`.
- Booleans: truthy names like `isLoading`, `hasError`, `canEdit`.
- Event props: `onSomething`.
- Local handlers: `handleSomething`.
- Avoid vague names like `data`, `item`, `thing`, `helper`, `utils`, `handleData`, `processStuff`.

## Imports

- Use `import type` for types.
- Remove unused imports.
- Prefer absolute imports for shared modules.
- Prefer relative imports inside the same feature.
- Avoid circular imports.

## Errors

- Do not swallow errors.
- Log useful context when handling errors.
- Rethrow errors unless the caller can safely continue.

## Before finishing

- Run formatter/linter when available.
- Mention anything not verified.
