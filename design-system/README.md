# Design system

Tokens and theme wiring keep UI consistent across Ant Design, Tailwind, and custom markup. **Color values match the Figma implementation exactly.**

| File                               | Purpose                                                                |
| ---------------------------------- | ---------------------------------------------------------------------- |
| [`tokens.ts`](./tokens.ts)         | Primitive values: color, spacing, radius, typography, shadows, layout. |
| [`antd-theme.ts`](./antd-theme.ts) | Maps tokens into `ThemeConfig` for `ConfigProvider`.                   |
| [`STYLING.md`](./STYLING.md)       | Rules for contributors — read before adding UI.                        |
| [`index.ts`](./index.ts)           | Public exports.                                                        |

## How to extend

1. Add or change values in `tokens.ts` using exact Figma hex/rgba.
2. Mirror important colors in `antd-theme.ts` under `token` / `components`.
3. Add matching `--color-*` entries in the `@theme` block at the top of [`app/globals.css`](../app/globals.css).

## Component wrappers

Shared UI primitives live in [`components/ui/`](../components/ui/). Compose these in feature components instead of raw Ant Design or inline styles.
