# Little Virtual Computer

[中文文档](./README.zh-CN.md)

A minimal virtual computer built with TypeScript — 3100 memory slots, 23 instructions, and everything is memory-mapped I/O. Write assembly programs that draw pixels, play sounds, and respond to keyboard/mouse input. Forked from [jsdf/little-virtual-computer](https://github.com/jsdf/little-virtual-computer).

**Try it now:** https://wsafight.github.io/little-virtual-computer/

## Quick Example

```asm
; Count from 0 to 9, then halt
define counter 0
define limit 10
copy_to_from_constant counter 0
Loop:
  add_constant counter 1 counter
  branch_if_not_equal_constant counter limit Loop
halt
```

This compiles to `9001 0 0 9011 0 1 0 9104 0 10 1003 9999` — opcodes and operands packed into program memory starting at address 1000.

## Features

- 30x30 pixel display with 16-color palette
- 23 assembly instructions (arithmetic, copy/move, compare, flow control, system)
- 3-channel audio synthesis (square, sawtooth, triangle, sine waves)
- Keyboard (3 simultaneous keys) and mouse input
- Built-in program editor with assembler, undo/redo
- Step-through debugger with breakpoints and memory read/write tracing
- Adjustable speed: single-step, slow-motion (with dirty-pixel tracking & flash), full-speed (frame-budget execution with `requestAnimationFrame`)
- EN/ZH language switching
- 6 built-in example programs + 3 custom program slots

## Memory Layout

| Range | Size | Purpose |
|-------|------|---------|
| 0 - 999 | 1000 | Working memory (variables) |
| 1000 - 1999 | 1000 | Program memory (instructions + operands) |
| 2000 - 2002 | 3 | Keyboard (3 most recent keycodes) |
| 2010 - 2013 | 4 | Mouse (x, y, pixel address, button) |
| 2050 | 1 | Random number (0-254, refreshed each cycle) |
| 2051 | 1 | Current time (Date.now()) |
| 2100 - 2999 | 900 | Video memory (30x30, color index 0-15) |
| 3000 - 3008 | 9 | Audio (3 channels x [wave, frequency, volume]) |

Pixel address = `2100 + y * 30 + x`. Write a color index (0-15) to draw.

## Instruction Set

### Copy / Move (9000-9004)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `copy_to_from` | 9000 | dest, src | `[dest] = [src]` |
| `copy_to_from_constant` | 9001 | dest, value | `[dest] = value` |
| `copy_to_from_ptr` | 9002 | dest, ptr | `[dest] = [[ptr]]` |
| `copy_into_ptr_from` | 9003 | ptr, src | `[[ptr]] = [src]` |
| `copy_address_of_label` | 9004 | dest, label | `[dest] = address(label)` |

### Arithmetic (9010-9051)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `add` / `add_constant` | 9010 / 9011 | a, b, result | `[result] = [a] + [b]` or `[a] + b` |
| `subtract` / `subtract_constant` | 9020 / 9021 | a, b, result | `[result] = [a] - [b]` or `[a] - b` |
| `multiply` / `multiply_constant` | 9030 / 9031 | a, b, result | `[result] = [a] * [b]` or `[a] * b` |
| `divide` / `divide_constant` | 9040 / 9041 | a, b, result | `[result] = floor([a] / [b])` or `floor([a] / b)` |
| `modulo` / `modulo_constant` | 9050 / 9051 | a, b, result | `[result] = [a] % [b]` or `[a] % b` |

### Compare (9090-9091)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `compare` / `compare_constant` | 9090 / 9091 | a, b, result | `[result]` = -1 if a<b, 0 if a==b, 1 if a>b |

### Flow Control (9100-9104)

| Instruction | Opcode | Operands | Description |
|-------------|--------|----------|-------------|
| `jump_to` | 9100 | dest | Unconditional jump |
| `branch_if_equal` / `_constant` | 9101 / 9102 | a, b, dest | Jump if equal |
| `branch_if_not_equal` / `_constant` | 9103 / 9104 | a, b, dest | Jump if not equal |

### System (9200, 9998-9999)

| Instruction | Opcode | Description |
|-------------|--------|-------------|
| `data` | 9200 | Embed raw data in program memory |
| `break` | 9998 | Pause execution (resume via UI) |
| `halt` | 9999 | End execution |

## Display

30x30 pixel grid, 16 colors (indexed 0-15):

| 0 Black | 1 White | 2 Red | 3 Lime | 4 Blue | 5 Yellow | 6 Cyan | 7 Magenta |
|---------|---------|-------|--------|--------|----------|--------|-----------|
| 8 Silver | 9 Gray | 10 Maroon | 11 Olive | 12 Green | 13 Purple | 14 Teal | 15 Navy |

## Audio

3 oscillator channels, each = 3 consecutive addresses: wave type, frequency, volume.

| Channel | Addresses | Wave types |
|---------|-----------|------------|
| CH1 | 3000-3002 | 0=square, 1=sawtooth, 2=triangle, 3=sine |
| CH2 | 3003-3005 | Frequency: value / 1000 Hz (20-20000) |
| CH3 | 3006-3008 | Volume: 0-100 |

## Assembly Syntax

```asm
; Comments start with semicolon
define name value          ; Named constant / working memory alias
Label:                     ; Jump target
instruction op1 op2 ...   ; Instruction with operands
```

## Built-in Programs

| Program | What it demonstrates |
|---------|---------------------|
| Add | Simplest program: 4 + 4 = 8 |
| RandomPixels | Loop + pointer-based screen fill |
| Paint | Mouse input + color picker |
| BouncingBall | Game loop with frame timing |
| MiniPong | Full game using nearly all instructions |
| ChocolateRain | Data-driven music playback |

## Architecture

```
src/
├── components/
│   ├── CPU.ts            # Fetch-decode-execute cycle
│   ├── Display.ts        # Canvas rendering (color LUT + dirty-pixel tracking)
│   ├── Input.ts          # Keyboard/mouse -> memory-mapped I/O
│   ├── Audio.ts          # Web Audio API (3 oscillator channels)
│   ├── Assembler.ts      # Two-pass assembler (label collection → code emission)
│   └── memory/
│       ├── Memory.ts     # 3100-slot RAM with optional read/write tracing
│       └── MemoryPosition.ts  # Memory layout (const enum, zero runtime cost)
├── instruction/          # Instruction definitions (data-driven: name, opcode, operands, execute)
├── simulator/
│   ├── Simulation.ts     # Execution loop (frame-budget full-speed / setTimeout slow-motion)
│   └── SimulatorUI.ts    # Debugger UI, memory views, virtualized scroll
├── index.ts              # Init & Computer interface (the only contract between core and UI)
└── simulator.ts          # Simulator entry point
```

Two independent bundles: `computer.module.js` (core) and `simulator.module.js` (UI). The simulator only talks to the core through the `Computer` interface — swap the implementation, UI still works.

## Getting Started

```bash
bun install
bun run build
# Open index.html in browser
```
