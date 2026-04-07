# 小型虚拟计算机

[English](./README.md)

一台用 TypeScript 构建的虚拟计算机——3100 个内存槽位，23 条指令，一切皆内存映射 I/O。编写汇编程序来绘制像素、播放声音、响应键盘和鼠标输入。Fork 自 [jsdf/little-virtual-computer](https://github.com/jsdf/little-virtual-computer)。

**在线体验：** https://wsafight.github.io/little-virtual-computer/

## 快速示例

```asm
; 从 0 数到 9，然后停机
define counter 0
define limit 10
copy_to_from_constant counter 0
Loop:
  add_constant counter 1 counter
  branch_if_not_equal_constant counter limit Loop
halt
```

编译结果：`9001 0 0 9011 0 1 0 9104 0 10 1003 9999`——操作码和操作数依次写入从地址 1000 开始的程序内存。

## 功能特性

- 30x30 像素显示器，16 色调色板
- 23 条汇编指令（算术、复制/移动、比较、流程控制、系统）
- 3 通道音频合成（方波、锯齿波、三角波、正弦波）
- 键盘输入（同时 3 个按键）和鼠标输入
- 内置程序编辑器和汇编器，支持撤销/重做
- 单步调试器，支持断点和内存读写追踪
- 可调速度：单步、慢放（脏像素追踪 + 写入闪白）、全速（帧预算执行 + `requestAnimationFrame`）
- 中英文语言切换
- 6 个内置示例程序 + 3 个自定义程序槽位

## 内存布局

| 地址范围 | 大小 | 用途 |
|---------|------|------|
| 0 - 999 | 1000 | 工作内存（变量） |
| 1000 - 1999 | 1000 | 程序内存（指令 + 操作数） |
| 2000 - 2002 | 3 | 键盘（最近 3 个按键码） |
| 2010 - 2013 | 4 | 鼠标（x, y, 像素地址, 按钮） |
| 2050 | 1 | 随机数（0-254，每周期刷新） |
| 2051 | 1 | 当前时间（Date.now()） |
| 2100 - 2999 | 900 | 显存（30x30，颜色索引 0-15） |
| 3000 - 3008 | 9 | 音频（3 通道 x [波形, 频率, 音量]） |

像素地址 = `2100 + y * 30 + x`，写入颜色索引（0-15）即可绘制。

## 指令集

### 复制 / 移动（9000-9004）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `copy_to_from` | 9000 | dest, src | `[dest] = [src]` |
| `copy_to_from_constant` | 9001 | dest, value | `[dest] = value` |
| `copy_to_from_ptr` | 9002 | dest, ptr | `[dest] = [[ptr]]` |
| `copy_into_ptr_from` | 9003 | ptr, src | `[[ptr]] = [src]` |
| `copy_address_of_label` | 9004 | dest, label | `[dest] = address(label)` |

### 算术运算（9010-9051）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `add` / `add_constant` | 9010 / 9011 | a, b, result | `[result] = [a] + [b]` 或 `[a] + b` |
| `subtract` / `subtract_constant` | 9020 / 9021 | a, b, result | `[result] = [a] - [b]` 或 `[a] - b` |
| `multiply` / `multiply_constant` | 9030 / 9031 | a, b, result | `[result] = [a] * [b]` 或 `[a] * b` |
| `divide` / `divide_constant` | 9040 / 9041 | a, b, result | `[result] = floor([a] / [b])` 或 `floor([a] / b)` |
| `modulo` / `modulo_constant` | 9050 / 9051 | a, b, result | `[result] = [a] % [b]` 或 `[a] % b` |

### 比较运算（9090-9091）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `compare` / `compare_constant` | 9090 / 9091 | a, b, result | `[result]` = a<b 时 -1，a==b 时 0，a>b 时 1 |

### 流程控制（9100-9104）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `jump_to` | 9100 | dest | 无条件跳转 |
| `branch_if_equal` / `_constant` | 9101 / 9102 | a, b, dest | 相等则跳转 |
| `branch_if_not_equal` / `_constant` | 9103 / 9104 | a, b, dest | 不等则跳转 |

### 系统指令（9200, 9998-9999）

| 指令 | 操作码 | 说明 |
|------|--------|------|
| `data` | 9200 | 在程序内存中嵌入原始数据 |
| `break` | 9998 | 暂停执行（通过 UI 恢复） |
| `halt` | 9999 | 终止执行 |

## 显示器

30x30 像素网格，16 色（索引 0-15）：

| 0 黑色 | 1 白色 | 2 红色 | 3 亮绿 | 4 蓝色 | 5 黄色 | 6 青色 | 7 品红 |
|--------|--------|--------|--------|--------|--------|--------|--------|
| 8 银色 | 9 灰色 | 10 栗色 | 11 橄榄 | 12 绿色 | 13 紫色 | 14 蓝绿 | 15 海军蓝 |

## 音频

3 个振荡器通道，每个 = 3 个连续地址：波形类型、频率、音量。

| 通道 | 地址 | 波形类型 |
|------|------|---------|
| CH1 | 3000-3002 | 0=方波, 1=锯齿波, 2=三角波, 3=正弦波 |
| CH2 | 3003-3005 | 频率：值 / 1000 Hz（20-20000） |
| CH3 | 3006-3008 | 音量：0-100 |

## 汇编语法

```asm
; 注释以分号开头
define name value          ; 命名常量 / 工作内存别名
Label:                     ; 跳转目标
instruction op1 op2 ...   ; 指令及操作数
```

## 内置程序

| 程序 | 演示内容 |
|------|---------|
| Add | 最简程序：4 + 4 = 8 |
| RandomPixels | 循环 + 指针遍历填充屏幕 |
| Paint | 鼠标输入 + 颜色选择器 |
| BouncingBall | 游戏循环与帧率控制 |
| MiniPong | 几乎用到所有指令的完整游戏 |
| ChocolateRain | 数据驱动的音乐播放 |

## 项目结构

```
src/
├── components/
│   ├── CPU.ts            # 取指-译码-执行循环
│   ├── Display.ts        # Canvas 渲染（颜色查找表 + 脏像素追踪）
│   ├── Input.ts          # 键盘/鼠标 -> 内存映射 I/O
│   ├── Audio.ts          # Web Audio API（3 个振荡器通道）
│   ├── Assembler.ts      # 两遍扫描汇编器（标签收集 → 代码生成）
│   └── memory/
│       ├── Memory.ts     # 3100 槽位 RAM，可选读写追踪
│       └── MemoryPosition.ts  # 内存布局（const enum，零运行时开销）
├── instruction/          # 指令定义（数据驱动：名称、操作码、操作数、执行函数）
├── simulator/
│   ├── Simulation.ts     # 执行循环（全速帧预算 / 慢放 setTimeout）
│   └── SimulatorUI.ts    # 调试器 UI、内存视图、虚拟滚动
├── index.ts              # 初始化 & Computer 接口（核心与 UI 之间的唯一契约）
└── simulator.ts          # 模拟器入口
```

两个独立 bundle：`computer.module.js`（核心）和 `simulator.module.js`（UI）。模拟器仅通过 `Computer` 接口与核心通信——替换整个计算机实现，UI 照常工作。

## 快速开始

```bash
bun install
bun run build
# 在浏览器中打开 index.html
```
