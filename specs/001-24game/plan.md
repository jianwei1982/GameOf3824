# Implementation Plan: 24点计算网页游戏

**Branch**: `001-24game` | **Date**: 2026-04-22 | **Spec**: [specs/001-24game/spec.md](specs/001-24game/spec.md)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

为6-12岁儿童开发的24点计算网页游戏，支持经典模式和竞速模式。玩家通过选择数字卡片和运算符卡片拼成算式使结果等于24。采用卡片式交互设计，提供动画+音效+文字的完整反馈，答错时显示正确答案。

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES6+)
**Primary Dependencies**: 无（纯原生实现，符合宪法最小依赖原则）
**Storage**: 浏览器内存（sessionStorage），关闭标签页后丢失
**Testing**: Vitest 或 Jest（单文件测试框架）
**Target Platform**: 现代浏览器（Chrome, Firefox, Safari, Edge 最新两版本）
**Project Type**: 网页应用 / 单页应用 (SPA)
**Performance Goals**: 首次加载 < 2秒，交互响应 < 100ms，60fps 动画
**Constraints**: 需支持响应式布局（桌面/平板/手机）
**Scale/Scope**: 单人游戏，10组牌/轮

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Code Quality | ✅ PASS | 单文件HTML+CSS+JS，函数单一职责 |
| II. Testing Standards | ⚠ NEEDS CLARIFICATION | 需确定测试框架和覆盖率工具 |
| III. UX Consistency | ✅ PASS | 设计系统统一，交互有反馈 |
| IV. Performance | ✅ PASS | 无heavy依赖，满足性能目标 |

## Project Structure

### Documentation (this feature)

```text
specs/001-24game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (if needed)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
# Single HTML file (simplicity per constitution)
index.html              # 主页面
css/
└── style.css           # 样式
js/
├── game.js             # 游戏核心逻辑
├── cards.js            # 卡片组件
├── timer.js            # 计时器
└── sound.js            # 音效管理

tests/
├── game.test.js        # 游戏逻辑单元测试
└── cards.test.js       # 卡片逻辑测试
```

**Structure Decision**: 采用单HTML文件 + 模块化JS结构，简单直观，便于维护。

---

## Phase 0: Research

### Research Tasks

**R1: 测试框架选择**
- 任务：研究适合纯前端项目的轻量级测试框架
- 选项：Vitest (推荐), Jest, Mocha
- 决策：Vitest - 零配置、原生ESM、快速

**R2: 24点算法验证**
- 任务：研究并实现24点算式验证算法
- 需求：正确判断算式是否等于24，支持括号优先级
- 决策：使用eval或自定义计算函数，考虑除零和无效输入

**R3: 无解牌组检测**
- 任务：研究4张牌生成24点有解的概率及检测方法
- 需求：玩家宣布无解时能验证是否确实无解
- 决策：穷举法检查所有可能的算式组合

**R4: 音效方案**
- 任务：研究网页音频播放的实现方案
- 需求：默认开启，支持播放/暂停
- 决策：Web Audio API 或 HTML5 Audio

### Output

**Research Findings**:
- 决策：Vitest 用于单元测试
- 决策：自定义表达式解析器（安全）替代 eval
- 决策：递归枚举所有可能的算式组合
- 决策：HTML5 Audio，基础音效

---

## Phase 1: Design & Contracts

### Data Model

**Entities**:

1. **NumberCard** - 数字卡片
   - `value: number` (1-13)
   - `selected: boolean`
   - `id: string` (唯一标识)

2. **OperatorCard** - 运算符卡片
   - `operator: '+' | '-' | '×' | '÷'`
   - `selected: boolean`
   - `id: string`

3. **CardSet** - 牌组
   - `cards: NumberCard[]` (4张)
   - `isSolvable: boolean`
   - `solution: string | null` (有解时的答案)

4. **GameState** - 游戏状态
   - `mode: 'classic' | 'speed'`
   - `score: number`
   - `stars: number`
   - `hintsRemaining: number`
   - `currentSetIndex: number`
   - `timeRemaining: number` (竞速模式)

5. **Formula** - 玩家算式
   - `elements: (NumberCard | OperatorCard)[]`
   - `result: number | null`
   - `isValid: boolean`

### Contracts

**用户界面契约** (UI Contract):
- 4张数字卡片显示区域（中央）
- 运算符选择区（底部）
- 算式预览区
- 确认/换牌/提示按钮
- 计时器显示（竞速模式）
- 得分/星级显示

**音效契约**:
- `playCorrect()` - 答对音效
- `playWrong()` - 答错音效
- `playClick()` - 点击音效

### Quickstart

开发启动说明:
1. 直接在浏览器打开 index.html
2. 或使用 Live Server (VS Code 插件) 运行
3. 测试: `npm test` (配置 Vitest 后)

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 无 | N/A | N/A |

---

**Planned by**: /speckit.plan
**Generated**: 2026-04-22