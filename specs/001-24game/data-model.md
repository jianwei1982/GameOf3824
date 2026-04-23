# Data Model: 24点计算网页游戏

## Entities

### 1. NumberCard

数字卡片实体

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | 唯一标识符 | UUID 或自增ID |
| value | number | 卡片数字 | 1-13 整数 |
| selected | boolean | 是否被选中 | 默认 false |

**Methods**:
- `select()`: 选中该卡片
- `deselect()`: 取消选中
- `isSelectable()`: 是否可选（未选中时可选）

---

### 2. OperatorCard

运算符卡片实体

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | 唯一标识符 | UUID 或自增ID |
| operator | string | 运算符符号 | '+', '-', '×', '÷' |
| selected | boolean | 是否被选中 | 默认 false |

**Methods**:
- `select()`: 选中该卡片
- `deselect()`: 取消选中

---

### 3. CardSet

一副4张数字卡片的组合

| Field | Type | Description |
|-------|------|-------------|
| id | string | 唯一标识符 |
| cards | NumberCard[] | 4张数字卡片 |
| isSolvable | boolean | 是否有解 |
| solution | string \| null | 有解时的答案示例 |

**Methods**:
- `generate()`: 随机生成4张卡片
- `checkSolvable()`: 检查是否有解
- `getSolution()`: 返回一个有效解法
- `shuffle()`: 重新生成

**Validation Rules**:
- cards 数组长度必须为4
- 每张卡片 value 在 1-13 范围内

---

### 4. GameState

游戏状态管理

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| mode | string | 游戏模式 | 'classic' |
| currentSetIndex | number | 当前牌组序号 | 0 |
| totalSets | number | 总牌组数 | 10 |
| score | number | 当前得分 | 0 |
| stars | number | 当前星级 | 0 |
| hintsRemaining | number | 剩余提示次数 | 3 |
| timeRemaining | number | 剩余秒数 | 60 |
| isGameOver | boolean | 游戏是否结束 | false |
| history | GameRecord[] | 游戏历史记录 | [] |

**Methods**:
- `startClassic()`: 开始经典模式
- `startSpeed()`: 开始竞速模式
- `nextCardSet()`: 进入下一组牌
- `useHint()`: 使用一次提示
- `endGame()`: 结束游戏

---

### 5. Formula

玩家拼接的算式

| Field | Type | Description |
|-------|------|-------------|
| elements | (NumberCard\|OperatorCard)[] | 算式元素序列 |
| expression | string | 可计算的表达式字符串 |
| result | number \| null | 计算结果 |
| isValid | boolean | 是否有效（格式正确） |
| equals24 | boolean | 是否等于24 |

**Methods**:
- `addElement(card)`: 添加元素到算式
- `removeLast()`: 移除最后一个元素
- `clear()`: 清空算式
- `evaluate()`: 计算结果
- `validate()`: 验证格式

**Validation Rules**:
- 不能连续出现两个运算符
- 不能连续出现两个数字
- 首个元素不能是运算符
- 末位元素不能是运算符

---

### 6. GameConfig

游戏配置

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| cardsPerSet | number | 每组卡片数 | 4 |
| setsPerGame | number | 每局牌组数 | 10 |
| speedModeTime | number | 竞速模式时间(秒) | 60 |
| hintsPerGame | number | 每局提示次数 | 3 |
| minCardValue | number | 最小卡片数字 | 1 |
| maxCardValue | number | 最大卡片数字 | 13 |
| soundEnabled | boolean | 音效是否开启 | true |

---

## State Transitions

### Game State Machine

```
[INIT] --startClassic--> [PLAYING_CLASSIC]
                      --startSpeed--> [PLAYING_SPEED]

[PLAYING_CLASSIC] --nextSet--> [PLAYING_CLASSIC]
                   --useHint--> [PLAYING_CLASSIC]
                   --endGame--> [GAME_OVER]

[PLAYING_SPEED] --correctAnswer--> [PLAYING_SPEED]
                --timeout--> [GAME_OVER]
                --useHint--> [PLAYING_SPEED]

[GAME_OVER] --restart--> [INIT]
```

---

## Relationships

```
GameState
├── currentCardSet: CardSet
├── currentFormula: Formula
└── config: GameConfig

CardSet
└── cards: NumberCard[]

Formula
├── elements: (NumberCard | OperatorCard)[]
└── uses cards from currentCardSet
```

---

**Generated**: 2026-04-22