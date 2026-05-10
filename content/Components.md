---
title: Components
tags:
  - components
  - ui
  - reference
---

# Components

## Custom Components

`src/components/` — project-specific components.

| Component | File | Purpose |
|-----------|------|---------|
| `<Navbar />` | `navbar.tsx` | Top nav — logo, Dashboard link, "+ New brief" CTA, user avatar/dropdown |
| `<PageContainer />` | `page-container.tsx` | Layout wrapper — controls max-width per page type |
| `<EmptyState />` | `empty-state.tsx` | Illustration + headline + description + CTA button |
| `<BriefCard />` | `brief-card.tsx` | Dashboard card — name, status badge, completion bar, gap count, last modified, options menu (edit, duplicate, delete) |
| `<WizardStepper />` | `wizard-stepper.tsx` | Horizontal step indicator — states: pending / active / complete / skipped |
| `<BriefSectionCard />` | `brief-section-card.tsx` | Wizard section editor — preview table, prompt questions, "Process context" + "Ask AI to help" buttons |
| `<SubsectionPreviewTable />` | `subsection-preview-table.tsx` | Two-column table rendered from `structured_content` JSONB |
| `<GapCard />` | `gap-card.tsx` | Severity badge, description, "Fix this" / "Dismiss" actions |
| `<InlineGap />` | `inline-gap.tsx` | Inline gap indicator within brief view sections |
| `<BriefSectionNav />` | `brief-section-nav.tsx` | Sticky sidebar nav for brief view (desktop) |
| `<BriefContent />` | `brief-content.tsx` | Renders all 9 sections in brief view |
| `<FileUploadZone />` | `file-upload-zone.tsx` | Drag-and-drop upload — type/size validation, progress bars, remove button |
| `<AIProcessingIndicator />` | `ai-processing-indicator.tsx` | Animated gradient bar + rotating status text during AI processing |

## `PageContainer` Width Presets

```tsx
<PageContainer maxWidth="7xl">  {/* Dashboard */}
<PageContainer maxWidth="4xl">  {/* Wizard, Brief View */}
<PageContainer maxWidth="2xl">  {/* Settings */}
```

## shadcn/ui Primitives

`src/components/ui/` — new-york style. Add components with `npx shadcn@latest add <name>`. Config in `components.json`.

| Component | Notes |
|-----------|-------|
| `button` | Primary (indigo-600), secondary, ghost, destructive variants |
| `input` | Standard text input |
| `textarea` | Multi-line text |
| `card` | Container — `CardHeader`, `CardContent`, `CardFooter` |
| `dialog` | Modal — used for delete confirmation dialogs |
| `dropdown-menu` | Context menus — used in `BriefCard` and `Navbar` |
| `badge` | Status badges, severity indicators |
| `accordion` | Channel strategy sub-sections in Step 3 |
| `separator` | Horizontal dividers |
| `skeleton` | Loading placeholders |
| `sonner` | Toast notifications (Sonner library) |
| `tooltip` | Hover tooltips |
| `label` | Form labels |

> [!warning] Use Sonner, Not shadcn Toast
> ```typescript
> import { toast } from "sonner";  // ✅ correct
> // Never import from @/components/ui/use-toast
> ```

## See Also

- [[Conventions]] — `cn()` usage, color semantics, font config
- [[Wizard]] — how `BriefSectionCard` and `WizardStepper` are used in context
