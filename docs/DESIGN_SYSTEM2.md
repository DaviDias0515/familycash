# DESIGN SYSTEM — PROJECTFLOW (AURA EDITION)

## 1. VISÃO GERAL
Design System focado em estética **High-End (Aura Style)**. Este documento traduz a sofisticação de interfaces como Linear e Vercel em tokens semânticos rigorosos para o Antigravity.

---

## 2. DIRETRIZES VISUAIS (AURA CORE)
* **Profundidade:** Uso mandatório de camadas translúcidas (`backdrop-blur-xl`).
* **Bordas:** Contrastantes e sutis (`border-white/20`).
* **Sombras:** Difusas e coloridas, nunca pretas sólidas.
* **Layout:** Preferência por **Bento Grids** e hierarquia modular.

---

## 3. PALETA DE CORES (VALORES → TOKENS)

### Texto
* **text-primary**: `#0F172A` (Slate 900 - Contraste máximo)
* **text-secondary**: `#475569` (Slate 600 - Texto de apoio)
* **text-muted**: `#94A3B8` (Slate 400 - Placeholders)
* **text-on-dark**: `#F8FAFC` (Slate 50)
* **text-on-brand**: `#FFFFFF` (Branco puro)

### Superfícies (Aura Layers)
* **surface-page**: `#F8FAFC` (Fundo limpo com mesh gradient opcional)
* **surface-section**: `#F1F5F9` (Separação de blocos)
* **surface-card**: `rgba(255, 255, 255, 0.6)` (Glassmorphism + Blur)
* **surface-subtle**: `rgba(241, 245, 249, 0.5)`
* **surface-elevated**: `#FFFFFF` (Z-index superior)

### Ações (Vibrant Accents)
* **action-primary**: `#6366F1` (Indigo Aura)
* **action-primary-hover**: `#4F46E5`
* **action-primary-active**: `#4338CA`
* **action-secondary**: `surface-card`
* **action-strong**: `#0F172A` (Estilo Linear/Dark)
* **action-strong-hover**: `#1E293B`

### Bordas
* **border-default**: `rgba(15, 23, 42, 0.08)`
* **border-subtle**: `rgba(15, 23, 42, 0.04)`
* **border-focus**: `#6366F1`

---

## 4. ESPAÇAMENTO (8PT GRID)
* **space-1**: 4px | **space-2**: 8px | **space-3**: 12px | **space-4**: 16px 
* **space-6**: 24px | **space-8**: 32px | **space-12**: 48px | **space-16**: 64px

---

## 5. TIPOGRAFIA (GEIST / INTER)
* **Tamanhos**: `text-xs`: 12px até `text-5xl`: 48px.
* **Pesos**: `font-normal`: 400 | `font-semibold`: 600 | `font-bold`: 700.

---

## 6. EFEITOS (NON-HARSH)
* **radius-xl**: 16px (Padrão para Cards Aura).
* **shadow-card**: `0 8px 30px rgba(0, 0, 0, 0.04)`
* **shadow-button-primary**: `0 4px 12px rgba(99, 102, 241, 0.3)`

---

## 7. REGRAS DE OURO
1. NUNCA use cores 100% saturadas.
2. TODO Card deve ter `backdrop-blur`.
3. INTERAÇÕES devem usar física de mola (Spring Physics).