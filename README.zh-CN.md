# 小型虚拟计算机

[English](./README.md)

一个使用 TypeScript 构建的简单模拟计算机。通过编写汇编程序来绘制像素、播放声音和响应输入，学习计算机的工作原理。Fork 自 [jsdf/little-virtual-computer](https://github.com/jsdf/little-virtual-computer)。

**在线演示：** https://wsafight.github.io/little-virtual-computer/

## 功能特性

- 30x30 像素显示器，16 色调色板（CSS 缩放至 720x720）
- 23 条汇编指令（算术、复制/移动、比较、流程控制、系统）
- 3 通道音频合成（方波、锯齿波、三角波、正弦波）
- 键盘输入（同时 3 个按键）和鼠标输入（位置、按钮、像素地址）
- 内置程序编辑器和汇编器，支持撤销/重做
- 单步调试器，支持断点和内存读写追踪
- 可调执行速度（单步到全速）
- 中英文语言切换
- 6 个内置示例程序 + 3 个自定义程序槽位

## 项目结构

```
src/
├── components/
│   ├── CPU.ts            # 取指-译码-执行循环
│   ├── Display.ts        # Canvas 渲染（颜色查找表 + 脏像素追踪）
│   ├── Input.ts          # 键盘/鼠标输入 -> 内存映射 I/O
│   ├── Audio.ts          # Web Audio API（3 个振荡器通道，增益控制）
│   ├── Assembler.ts      # 汇编文本解析器和程序加载器
│   └── memory/
│       ├── Memory.ts     # 3100 槽位内存数组，支持读写追踪
│       └── MemoryPosition.ts  # 内存布局常量和枚举
├── instruction/          # 指令集定义
│   ├── arithmetic.ts     # add, subtract, multiply, divide, modulo（+ _constant 变体）
│   ├── copy-move.ts      # copy_to_from, copy_to_from_ptr, copy_into_ptr_from, copy_address_of_label
│   ├── compare.ts        # compare, compare_constant（返回 -1 / 0 / 1）
│   ├── flow.ts           # jump_to, branch_if_equal, branch_if_not_equal（+ _constant 变体）
│   └── system.ts         # data, break, halt
├── simulator/
│   ├── Simulation.ts     # 执行循环、断点、速度控制
│   └── SimulatorUI.ts    # UI 状态、内存视图、虚拟滚动
└── index.ts              # 计算机初始化和公共 API
```

## 内存布局

| 地址范围 | 大小 | 用途 |
|---------|------|------|
| 0 - 999 | 1000 | 工作内存（通用存储） |
| 1000 - 1999 | 1000 | 程序内存（指令 + 操作数） |
| 2000 - 2002 | 3 | 键盘输入（最近 3 个按键码） |
| 2010 - 2013 | 4 | 鼠标输入（x, y, 像素地址, 按钮状态） |
| 2050 | 1 | 随机数（0-254，每周期刷新） |
| 2051 | 1 | 当前时间（Date.now()） |
| 2100 - 2999 | 900 | 显存（30x30 像素，颜色索引 0-15） |
| 3000 - 3008 | 9 | 音频（3 通道 x 3：波形类型、频率、音量） |

**总计：3100 个内存槽位**

## 指令集

### 复制 / 移动（操作码 9000-9004）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `copy_to_from` | 9000 | dest(地址), src(地址) | 从源地址复制值到目标地址 |
| `copy_to_from_constant` | 9001 | dest(地址), value(常量) | 将常量值写入目标地址 |
| `copy_to_from_ptr` | 9002 | dest(地址), src(指针) | 从源指针指向的地址复制值 |
| `copy_into_ptr_from` | 9003 | dest(指针), src(地址) | 将值写入目标指针指向的地址 |
| `copy_address_of_label` | 9004 | dest(地址), label(标签) | 将标签地址存入目标地址 |

### 算术运算（操作码 9010-9051）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `add` | 9010 | a(地址), b(地址), result(地址) | result = a + b |
| `add_constant` | 9011 | a(地址), b(常量), result(地址) | result = a + b |
| `subtract` | 9020 | a(地址), b(地址), result(地址) | result = a - b |
| `subtract_constant` | 9021 | a(地址), b(常量), result(地址) | result = a - b |
| `multiply` | 9030 | a(地址), b(地址), result(地址) | result = a * b |
| `multiply_constant` | 9031 | a(地址), b(常量), result(地址) | result = a * b |
| `divide` | 9040 | a(地址), b(地址), result(地址) | result = floor(a / b) |
| `divide_constant` | 9041 | a(地址), b(常量), result(地址) | result = floor(a / b) |
| `modulo` | 9050 | a(地址), b(地址), result(地址) | result = a % b |
| `modulo_constant` | 9051 | a(地址), b(常量), result(地址) | result = a % b |

### 比较运算（操作码 9090-9091）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `compare` | 9090 | a(地址), b(地址), result(地址) | a<b 返回 -1，a==b 返回 0，a>b 返回 1 |
| `compare_constant` | 9091 | a(地址), b(常量), result(地址) | a<b 返回 -1，a==b 返回 0，a>b 返回 1 |

### 流程控制（操作码 9100-9104）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `jump_to` | 9100 | dest(标签) | 无条件跳转 |
| `branch_if_equal` | 9101 | a(地址), b(地址), dest(标签) | 若 [a] == [b] 则跳转 |
| `branch_if_equal_constant` | 9102 | a(地址), b(常量), dest(标签) | 若 [a] == b 则跳转 |
| `branch_if_not_equal` | 9103 | a(地址), b(地址), dest(标签) | 若 [a] != [b] 则跳转 |
| `branch_if_not_equal_constant` | 9104 | a(地址), b(常量), dest(标签) | 若 [a] != b 则跳转 |

### 系统指令（操作码 9200, 9998-9999）

| 指令 | 操作码 | 操作数 | 说明 |
|------|--------|--------|------|
| `data` | 9200 | （内联值） | 在程序内存中嵌入原始数据 |
| `break` | 9998 | （无） | 暂停执行（通过 UI 恢复） |
| `halt` | 9999 | （无） | 永久终止执行 |

## 显示器

- 30x30 像素网格，通过 `transform: scale(24)` CSS 缩放至 720x720
- 16 色索引 0-15：

| 索引 | 颜色 | 索引 | 颜色 |
|------|------|------|------|
| 0 | 黑色 (Black) | 8 | 银色 (Silver) |
| 1 | 白色 (White) | 9 | 灰色 (Gray) |
| 2 | 红色 (Red) | 10 | 栗色 (Maroon) |
| 3 | 亮绿 (Lime) | 11 | 橄榄 (Olive) |
| 4 | 蓝色 (Blue) | 12 | 绿色 (Green) |
| 5 | 黄色 (Yellow) | 13 | 紫色 (Purple) |
| 6 | 青色 (Cyan) | 14 | 蓝绿 (Teal) |
| 7 | 品红 (Magenta) | 15 | 海军蓝 (Navy) |

将颜色索引（0-15）写入显存地址 2100-2999 即可设置像素颜色。像素地址 = 2100 + y * 30 + x。

## 音频

3 个独立振荡器通道，每个通道由 3 个连续内存地址控制：

| 通道 | 波形类型地址 | 频率地址 | 音量地址 |
|------|-------------|---------|---------|
| CH1 | 3000 | 3001 | 3002 |
| CH2 | 3003 | 3004 | 3005 |
| CH3 | 3006 | 3007 | 3008 |

- 波形类型：0=方波, 1=锯齿波, 2=三角波, 3=正弦波
- 频率：值 / 1000 Hz（限制在 20-20000 Hz）
- 音量：0-100（最大增益 0.15）

## 汇编语法

```asm
; 注释以分号开头
define variableName value       ; 命名常量 / 工作内存别名
LabelName:                      ; 跳转目标（解析为程序内存地址）
instruction operand1 operand2   ; 指令及操作数
```

## 内置程序

| 程序 | 说明 |
|------|------|
| Add | 两数相加，结果存入内存 |
| RandomPixels | 循环用随机颜色填充屏幕 |
| Paint | 点击绘制像素，顶行为颜色选择器 |
| BouncingBall | 白色小球在屏幕边缘弹跳 |
| MiniPong | 乒乓球游戏，两个静态挡板 |
| ChocolateRain | 使用 2 个音频通道播放 "Chocolate Rain" |

## 快速开始

```bash
bun install
bun run build
# 在浏览器中打开 index.html
```

构建输出 ESM 模块到 `dist/`：
- `dist/computer.module.js` - 核心计算机（CPU、内存、显示、音频、汇编器）
- `dist/simulator.module.js` - 模拟器 UI（调试器、编辑器、控制面板）
