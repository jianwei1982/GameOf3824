# Quickstart: 24点计算网页游戏

## 运行游戏

### 方式一：直接打开
双击 `index.html` 在浏览器中打开。

### 方式二：使用本地服务器（推荐）
```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Node.js (如果安装了 http-server)
npx http-server
```
然后访问 http://localhost:8000

---

## 游戏玩法

### 经典模式
1. 系统随机生成4张数字卡片
2. 从底部运算符区选择运算符
3. 点击数字卡片和运算符卡片拼成算式
4. 点击"确认"验证答案
5. 答对获得星级（1-3星，根据速度和正确性）
6. 答错显示正确答案
7. 可选择"换牌"或"宣布无解"
8. 完成10组牌后显示总成绩

### 竞速模式
1. 60秒倒计时开始
2. 尽快解答尽可能多的题目
3. 答对越快分数越高
4. 时间到显示总成绩

---

## 项目结构

```
GameOf3824/
├── index.html          # 游戏主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── game.js         # 游戏核心逻辑
│   ├── cards.js        # 卡片组件
│   ├── timer.js        # 计时器
│   └── sound.js        # 音效管理
├── assets/             # 图片、音效资源
└── tests/              # 单元测试
```

---

## 开发

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
npm test
```

### 开发模式
使用 Live Server (VS Code) 或任何本地服务器实时预览。

---

## 技术栈

- HTML5
- CSS3 (Flexbox + Grid)
- Vanilla JavaScript (ES6+)
- Vitest (测试框架)

---

**Generated**: 2026-04-22