# Design System: Family Cash - Cyber Neon

Este sistema visual foca em uma estética **High-Tech, Cyberpunk e Neon**. O objetivo é brilhar, destacar e trazer uma sensação de tecnologia avançada.

## 1. Princípios de Visual (Neon Tech)

*   **Darkness First:** Fundos profundos e escuros para fazer as luzes brilharem.
*   **Neon Glow:** Elementos ativos emitem luz (Glow/Sombra colorida).
*   **High Contrast:** Texto branco puro ou cores neon sobre fundo preto.
*   **Grid & Lines:** Uso de bordas finas e linhas para separar conteúdo, lembrando interfaces HUD (Heads-Up Display).

## 2. Paleta de Cores (Cyber)

O foco é no **Modo Escuro** (Padrão). O Modo Claro será secundário ou "High brightness".

### Cores Base
*   `bg-background`: `#09090b` (Rich Black - Quase preto puro)
*   `bg-surface`: `#18181b` (Zinc 950 - Metal escuro)
*   `bg-surface-glass`: `rgba(24, 24, 27, 0.6)` (Dark Glass)
*   `text-primary`: `#FFFFFF` (White Pure)
*   `text-secondary`: `#A1A1AA` (Zinc 400 - Metal polido)
*   `border-color`: `#27272a` (Zinc 800)

### Cores Neon (Accents)

Cores saturadas para gerar o efeito de luz.

*   **Primary (Cyber Blue):** `#06b6d4` a `#22d3ee` (Cyan)
    *   *Glow:* `shadow-[0_0_20px_rgba(34,211,238,0.6)]`
*   **Secondary (Electric Purple):** `#a855f7` a `#d946ef` (Fuchsia)
*   **Accent (Laser Green):** `#10b981` (Emerald Neon)

## 3. Efeitos Especiais (Utilities)

### Neon Text
Texto que parece brilhar.
`.text-neon-blue` -> `text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]`

### Glass HUD
Painéis com borda brilhante e fundo semi-transparente.
`border border-white/10 bg-zinc-950/80 backdrop-blur-xl`

## 4. Tipografia
*   **Fonte:** `Inter` (Manter pela legibilidade), mas usar `uppercase tracking-widest` em legendas e pequenos títulos para o "Tech Feel".
*   **Números:** Se possível, usar fontes monospaced para dados financeiros (`font-mono`).

## 5. Configuração CSS

```css
@layer base {
  :root {
    /* Cyber Dark Theme (Default) */
    --background: 9 9 11;       /* #09090b */
    --foreground: 250 250 250;  /* #fafafa */
    --surface: 24 24 27;        /* #18181b */
    --primary: 34 211 238;      /* #22d3ee (Cyan 400) */
    --secondary: 217 70 239;    /* #d946ef (Fuchsia 500) */
  }
}
```
## 6. Entrada de Transações (Mobile-First)

A criação de transações deve ser imersiva e focada na entrada de dados rápida.

*   **Layout:** Tela Cheia (Full Screen) cobrindo a interface principal.
*   **Valor:** O campo de valor é o protagonista. Deve ser grande, centralizado ou em destaque no topo.
*   **Input:** Ao clicar no valor, um **Modal Calculadora** (Bottom Sheet) deve subir.
    *   Teclado numérico grande e fácil de tocar.
    *   Botões de ação ("Concluído", "Cancelar") na parte inferior.
    *   **Auto-Open:** Ao abrir o form, a calculadora deve surgir automaticamente após um breve delay (ex: 300ms) com animação suave.
*   **Campos Secundários:** Descrição, Categoria, Conta devem vir abaixo do valor, em uma lista vertical limpa.
*   **Background:** Sólido (`bg-background` ou `bg-surface`) para evitar distrações.
