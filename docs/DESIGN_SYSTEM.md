# Design System: Family Cash - Future Minimal

Este documento define a identidade visual do projeto **Family Cash**, focando em uma estética moderna, elegante, minimalista e levemente futurista.

## 1. Princípios de Design

*   **Minimalismo Sofisticado:** Menos é mais. O espaço em branco (ou "espaço escuro") é um elemento ativo de design.
*   **Futurismo Sutil:** Uso de *Glassmorphism* (efeito de vidro fosco), gradientes suaves e brilhos discretos para evocar tecnologia sem ser exagerado.
*   **Elegância:** Tipografia limpa, contrastes refinados e animações fluídas.

## 2. Paleta de Cores

O sistema será híbrido, suportando **Modo Claro** (Clean Minimalist) e **Modo Escuro** (Future Dark).

### Estrutura Semântica
As cores serão definidas semanticamente para adaptar-se automaticamente ao tema.

| Variável | Função | Modo Claro (Hex) | Modo Escuro (Hex) |
| :--- | :--- | :--- | :--- |
| `bg-background` | Fundo da página | `#FFFFFF` (White) | `#030712` (Gray 950) |
| `bg-surface` | Cards e Painéis | `#F5F5F5` (Gray 100) | `#111827` (Gray 900) |
| `bg-surface-glass`| Superfícies de Vidro | `rgba(255,255,255,0.7)` | `rgba(17,24,39,0.7)` |
| `text-primary` | Texto Principal | `#1F2937` (Gray 800) | `#F9FAFB` (Gray 50) |
| `text-secondary` | Texto Secundário | `#6B7280` (Gray 500) | `#9CA3AF` (Gray 400) |
| `border-color` | Bordas | `#E5E7EB` (Gray 200) | `#1F2937` (Gray 800) |

### Cores de Destaque (Accents) - Comuns aos dois modos

*   **Primary (Brand):** `Violet` a `Fuchsia`
    *   Gradiente: `bg-gradient-to-r from-violet-600 to-fuchsia-600` (Pode ser ajustado vibrância no Dark)
*   **Secondary (Action):** `Cyber Cyan` (`cyan-500`)
*   **Status:**
    *   Success: `emerald-500`
    *   Warning: `amber-500`
    *   Danger: `rose-500`

## 3. Diretrizes de Modo (Theming)

### Modo Claro (Minimalist Clean)
*   **Foco:** Legibilidade, luz, "respiro".
*   **Sombras:** Suaves e difusas (`shadow-sm`, `shadow-md`).
*   **Contraste:** Preto sobre branco (alto contraste textual).
*   **Estilo:** Papel digital, clean tech.

### Modo Escuro (Future Dark)
*   **Foco:** Imersão, conforto visual, "brilho".
*   **Sombras:** Sombras coloridas (Glow) e bordas luminosas.
*   **Contraste:** Branco suavizado sobre fundo profundo.
*   **Estilo:** Glassmorphism, Neon sutil.

## 4. Tipografia

*   **Fonte Principal:** `Inter` (Sans-serif).
*   **Títulos:** `Tracking-tight` para um visual mais compacto e moderno.

## 5. Componentes de Interface & UX

### Glass HUD (Interface Flutuante Tecnológica)
*   **Conceito:** Inspirado em *iOS AssistiveTouch* e *Control Center*.
*   **Aplicação:** Menus de ação rápida e atalhos globais.
*   **Estilo Visual:**
    *   **Fundo:** Vidro Escuro Profundo (`bg-slate-900/90` ou `bg-black/80`).
    *   **Blur:** Intenso (`backdrop-blur-xl`).
    *   **Borda:** Sutil e luminosa (`border border-white/10`).
    *   **Forma:** Arredondada (`rounded-3xl`), flutuando sobre a interface, desconectada das bordas.
*   **Comportamento:**
    *   Animação de "Spring" (escala elástica) ao abrir.
    *   Ícones com alto contraste (Geralmente branco sobre vidro escuro).

### Modais Clássicos
*   Reservados para formulários complexos ou confirmações de sistema.

## 6. Exemplo de Configuração (Tailwind)

Configuração via variáveis CSS para troca instantânea de tema.

```css
/* index.css */
@layer base {
  :root {
    /* Light Mode Default */
    --background: 255 255 255;
    --foreground: 31 41 55;
    --surface: 245 245 245;
  }

  .dark {
    /* Dark Mode Overrides */
    --background: 3 7 18;
    --foreground: 249 250 251;
    --surface: 17 24 39;
  }

  body {
    @apply bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-colors duration-300;
  }
}
```

Esta identidade visual garantirá que o **Family Cash** tenha uma aparência coesa, moderna e distinta.
