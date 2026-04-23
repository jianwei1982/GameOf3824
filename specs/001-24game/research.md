# Research: 24点计算网页游戏

## R1: 测试框架选择

**Decision**: Vitest

**Rationale**:
- 零配置，原生支持 ESM
- 与 Vite 集成良好，构建速度快
- API 与 Jest 兼容，迁移成本低
- 轻量级，适合纯前端项目

**Alternatives Considered**:
- Jest: 功能完整但配置较重
- Mocha: 需要手动配置断言库

---

## R2: 24点算法验证

**Decision**: 自定义表达式解析器（非 eval）

**Rationale**:
- eval() 存在安全风险
- 需要支持中缀表达式和括号优先级
- 自定义解析器可控制除零等边界情况

**Implementation Approach**:
1. 将中缀表达式转换为后缀表达式（逆波兰表示法）
2. 使用栈计算后缀表达式结果
3. 检测除零、非法运算等情况返回错误

**Alternative**: 使用第三方数学表达式库 (math.js)
- 理由：增加依赖，不符合宪法最小依赖原则

---

## R3: 无解牌组检测

**Decision**: 穷举法检查所有可能算式

**Rationale**:
- 4张牌的组合有限（13^4 = 28561，但实际只需考虑4张特定牌）
- 运算符组合：4^3 = 64 种
- 括号优先级组合：有限几种
- 穷举法可靠且实现简单

**Algorithm**:
1. 递归枚举所有数字排列（4! = 24种）
2. 递归枚举所有运算符排列
3. 尝试所有括号位置组合
4. 计算每种组合的结果是否为24
5. 如果全部尝试后无解，则该牌组确实无解

**Performance**: 4张牌的全部组合在现代浏览器中可在毫秒级完成计算

---

## R4: 音效方案

**Decision**: HTML5 Audio API

**Rationale**:
- 浏览器原生支持，无需额外依赖
- API 简单易用
- 适合基础音效需求（正确/错误/点击音效）

**Implementation**:
```javascript
const audio = new Audio('path/to/sound.mp3');
audio.play();
```

**Sound Effects Needed**:
1. `correct.mp3` - 答对时的欢快音效
2. `wrong.mp3` - 答错时的提示音效
3. `click.mp3` - 按钮点击音效
4. `win.mp3` - 通关/高分时的庆祝音效

**Alternative**: Web Audio API
- 适用场景：需要更复杂的音频处理
- 当前项目不需要，HTML5 Audio 足够

---

## Summary

| Research Item | Decision | Key Rationale |
|---------------|----------|---------------|
| 测试框架 | Vitest | 零配置、快速、ESM原生 |
| 表达式计算 | 自定义解析器 | 安全、无依赖 |
| 无解检测 | 穷举法 | 可靠、毫秒级响应 |
| 音效 | HTML5 Audio | 原生API、简单够用 |

---

**Generated**: 2026-04-22