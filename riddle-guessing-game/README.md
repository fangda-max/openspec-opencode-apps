# 🎮 Riddle Guessing Game - 猜谜语游戏

一个使用纯原生 HTML/CSS/JavaScript 开发的猜谜语小游戏。

## 🚀 快速开始

直接在浏览器中打开 `index.html` 文件：

```bash
# Windows (PowerShell)
Start-Process "file:///$(pwd)/riddle-guessing-game/index.html"

# macOS
open index.html

# Linux
xdg-open index.html
```

或者使用任意 HTTP 服务器：
```bash
python -m http.server 8000
# 访问 http://localhost:8000/riddle-guessing-game/
```

## 🎯 游戏特性

### 核心玩法
- **15 道谜语** - 分为 3 个难度等级
  - 😊 简单 (Easy): 3 题 - 初始解锁
  - 🤔 中等 (Medium): 5 题 - 50 分解锁
  - 😈 困难 (Hard): 7 题 - 100 分解锁

### 计分系统
- **基础分**: 每答对一题得 10 分
- **提示惩罚**:
  - 第 1 个提示：-2 分
  - 第 2 个提示：-4 分（累计 -6 分）
  - 第 3 个提示：-6 分（累计 -12 分）
- **最高分记录**: 使用 localStorage 持久化保存

### 提示系统
每个谜语提供 3 个渐进式提示：
1. **提示 1**: 宽泛的方向指引
2. **提示 2**: 更具体的线索
3. **提示 3**: 几乎揭晓答案

## 📁 项目结构

```
riddle-guessing-game/
├── index.html          # 单文件应用（包含所有 HTML/CSS/JS）
└── README.md           # 本说明文档
```

## 🛠️ 技术实现

### 架构特点
- **单文件设计**: 所有代码在一个 HTML 文件中，便于分享和部署
- **零依赖**: 无需 npm、构建工具或外部库
- **响应式设计**: 适配手机、平板和桌面设备
- **本地存储**: 使用 localStorage 保存最高分记录

### 核心技术
```javascript
// 谜语数据结构
{
  id: number,
  question: string,
  answer: string[],
  category: string,
  difficulty: 'easy' | 'medium' | 'hard',
  hints: string[]
}

// 状态管理
- currentRiddleIndex: 当前谜语索引
- score: 当前得分
- usedHints: 已使用的提示数量
- highScores: { easy, medium, hard } 各难度最高分
```

## 🎨 界面预览

### 游戏界面
- **顶部面板**: 显示当前分数、最高分和当前难度
- **谜语框**: 展示谜语文本，答对后变绿色
- **输入区域**: 答案输入框 + 提交按钮
- **提示区域**: 点击"Show Hint"逐步显示提示
- **反馈消息**: 答对显示绿色 ✓，答错显示红色 ✗

### 视觉设计
- 紫色渐变背景 (`#667eea` → `#764ba2`)
- 圆角卡片式设计 (16px border-radius)
- 平滑过渡动画 (0.3s ease)
- 移动端优先的响应式布局

## 📝 谜语示例

### 简单难度
**Q**: "What has hands but cannot clap?"  
**A**: Clock (时钟)

**提示**:
1. It's an object you find in your home
2. It helps you know the time
3. It has hour and minute hands

### 中等难度
**Q**: "What can you catch but not throw?"  
**A**: Cold (感冒)

**提示**:
1. It's not a physical object
2. You get it when someone is sick
3. Doctors advise washing hands to prevent it

### 困难难度
**Q**: "The more you take, the more you leave behind. What am I?"  
**A**: Footsteps (脚印)

**提示**:
1. It's related to movement
2. You create them while walking
3. They can be seen in sand or snow

## 🏆 挑战目标

尝试达成以下成就：
- [ ] **新手**: 在简单难度获得 30 分（全对且不用提示）
- [ ] **进阶**: 解锁中等难度并获得 80 分
- [ ] **大师**: 解锁困难难度并获得 150 分
- [ ] **完美主义者**: 不依赖任何提示完成全部 15 题

## 💡 开发笔记

### 使用 OpenSpec 规范驱动开发

本项目通过 OpenSpec 工作流开发，展示了完整的 SDD 流程：

1. **Propose 阶段**: 生成 `proposal.md` 定义游戏目标和核心能力
2. **Design 阶段**: 编写 `design.md` 规划单文件架构和状态管理策略
3. **Specs 阶段**: 创建 5 个规范文件（riddle-engine, hint-system, riddle-content, score-manager, riddle-game-ui）
4. **Tasks 阶段**: 生成 33 项可执行任务清单
5. **Apply 阶段**: OpenCode 按照规范逐项实现
6. **Archive 阶段**: 归档变更并合并规范到主库

相关文件位于：
```
openspec/changes/archive/2026-03-24-riddle-guessing-game/
├── proposal.md
├── design.md
├── specs/
│   ├── riddle-engine/spec.md
│   ├── hint-system/spec.md
│   ├── riddle-content/spec.md
│   ├── score-manager/spec.md
│   └── riddle-game-ui/spec.md
└── tasks.md
```

### 关键实现决策

1. **为什么选择单文件？**
   - 便于分享和部署（只需一个文件）
   - 避免 CORS 和本地文件加载问题
   - 适合小型游戏的简单性

2. **为什么使用 localStorage？**
   - 无需后端即可持久化数据
   - 浏览器原生支持，兼容性好
   - 适合保存轻量级的高分记录

3. **难度解锁机制**
   - 防止新手直接挑战高难度导致挫败感
   - 提供渐进式学习曲线
   - 增加游戏的可玩性和挑战性

## 🔧 扩展建议

如果你想增强这个游戏，可以考虑：

1. **更多谜语**: 在 `riddles` 数组中添加新的谜语对象
2. **计时模式**: 添加答题倒计时，增加紧张感
3. **音效**: 使用 Web Audio API 添加正确/错误提示音
4. **多人模式**: 支持多个玩家轮流答题并记录各自分数
5. **主题切换**: 添加亮色/暗色主题切换功能
6. **分享功能**: 允许玩家分享自己的最高分到社交媒体

## 📄 许可证

MIT License © 2026

---

*Built with ❤️ using OpenSpec specification-driven development*
