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

### Paleta de Cores (Tokens Semânticos - Light / Dark)

| Token | Light Mode (Default) | Dark Mode |
| :--- | :--- | :--- |
| **`--background`** | `#F8FAFC` (Slate 50) | `#020617` (Slate 950) |
| **`--foreground`** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) |
| **`--surface`** | `#FFFFFF` (White) | `#0f172A` (Slate 900) |
| **`--surface-subtle`** | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) |
| **`--primary`** | `#6366F1` (Indigo 500) | `#818CF8` (Indigo 400) |
| **`--border`** | `rgba(15, 23, 42, 0.08)` | `rgba(255, 255, 255, 0.1)` |

### Superfícies (Aura Layers)
* **surface-page**: Fundo base da aplicação.
* **surface-card**: Camada de cartão com efeito Glassmorphism (`glass-aura`).
* **surface-elevated**: Elementos flutuantes (modais, dropdowns).

### Ações (Vibrant Accents)
* **action-primary**: `#6366F1` (Indigo Aura)
* **action-primary-hover**: `#4F46E5`
* **action-primary-active**: `#4338CA`


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