# 记录录入功能设计

**日期**: 2026-06-04
**状态**: 已确认

## 1. 概述

首页每个记录区（喂养/睡眠/便便）添加内嵌录入表单，点击标题旁 ＋ 展开。同时 AI 工具页中产生的记录自动同步到首页。

## 2. 共享存储

### 2.1 RecordContext

全局 Context 管理所有记录：

```
字段:
  feedingRecords: FeedingRecord[]
  sleepRecords: SleepRecord[]
  poopRecords: PoopRecord[]

方法:
  addFeeding(r) / addSleep(r) / addPoop(r)
  removeFeeding(i) / removeSleep(i) / removePoop(i)
```

### 2.2 数据结构

```ts
FeedingRecord: { id, time, type: '母乳'|'配方奶'|'辅食', food, amount, note }
SleepRecord:   { id, date, sleepTime, wakeTime, duration, wakes, note }
PoopRecord:    { id, time, color: string, texture: '软'|'稀'|'硬', note }
```

### 2.3 持久化

AsyncStorage 存取，key: `feedingRecords` / `sleepRecords` / `poopRecords`

## 3. 首页内嵌表单

### 3.1 交互

每个 `RecordSection` 标题行右边有小 ＋ 按钮，点击切换表单展开/收起。同一时间只有一个表单展开。

### 3.2 喂养表单

- 类型切换：母乳 / 配方奶 / 辅食（三个 Chip）
- 食物名称：TextInput
- 食量：TextInput（选填）
- 备注：TextInput（选填）
- 时间：默认当前时间
- 保存按钮

### 3.3 睡眠表单

- 入睡时间：时间选择（默认 20:00）
- 醒来时间：时间选择（默认 06:00）
- 时长：自动计算显示
- 夜醒次数：数字输入
- 备注：选填
- 保存按钮

### 3.4 便便表单

- 颜色：色块选择（金黄/绿/棕/灰/红）
- 性状：三个 Chip（软/稀/硬）
- 备注：选填
- 时间：默认当前时间
- 保存按钮

## 4. 工具页自动同步

### 4.1 睡眠助手

`SleepToolScreen` 中 "保存记录" 后，将入睡/醒来/时长/夜醒写入 `RecordContext.addSleep()`

### 4.2 便便分析

`PoopToolScreen` 中 AI 分析结果卡片加「保存到记录」按钮，点击写入 `RecordContext.addPoop()`

### 4.3 辅食生成

`FeedingToolScreen` 中生成的食谱卡片加「记录为今日辅食」按钮，点击写入 `RecordContext.addFeeding()`

## 5. 文件清单

**新增:**
- `src/contexts/RecordContext.tsx`

**修改:**
- `App.tsx` — 包裹 RecordProvider
- `src/screens/HomeScreen.tsx` — 内嵌表单 + 动态记录数据
- `src/screens/SleepToolScreen.tsx` — 保存记录同步
- `src/screens/PoopToolScreen.tsx` — 保存记录按钮
- `src/screens/FeedingToolScreen.tsx` — 记录为辅食按钮

## 6. 不在本期范围

- 时间选择器用 TextInput 模拟（不做真正的 TimePicker 组件）
- 拍照功能
- 记录编辑/删除（只做新增）
- 云端同步
