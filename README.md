# 3D魔方模拟器 | 3D Rubik's Cube Simulator

一个功能完整的三维魔方模拟器应用，使用 Three.js 实现高质量的 3D 渲染和交互。

A fully-featured 3D Rubik's Cube simulator application built with Three.js for high-quality 3D rendering and interaction.

## 功能特性 | Features

### 3D 渲染 | 3D Rendering
- ✅ 使用 Three.js 创建逼真的 3D 魔方模型
- ✅ 精准的立方体几何和颜色映射
- ✅ 流畅的场景渲染和多光源照明
- ✅ 实时阴影和高光效果

### 交互控制 | Interactive Control
- ✅ **鼠标操作**
  - 拖动鼠标调整魔方视角（3D 旋转）
  - Shift + 拖动调整摄像机距离（缩放）
  - 鼠标滚轮缩放
  
- ✅ **键盘快捷键**
  - 单层旋转：U/u, D/d, L/l, R/r, F/f, B/b
  - 中间层：M/m, E/e, S/s
  - 整体旋转：X/x, Y/y, Z/z
  - Space：打乱/重置切换

### 核心功能 | Core Features
- ✅ 魔方打乱（随机 20 步）
- ✅ 魔方重置到初始状态
- ✅ 步数计数器
- ✅ 计时器（精确到秒）
- ✅ 完成检测（自动识别已解决的状态）
- ✅ 移动历史跟踪

### 用户界面 | User Interface
- ✅ 直观的控制面板
  - 实时统计信息（步数、时间、状态）
  - 快捷操作按钮
  - 键盘快捷键提示
  - 视角快速切换

- ✅ 多种预设视角
  - 前视图、后视图、左视图、右视图
  - 顶视图、底视图、等距视图

- ✅ 响应式设计
  - 自适应各种屏幕尺寸
  - 触摸友好的界面

## 技术栈 | Tech Stack

- **前端框架**: HTML5 + CSS3 + JavaScript (ES6+)
- **3D 渲染**: Three.js r128
- **画布**: WebGL via Three.js
- **响应式设计**: CSS Grid & Flexbox

## 文件结构 | File Structure

```
├── index.html          # 主 HTML 文件
├── styles.css         # 样式文件
├── app.js            # 主应用文件（渲染和交互）
├── rubiks-cube.js    # 魔方逻辑文件（状态管理）
└── README.md         # 本文件
```

## 使用方法 | Usage

### 安装 | Installation

1. 将所有文件放在同一目录中
2. 使用 Web 服务器打开 `index.html`

```bash
# 使用 Python 3
python -m http.server 8000

# 或使用 Node.js
npx http-server

# 或使用其他 Web 服务器
```

3. 在浏览器中访问 `http://localhost:8000`

### 操作指南 | Control Guide

#### 鼠标操作 | Mouse Controls
- **左键拖动**: 旋转魔方视角
- **Shift + 拖动**: 调整缩放距离
- **滚轮**: 缩放

#### 键盘快捷键 | Keyboard Shortcuts

**单层旋转 (Single Layer Rotations)**:
- `U` - 上面顺时针 | Up face clockwise
- `u` - 上面逆时针 | Up face counter-clockwise
- `D` - 下面顺时针 | Down face clockwise
- `d` - 下面逆时针 | Down face counter-clockwise
- `L` - 左面顺时针 | Left face clockwise
- `l` - 左面逆时针 | Left face counter-clockwise
- `R` - 右面顺时针 | Right face clockwise
- `r` - 右面逆时针 | Right face counter-clockwise
- `F` - 前面顺时针 | Front face clockwise
- `f` - 前面逆时针 | Front face counter-clockwise
- `B` - 后面顺时针 | Back face clockwise
- `b` - 后面逆时针 | Back face counter-clockwise

**中间层 (Middle Layers)**:
- `M` - 中间层顺时针 | Middle layer clockwise
- `m` - 中间层逆时针 | Middle layer counter-clockwise
- `E` - 赤道层顺时针 | Equator layer clockwise
- `e` - 赤道层逆时针 | Equator layer counter-clockwise
- `S` - 站层顺时针 | Standing layer clockwise
- `s` - 站层逆时针 | Standing layer counter-clockwise

**整体旋转 (Cube Rotations)**:
- `X` - 绕 X 轴顺时针 | Rotate around X axis clockwise
- `x` - 绕 X 轴逆时针 | Rotate around X axis counter-clockwise
- `Y` - 绕 Y 轴顺时针 | Rotate around Y axis clockwise
- `y` - 绕 Y 轴逆时针 | Rotate around Y axis counter-clockwise
- `Z` - 绕 Z 轴顺时针 | Rotate around Z axis clockwise
- `z` - 绕 Z 轴逆时针 | Rotate around Z axis counter-clockwise

**其他 (Miscellaneous)**:
- `Space` - 切换打乱/重置 | Toggle scramble/reset
- 按钮点击: 使用 UI 按钮执行对应操作

#### 按钮操作 | Button Operations
- **打乱魔方**: 随机打乱魔方（20 步）
- **重置**: 将魔方恢复到初始状态
- **自动求解(演示)**: 撤销所有移动（演示功能）

#### 视角切换 | View Switching
点击视角按钮快速切换到不同的观看角度。

## 代码结构 | Code Structure

### `rubiks-cube.js` - 魔方核心逻辑

主要类：`RubiksCube`

主要方法：
- `move(notation)` - 执行魔方移动
- `scramble(moveCount)` - 打乱魔方
- `reset()` - 重置魔方
- `isSolved()` - 检查是否已解决
- `undo()` - 撤销上一步操作

### `app.js` - 应用主文件

主要类：`RubiksCubeApp`

主要职责：
- Three.js 场景、相机、渲染器初始化
- 立方体视觉表示创建和更新
- 用户交互处理（鼠标、键盘）
- UI 元素更新
- 动画循环管理

## 浏览器兼容性 | Browser Compatibility

- Chrome/Chromium (推荐 | Recommended)
- Firefox
- Safari
- Edge
- 其他支持 WebGL 的现代浏览器

## 性能优化 | Performance Optimization

- 使用 WebGL 加速渲染
- 启用阴影贴图进行高效阴影
- 适应性帧率调整
- 响应式画布大小调整

## 扩展功能建议 | Future Enhancement Ideas

- [ ] 求解算法实现（显示解决步骤）
- [ ] 更复杂的动画效果
- [ ] 统计分析面板
- [ ] 多种游戏模式
- [ ] 触摸设备支持优化
- [ ] 声音效果
- [ ] 本地存储（保存最好成绩）
- [ ] 多语言支持

## 许可证 | License

MIT License

## 作者 | Author

3D Rubik's Cube Simulator Project

---

**享受解魔方的乐趣！| Enjoy solving the Rubik's Cube!**
