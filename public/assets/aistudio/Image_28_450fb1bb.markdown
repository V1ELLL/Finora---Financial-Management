---
name: Finora
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#005a89'
  on-tertiary: '#ffffff'
  tertiary-container: '#0073ae'
  on-tertiary-container: '#e7f2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-balance:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  currency-tabular:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
---

## Brand & Style

The design system is engineered specifically for modern native Android personal financial management, targeting individuals who need deliberate, friction-free tracking of their daily income, expenses, and long-term financial targets. The visual tone balances clinical precision with an approachable, calm clarity—dissolving the anxiety often tied to money management.

Rooted in modern Material Design 3 and refined corporate minimalism, the design avoids decorative clutter. Instead, it relies on structural cleanliness, precise typography hierarchy, purposeful financial semantic coloring, and elevated white tactile surfaces. The resulting interface feels orderly, trustworthy, and immediate, tailored for single-handed usage on portrait smartphone viewports (optimized for 360x800dp baseline screens).

## Colors

The color palette centers on a disciplined primary blue that communicates stability, paired with high-clarity semantic accents for financial status indicators:

- **Primary & Neutrals**: Primary Blue (`#2563EB`) acts as the brand anchor and key interaction tone, deepened to `#1D4ED8` for pressed states and softened to `#DBEAFE` for active indicator containers and pill highlights. Background canvas sits on crisp Slate 50 (`#F8FAFC`), while cards and sheet containers use pure White (`#FFFFFF`). Text hierarchy uses Deep Slate 900 (`#0F172A`) for primary legibility and Slate 500 (`#64748B`) for metadata and secondary content. Hairline dividers use Slate 200 (`#E2E8F0`).
- **Financial Semantics**:
  - **Pemasukan (Income)**: Emerald Green (`#16A34A`), applied to positive cash inflows and income summary badges.
  - **Pengeluaran (Expense)**: Vibrant Crimson (`#DC2626`), reserved for outgoing cash, over-budget indicators, and critical alerts.
  - **Tabungan/Target (Savings & Goals)**: Balanced Teal (`#0D9488`), representing accumulation and milestone pacing.
  - **Peringatan Anggaran (Budget Warning)**: Amber (`#D97706`), signaling approaching spending thresholds (80-99%).
  - **Informasi (System & Status)**: Sky Blue (`#0284C7`), for neutral guides, tips, and recurring item indicators.

## Typography

Typography is set in **Inter**, optimizing numerals and compact data density for Indonesian mobile contexts:

- **Monetary Formatting**: All currency instances must follow the strict standard Indonesian localization format (`Rp2.450.000` with no space between `Rp` and the integer, period as thousand separator). Financial figures use `Inter` with tabular figures enabled (`font-variant-numeric: tabular-nums`) to ensure strict vertical alignment across list rows and statistical breakdown tables.
- **Hierarchy Scale**:
  - `display-balance`: Hero account balance on the primary dashboard overview.
  - `headline-lg`: Top app bar titles and key screen headers.
  - `headline-md`: Card group headings, bottom sheet headers, and chart section titles.
  - `title-sm`: Transaction party/category names and widget titles.
  - `body-md` / `body-sm`: Primary descriptions, transaction notes, and breakdown lines.
  - `label-md` / `label-sm`: Filter chip texts, input helper copy, timestamps, and active navigation labels.

## Layout & Spacing

The layout is built for portrait mobile viewports starting at baseline `360x800dp`, adapting through dynamic vertical linear layouts:

- **Canvas & Margins**: A persistent outer boundary margin of `16dp` (`1rem`) isolates content from edge bezels. Gutters between grid cards and transaction splits adhere to `12dp` (`0.75rem`).
- **Vertical Rhythm**:
  - `space-xs` (4dp): Micro spacing between label captions and numeric inputs.
  - `space-sm` (8dp): Tight spacing inside badge chips, avatar-to-text gaps, and list row dividers.
  - `space-md` (16dp): Standard internal padding for cards (`MaterialCardView`) and inter-component stacking.
  - `space-lg` (20dp): Section separations between wallet cards and recent ledger groups.
  - `space-xl` (24dp): Major boundary spacing, separating the hero balance module from transactional content.
- **Ergonomics**: Primary actions and filters operate within thumb-reach zones. The bottom area reserves safe insets for a persistent navigation bar plus an elevated Floating Action Button.

## Elevation & Depth

Visual hierarchy employs Material Design 3 surface tonal elevations combined with subtle, non-distracting ambient shadows:

