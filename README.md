# Little Virtual Computer

[中文文档](./README.zh-CN.md)

A simple simulated computer built with TypeScript. Learn how computers work by writing assembly programs that draw pixels, play sounds, and respond to input. Forked from [jsdf/little-virtual-computer](https://github.com/jsdf/little-virtual-computer).

**Demo:** https://wsafight.github.io/little-virtual-computer/

## Features

- 30x30 pixel display with 16-color palette (720x720 CSS-scaled)
- 23 assembly instructions (arithmetic, copy/move, compare, flow control, system)
- 3-channel audio synthesis (square, sawtooth, triangle, sine)
- Keyboard (3 simultaneous keys) and mouse input (position, button, pixel address)
- Built-in program editor with assembler, undo/redo support
- Step-through debugger with breakpoints, memory read/write tracing
- Adjustable execution speed (single-step to full-speed)
- EN/ZH language switching
- 6 built-in example programs + 3 custom program slots

## Architecture

```
src/
├── components/
│   ├── CPU.ts            # Fetch-decode-execute cycle
│   ├── Display.ts        # Canvas rendering with color LUT & dirty-pixel tracking
│   ├── Input.ts          # Keyboard/mouse input -> memory-mapped I/O
│   ├── Audio.ts          # Web Audio API (3 oscillator channels with gain control)
│   ├── Assembler.ts      # Assembly text parser and program loader
│   └── memory/
│       ├── Memory.ts     # 3100-slot memory array with read/write tracing
│       └── MemoryPosition.ts  # Memory layout constants & enums
├── instruction/          # Instruction set definitions
│   ├── arithmetic.ts     # add, subtract, multiply, divide, modulo (+ _constant variants)
│   ├── copy-move.ts      # copy_to_from, copy_to_from_ptr, copy_into_ptr_from, copy_address_of_label
│   ├── compare.ts        # compare, compare_constant (-1 / 0 / 1)
│   ├── flow.ts           # jump_to, branch_if_equal, branch_if_not_equal (+ _constant variants)
│   └── system.ts         # data, break, halt
├── simulator/
│   ├── Simulation.ts     # Execution loop, breakpoints, speed control
│   └── SimulatorUI.ts    # UI state, memory views, virtualized scroll
└── index.ts              # Computer initialization & public API
```

## Memory Layout

| Range | Size | Purpose |
|-------|------|---------|
| 0 - 999 | 1000 | Working memory (general-purpose storage) |
| 1000 - 1999 | 1000 | Program memory (instructions + operands) |
| 2000 - 2002 | 3 | Keyboard input (3 most recent keycodes) |
| 2010 - 2013 | 4 | Mouse input (x, y, pixel address, button state) |
| 2050 | 1 | Random number (0-254, refreshed each cycle) |
| 2051 | 1 | Current time (Date.now()) |
| 2100 - 2999 | 900 | Video memory (30x30 pixels, color index 0-15) |
| 3000 - 3008 | 9 | Audio (3 channels x 3: wave type, frequency, volume) |

**Total: 3100 memory slots**

## Instruction Set

### Copy / Move (opcodes 9000-9004)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `copy_to_from` | 9000 | dest(addr), src(addr) | Copy value from source address to destination |
| `copy_to_from_constant` | 9001 | dest(addr), value(const) | Set address to constant value |
| `copy_to_from_ptr` | 9002 | dest(addr), src(ptr) | Copy from address pointed to by source |
| `copy_into_ptr_from` | 9003 | dest(ptr), src(addr) | Copy into address pointed to by destination |
| `copy_address_of_label` | 9004 | dest(addr), label | Store label's address into destination |

### Arithmetic (opcodes 9010-9051)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `add` | 9010 | a(addr), b(addr), result(addr) | result = a + b |
| `add_constant` | 9011 | a(addr), b(const), result(addr) | result = a + b |
| `subtract` | 9020 | a(addr), b(addr), result(addr) | result = a - b |
| `subtract_constant` | 9021 | a(addr), b(const), result(addr) | result = a - b |
| `multiply` | 9030 | a(addr), b(addr), result(addr) | result = a * b |
| `multiply_constant` | 9031 | a(addr), b(const), result(addr) | result = a * b |
| `divide` | 9040 | a(addr), b(addr), result(addr) | result = floor(a / b) |
| `divide_constant` | 9041 | a(addr), b(const), result(addr) | result = floor(a / b) |
| `modulo` | 9050 | a(addr), b(addr), result(addr) | result = a % b |
| `modulo_constant` | 9051 | a(addr), b(const), result(addr) | result = a % b |

### Compare (opcodes 9090-9091)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `compare` | 9090 | a(addr), b(addr), result(addr) | result = -1 if a<b, 0 if a==b, 1 if a>b |
| `compare_constant` | 9091 | a(addr), b(const), result(addr) | result = -1 if a<b, 0 if a==b, 1 if a>b |

### Flow Control (opcodes 9100-9104)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `jump_to` | 9100 | dest(label) | Unconditional jump |
| `branch_if_equal` | 9101 | a(addr), b(addr), dest(label) | Jump if [a] == [b] |
| `branch_if_equal_constant` | 9102 | a(addr), b(const), dest(label) | Jump if [a] == b |
| `branch_if_not_equal` | 9103 | a(addr), b(addr), dest(label) | Jump if [a] != [b] |
| `branch_if_not_equal_constant` | 9104 | a(addr), b(const), dest(label) | Jump if [a] != b |

### System (opcodes 9200, 9998-9999)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `data` | 9200 | (inline values) | Embed raw data in program memory |
| `break` | 9998 | (none) | Pause execution (resume via UI) |
| `halt` | 9999 | (none) | End execution permanently |

## Display

- 30x30 pixel grid, CSS-scaled to 720x720 via `transform: scale(24)`
- 16 colors indexed 0-15:

| Index | Color | Index | Color |
|-------|-------|-------|-------|
| 0 | Black | 8 | Silver |
| 1 | White | 9 | Gray |
| 2 | Red | 10 | Maroon |
| 3 | Lime | 11 | Olive |
| 4 | Blue | 12 | Green |
| 5 | Yellow | 13 | Purple |
| 6 | Cyan | 14 | Teal |
| 7 | Magenta | 15 | Navy |

Write a color index (0-15) to video memory addresses 2100-2999 to set pixel colors. Pixel address = 2100 + y * 30 + x.

## Audio

3 independent oscillator channels, each controlled by 3 consecutive memory addresses:

| Channel | Wave Type Addr | Frequency Addr | Volume Addr |
|---------|---------------|----------------|-------------|
| CH1 | 3000 | 3001 | 3002 |
| CH2 | 3003 | 3004 | 3005 |
| CH3 | 3006 | 3007 | 3008 |

- Wave types: 0=square, 1=sawtooth, 2=triangle, 3=sine
- Frequency: value / 1000 Hz (clamped to 20-20000 Hz)
- Volume: 0-100 (scaled to max gain 0.15)

## Assembly Syntax

```asm
; Comments start with semicolon
define variableName value       ; Named constant / working memory alias
LabelName:                      ; Jump target (resolves to program memory address)
instruction operand1 operand2   ; Instruction with operands
```

## Built-in Programs

| Program | Description |
|---------|-------------|
| Add | Adds two numbers, stores result in memory |
| RandomPixels | Fills screen with random colors in a loop |
| Paint | Click to paint pixels, top row is color picker |
| BouncingBall | White ball bouncing off screen edges |
| MiniPong | Pong game with two static paddles |
| ChocolateRain | Plays "Chocolate Rain" using 2 audio channels |

## Getting Started

```bash
bun install
bun run build
# Open index.html in browser
```

Build outputs ESM bundles to `dist/`:
- `dist/computer.module.js` - Core computer (CPU, memory, display, audio, assembler)
- `dist/simulator.module.js` - Simulator UI (debugger, editor, controls)
