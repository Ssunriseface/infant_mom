# 订阅/付费体系设计

**日期**: 2026-06-04
**状态**: 已确认

## 1. 概述

新增「我的」Tab 承载订阅管理和设置入口。全部功能 15 天免费试用，之后 49 元/月订阅。月嫂链接服务 29 元/次单独计费（本期仅 UI 预留）。

## 2. 定价模型

| 项目 | 价格 | 说明 |
|------|------|------|
| 贝养会员 | 49 元/月 | 解锁全部功能，15 天免费试用 |
| 月嫂链接 | 29 元/次 | 单独计费，不包含在订阅内 |

## 3. 新增 Tab 结构

### 3.1 Tab 导航

底部新增第 4 个 Tab「我的」，从 3 个 Tab 变为 4 个：
首页 | 成长 | 咨询 | 我的

### 3.2 ProfileScreen —「我的」主页

仅展示一张订阅状态卡片，右上角齿轮进入设置。

**订阅卡片 — 三种状态：**

| 状态 | 条件 | 卡片内容 |
|------|------|----------|
| 试用中 | 安装 < 15 天 | "剩余 X 天免费试用" + 进度条 + 「立即开通 ¥49/月」 |
| 已过期 | >= 15 天，未付费 | "试用已结束" + 「开通会员 ¥49/月」 |
| 已订阅 | 已付费（预留） | "会员有效至 YYYY-MM-DD" + 「续费管理」 |

### 3.3 SettingsScreen — 设置页

通过 ProfileScreen 右上角齿轮图标进入。MVP 包含：
- 通知设置
- 宝宝档案
- 帮助与反馈
- 隐私政策
- 关于贝养+

### 3.4 月嫂链接（UI 预留）

ProfileScreen 中放置月嫂链接入口卡片，本期只做 UI 展示，功能后续实现。

## 4. 订阅状态管理

### 4.1 SubscriptionContext

全局 Context，存储订阅状态供所有组件消费：

```
字段:
  - firstLaunchDate: string (ISO date) — 首次打开 App 日期
  - isExpired: boolean — 是否超过 15 天
  - daysLeft: number — 剩余试用天数（负数表示已过期天数）
  - isSubscribed: boolean — 是否已付费（本期预留 false）

方法:
  - subscribe() — 模拟开通会员（预留真实支付接口）
```

### 4.2 计时逻辑

```
App 启动时 SubscriptionContext 初始化:
  1. 读 AsyncStorage.getItem('firstLaunchDate')
  2. 若无 → 写入今天日期 → 首次启动
  3. 若有 → 计算 (今天 - firstLaunchDate)
  4. daysLeft = 15 - 已过天数
  5. isExpired = daysLeft <= 0
```

### 4.3 存储 Key

| Key | 类型 | 说明 |
|-----|------|------|
| `firstLaunchDate` | string | 首次安装日期 ISO |
| `isSubscribed` | boolean | 付费状态（预留） |
| `subscribeExpiryDate` | string | 订阅到期日（预留） |

## 5. 付费墙行为

### 5.1 适用范围

- **锁定**: AI 工具的结果展示区域（FeedingTool、SleepTool、PoopTool）
- **不锁定**: 首页浏览、成长记录、咨询、社区内容

### 5.2 过期表现

AI 工具页面正常可进入，但分析结果区域：
- 内容模糊/遮挡
- 显示提示条："试用已结束，开通会员解锁完整结果"
- 点击提示条跳转到「我的」Tab 订阅卡片

### 5.3 实现方式

各 AI Tool Screen 通过 `useContext(SubscriptionContext)` 获取 `isExpired`，条件渲染模糊层。

## 6. 路由变更

```
App.tsx 导航结构:
  BottomTab
    ├── Home (HomeStack)
    │   ├── HomeMain
    │   ├── FeedingTool
    │   ├── SleepTool
    │   └── PoopTool
    ├── Records
    ├── Consult
    └── Profile (ProfileStack)          ← 新增
        ├── ProfileMain
        └── Settings
```

## 7. 文件清单

**新增 (3):**
- `src/screens/ProfileScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/contexts/SubscriptionContext.tsx`

**修改 (5):**
- `App.tsx` — 新增 ProfileStack、第 4 个 Tab
- `src/theme/colors.ts` — 新增订阅相关色值（金色/会员色）
- `src/screens/FeedingToolScreen.tsx` — 过期付费墙
- `src/screens/SleepToolScreen.tsx` — 过期付费墙
- `src/screens/PoopToolScreen.tsx` — 过期付费墙

## 8. 不在本期范围

- 真实支付接入（微信/支付宝/App Store）
- 月嫂链接功能实现
- 订阅续费/取消管理
- 账号体系/多设备同步
- Push 通知（到期提醒）