- **Level 0 (Canvas Base)**: `#F8FAFC`, flat baseline with no shadow.
- **Level 1 (Cards & Modules)**: Pure white `#FFFFFF` paired with an ultra-soft ambient shadow: `box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)` and a 1dp hairline border in `#E2E8F0`. This anchors items without visual heaviness.
- **Level 2 (Dropdowns & Menus)**: Elevated contextual menus and category switchers use `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Bottom Navigation & Sheets)**: Grounded bottom bar and modal bottom sheets (`box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.06)`).
- **Level 4 (Floating Action Button)**: Primary entry button uses `box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -4px rgba(37, 99, 235, 0.2)` to emphasize physical lift and immediate accessibility.

## Shapes

The design system applies a cohesive **16dp** curvature standard (`rounded-xl` / roundedness token level 2 scaled to container cards) to balance Android tactile warmth with structural discipline:

- **MaterialCardView Containers**: Styled with exactly `16dp` corner radii on all four corners for dashboard summaries, budget cards, and charts.
- **Modal Sheets**: Top-left and top-right radii set to `24dp`, bottom corners `0dp`.
- **Interactive Controls**:
  - Buttons and input fields leverage `12dp` rounded corners.
  - Category icon badges use squircle shapes with `12dp` radii.
  - Filter chips, status tags, and navigation active indicators use full pill curvature (`9999px` / `rounded-full`).

## Components

### Bottom Navigation Bar (4-Menu)
- **Structure**: Persistent bottom bar spanning 80dp in height, white background (`#FFFFFF`), with an elevated hairline divider (`#E2E8F0`) at the top edge.
- **Destinations**: *Beranda*, *Transaksi*, *Statistik*, *Profil*.
- **Active State Indicator**: Features a Material 3 pill shape container (`64dp x 32dp`) in `#DBEAFE` surrounding a `#1D4ED8` filled icon. The label below is rendered in `label-sm` (`#1D4ED8`, bold).
- **Inactive State**: Outlined icon in `#64748B`, with matching `#64748B` label text.

### Floating Action Button (FAB)
- **Position**: Anchored at bottom center-docked or right-floating with a bottom offset clearing navigation.
- **Styling**: `56x56dp` circle or `16dp` squircle in `#2563EB`, bearing a centered white `#FFFFFF` plus icon. Pressed feedback triggers `#1D4ED8`.

### MaterialCardView (Cards)
- **Styling**: `#FFFFFF` background, `16dp` corner radius, `16dp` interior padding, framed with a 1dp stroke (`#E2E8F0`).
- **Hero Balance Card**: Houses the total balance in `display-balance`, sub-split row showing "Pemasukan" (`#16A34A` with subtle up-arrow) and "Pengeluaran" (`#DC2626` with subtle down-arrow).

### Transaction List Items
- **Structure**: Horizontal layout, 72dp minimum touch target height.
- **Left**: Category icon nested within a `44x44dp` light-tinted container (e.g., `#DBEAFE` for utilities, `#DC2626/10%` for food).
- **Center**: Title in `title-sm` (`#0F172A`) with transaction category and date below in `body-sm` (`#64748B`).
- **Right**: Value formatted strictly as `+Rp150.000` (`#16A34A`) or `-Rp45.000` (`#DC2626`) using `currency-tabular`.

### Filter Chips & Status Pills
- **Filter Chips**: Height of `32dp`, pill radius (`9999px`), light border `#E2E8F0`. Inactive has `#F8FAFC` background; active has `#DBEAFE` background with `#1D4ED8` label and check icon.
- **Status Pills**: Compact tag (`24dp` height) used within budget items:
  - *Aman*: Green background (`#DCFCE7`), text `#16A34A`.
  - *Perhatian*: Amber background (`#FEF3C7`), text `#D97706`.
  - *Overbudget*: Red background (`#FEE2E2`), text `#DC2626`.

### Budget Progress Bar
- **Track**: Height of `8dp`, full rounded radius, track background `#E2E8F0`.
- **Indicator**: Smooth filled fill bar transitioning dynamically from `#2563EB` (below 75%), to `#D97706` (75–90%), to `#DC2626` (above 90% or exhausted).

### Form Inputs
- **Text & Currency Field**: Outlined Material variant with `12dp` corner radius, `1dp` border (`#E2E8F0`), active focus state `2dp` (`#2563EB`). Large input variant for transaction amount with fixed prefix `Rp` in `#64748B` and amount entry in `#0F172A` at `24sp`.