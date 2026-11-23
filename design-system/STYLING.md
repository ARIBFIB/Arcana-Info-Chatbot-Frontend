# Styling guide

This app uses a **unified design system** shared by Tailwind and Ant Design. Visual values match the Figma design exactly — do not change colors when refactoring.

## Architecture

```

tokens.ts          → JS values (antd-theme, dynamic styles, GSAP)

theme.css          → CSS tokens (@theme) + semantic utilities (@utility)

typography.ts      → `text.*` class name map + BodyText variants

antd-theme.ts      → ConfigProvider bridge (reads tokens.ts)

Typography.tsx     → React components wrapping semantic classes

```

**One definition, two consumers:**

| Layer | File | Used for |

| ----- | ---- | -------- |

| JS tokens | `tokens.ts` | Ant Design theme, inline styles, charts |

| CSS tokens | `theme.css` | Tailwind utilities (`bg-employee`, `heading-page`, `text-body`) |

| Class map | `typography.ts` | TypeScript references to CSS utility names |

Keep `tokens.ts` and `theme.css` in sync when adding colors or type sizes.

## Usage

### Prefer Typography components

```tsx

<PageTitle>Documents</PageTitle>

<BodyText variant="description">…</BodyText>

<LabelText muted>Category</LabelText>

```

### Or semantic utility classes directly

```tsx

<h1 className="heading-page">Documents</h1>

<p className="text-body-muted">…</p>

```

### Ant Design forms

```tsx

<Form className={FORM_CLASS}>  {/* applies text-label to labels */}

  <Form.Item label={<span className={FORM_LABEL}>Email</span>}>

```

### Avoid

- Raw `<h1>` without a semantic utility

- Long Tailwind stacks duplicating `font-body text-base …`

- `font-[family-name:…]` or per-component `fontFamily` — the app uses **Red Hat Display** globally via `html { font-family: var(--font-sans) }`

- Raw hex in components — use `@theme` colors (`text-foreground`, `bg-employee`)

## Rules

1. **No new BEM in globals** — chat-only pseudo-elements live in `chat.styles.css`.

2. **Ant Design for primitives** — buttons, inputs, forms, modals, tables.

3. **One icon library** — Lucide React.

4. **Use `ROUTES`** from `constants/routes.ts`.

5. **Inline `style={{}}` only when required** — GSAP, textarea auto-height, chart colors.

## Extending the system

1. Add value to `tokens.ts`.

2. Add matching `--color-*` / `--text-*` in `theme.css` `@theme` block.

3. If it's a reusable text style, add one `@utility` in `theme.css` and map it in `typography.ts` → `text.*`.

4. Wire Ant Design in `antd-theme.ts` if primitives need it.
