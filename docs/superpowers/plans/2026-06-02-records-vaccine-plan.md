# 档案页重构 + 疫苗追踪 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构首页和档案页职责：首页聚焦日常记录，档案页展示趋势统计 + 疫苗接种追踪。

**Architecture:** 从 RecordsScreen 提取记录列表和 FAB 到 HomeScreen；新建 VaccineSchedule、GrowthChart、StatsSummary 三个独立组件；RecordsScreen 重写为统计视图。所有组件无外部依赖，纯展示型，用 mock 数据。

**Tech Stack:** React Native + Expo SDK 56 + TypeScript

---

### Task 1: 首页添加喂养/睡眠/便便记录列表

**Files:**
- Modify: `src/screens/HomeScreen.tsx`

在 AI 工具网格的下方、今日速览的上方，插入三组记录卡片（从 RecordsScreen 迁入）。

- [ ] **Step 1: 在 HomeScreen.tsx 中添加 RecordSection 组件和记录数据**

在文件顶部，`export default function HomeScreen` 之前，插入 `RecordSection` 子组件：

```tsx
function RecordSection({ title, cards }: {
  title: string;
  cards: { date: string; title: string; detail: string; badge: string; badgeType: string }[];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cards.map((item, i) => (
          <View key={i} style={styles.recordCard}>
            <Text style={styles.rcDate}>{item.date}</Text>
            <Text style={styles.rcTitle}>{item.title}</Text>
            <Text style={styles.rcDetail}>{item.detail}</Text>
            <View style={[
              styles.rcBadge,
              item.badgeType === 'ok' && { backgroundColor: Colors.ok },
              item.badgeType === 'warn' && { backgroundColor: Colors.warn },
              item.badgeType === 'info' && { backgroundColor: Colors.primaryLight },
            ]}>
              <Text style={[
                styles.rcBadgeText,
                item.badgeType === 'ok' && { color: Colors.okText },
                item.badgeType === 'warn' && { color: Colors.warnText },
                item.badgeType === 'info' && { color: Colors.primary },
              ]}>{item.badge}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
```

- [ ] **Step 2: 在今日速览之前，插入三组记录卡片**

在 HomeScreen 中，找到 `<View style={styles.sectionLabel}>` 和今日速览的 `<Text style={styles.sectionLabelText}>今日速览</Text>`。在这之前插入：

```tsx
{/* Feeding Records */}
<RecordSection
  title="喂养记录"
  cards={[
    { date: '今天 08:30', title: '南瓜蛋黄泥', detail: '辅食第 2 餐 · 吃了大半碗', badge: '爱吃', badgeType: 'ok' },
    { date: '今天 12:00', title: '母乳喂养', detail: '左侧 15min · 右侧 10min', badge: '正常', badgeType: 'info' },
    { date: '昨天 18:00', title: '胡萝卜猪肝泥', detail: '第一次尝试 · 接受度一般', badge: '观察中', badgeType: 'warn' },
  ]}
/>

{/* Sleep Records */}
<RecordSection
  title="睡眠记录"
  cards={[
    { date: '昨晚', title: '夜间睡眠 8.2h', detail: '20:35 → 06:15 · 夜醒 2 次', badge: '正常', badgeType: 'info' },
    { date: '昨天', title: '白天小觉 40min', detail: '14:00 → 14:40', badge: '规律', badgeType: 'ok' },
    { date: '前天', title: '夜间睡眠 7.8h', detail: '21:00 → 05:50 · 夜醒 3 次', badge: '注意', badgeType: 'warn' },
  ]}
/>

{/* Poop Records */}
<RecordSection
  title="便便记录"
  cards={[
    { date: '今天', title: '健康分 85', detail: '金黄色软便 · 母乳典型', badge: '正常', badgeType: 'ok' },
    { date: '昨天', title: '健康分 78', detail: '偏干 · 建议增加饮水', badge: '注意', badgeType: 'warn' },
    { date: '5/29', title: '健康分 90', detail: '完美 · 消化吸收好', badge: '优秀', badgeType: 'ok' },
  ]}
/>
```

- [ ] **Step 3: 添加相关样式到 StyleSheet.create**

在 HomeScreen 的 `const styles = StyleSheet.create({` 末尾（最后一个 `});` 之前）添加：

```tsx
  // Record cards (from RecordsScreen)
  section: { marginHorizontal: 20, marginBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 10 },

  recordCard: {
    width: 150, backgroundColor: Colors.white, borderRadius: 14,
    padding: 14, marginRight: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  rcDate: { fontSize: 11, color: '#aaa', marginBottom: 6 },
  rcTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  rcDetail: { fontSize: 11, color: '#888', lineHeight: 17, marginBottom: 6 },
  rcBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  rcBadgeText: { fontSize: 10, fontWeight: '500' },

  // FAB
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  fabText: { fontSize: 28, color: Colors.white, lineHeight: 30 },
```

- [ ] **Step 4: 添加 FAB 按钮**

在 HomeScreen 的 ScrollView 外面（最外层 View 内、ScrollView 后），添加浮动按钮：

```tsx
<TouchableOpacity
  style={styles.fab}
  onPress={() => Alert.alert('提示', '记录已添加（演示）')}
  activeOpacity={0.8}
>
  <Text style={styles.fabText}>＋</Text>
</TouchableOpacity>
```

需要在 import 中已有 `Alert`（在 `react-native` import 里）。

- [ ] **Step 5: 重新 build 并检查本地预览**

```bash
cd E:/claude_code/infant && npx expo export --platform web
```

确认构建成功，页面无报错。

- [ ] **Step 6: Commit**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "feat: add daily feeding/sleep/poop records and FAB to home screen"
```

---

### Task 2: 创建 VaccineSchedule 组件

**Files:**
- Create: `src/components/VaccineSchedule.tsx`

- [ ] **Step 1: 创建组件文件**

```tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

interface VaccineItem {
  month: string;
  name: string;
  status: 'done' | 'due' | 'upcoming';
}

const vaccineData: VaccineItem[] = [
  { month: '出生', name: '乙肝① + 卡介苗', status: 'done' },
  { month: '1月', name: '乙肝②', status: 'done' },
  { month: '2月', name: '脊灰①', status: 'done' },
  { month: '3月', name: '脊灰② + 百白破①', status: 'done' },
  { month: '4月', name: '脊灰③ + 百白破②', status: 'done' },
  { month: '5月', name: '百白破③', status: 'done' },
  { month: '6月', name: '乙肝③ + A群流脑①', status: 'due' },
  { month: '7月', name: '空档期', status: 'upcoming' },
  { month: '8月', name: '麻腮风① + 乙脑①', status: 'upcoming' },
  { month: '9月', name: 'A群流脑②', status: 'upcoming' },
  { month: '12月', name: '基础免疫完成', status: 'upcoming' },
  { month: '18月', name: '百白破④ + 麻腮风② + 甲肝①', status: 'upcoming' },
  { month: '2岁', name: '乙脑② + 甲肝②', status: 'upcoming' },
  { month: '3岁', name: 'A+C群流脑①', status: 'upcoming' },
  { month: '6岁', name: 'A+C群流脑② + 白破', status: 'upcoming' },
];

export default function VaccineSchedule() {
  return (
    <View style={styles.container}>
      {vaccineData.map((item, i) => {
        const isDone = item.status === 'done';
        const isDue = item.status === 'due';
        const isUpcoming = item.status === 'upcoming';

        return (
          <View key={i} style={styles.row}>
            {/* Timeline dot & line */}
            <View style={styles.timeline}>
              <View style={[
                styles.dot,
                isDone && styles.dotDone,
                isDue && styles.dotDue,
                isUpcoming && styles.dotUpcoming,
              ]} />
              {i < vaccineData.length - 1 && (
                <View style={[
                  styles.line,
                  isDone && vaccineData[i + 1].status === 'done' && styles.lineDone,
                  isDone && vaccineData[i + 1].status !== 'done' && styles.linePartial,
                ]} />
              )}
            </View>

            {/* Content */}
            <View style={[styles.content, i < vaccineData.length - 1 && styles.contentSpacing]}>
              <Text style={styles.month}>{item.month}</Text>
              <Text style={[
                styles.name,
                isDone && styles.nameDone,
                isDue && styles.nameDue,
              ]}>{item.name}</Text>
              {isDone && <Text style={styles.statusDone}>✓ 已完成</Text>}
              {isDue && <Text style={styles.statusDue}>🔔 应接种</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 20, paddingRight: 12 },

  row: { flexDirection: 'row' },

  timeline: { width: 32, alignItems: 'center' },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#ddd',
  },
  dotDone: { backgroundColor: Colors.okText },
  dotDue: { backgroundColor: '#e09860' },
  dotUpcoming: { backgroundColor: '#ddd' },
  line: {
    width: 2, flex: 1, minHeight: 20, backgroundColor: '#e0e0e0',
  },
  lineDone: { backgroundColor: Colors.okText },
  linePartial: { backgroundColor: '#e0e0e0' },

  content: { flex: 1, marginLeft: 10 },
  contentSpacing: { marginBottom: 16 },
  month: { fontSize: 12, color: '#888', fontWeight: '600' },
  name: { fontSize: 14, color: Colors.text, marginTop: 2 },
  nameDone: { color: '#999' },
  nameDue: { color: Colors.text, fontWeight: '600' },

  statusDone: { fontSize: 11, color: Colors.okText, marginTop: 2 },
  statusDue: { fontSize: 11, color: '#e09860', fontWeight: '500', marginTop: 2 },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VaccineSchedule.tsx
git commit -m "feat: add VaccineSchedule component with timeline display"
```

---

### Task 3: 创建 GrowthChart 组件

**Files:**
- Create: `src/components/GrowthChart.tsx`

- [ ] **Step 1: 创建组件文件（用 View 模拟简单折线图）**

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface DataPoint { month: string; height: number; weight: number; }

const data: DataPoint[] = [
  { month: '出生', height: 50, weight: 3.3 },
  { month: '1月',  height: 54, weight: 4.2 },
  { month: '2月',  height: 58, weight: 5.1 },
  { month: '3月',  height: 61, weight: 5.9 },
  { month: '4月',  height: 64, weight: 6.5 },
  { month: '5月',  height: 66, weight: 7.1 },
  { month: '6月',  height: 68, weight: 7.8 },
];

const maxH = 72;
const minH = 48;
const maxW = 8.5;
const minW = 3.0;

export default function GrowthChart() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>生长曲线</Text>

      {/* Chart area */}
      <View style={styles.chart}>
        {/* Height bars */}
        <View style={styles.barGroup}>
          {data.map((d, i) => {
            const hPct = ((d.height - minH) / (maxH - minH)) * 100;
            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: `${hPct}%`, backgroundColor: Colors.primary }]} />
                <Text style={styles.barVal}>{d.height}</Text>
              </View>
            );
          })}
        </View>

        {/* Weight dots */}
        <View style={styles.dotGroup}>
          {data.map((d, i) => {
            const wPct = ((d.weight - minW) / (maxW - minW)) * 100;
            return (
              <View key={i} style={styles.dotCol}>
                <View style={[styles.weightDot, { bottom: `${wPct}%` }]} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Legend + Labels */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>身高 (cm)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#e09860' }]} />
          <Text style={styles.legendText}>体重 (kg)</Text>
        </View>
      </View>

      <View style={styles.xLabels}>
        {data.map((d, i) => (
          <Text key={i} style={styles.xLabel}>{d.month}</Text>
        ))}
      </View>

      <Text style={styles.latest}>当前: 68cm / 7.8kg · P50 中等水平</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, marginBottom: 18, backgroundColor: Colors.white,
    borderRadius: 14, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  title: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 16 },
  chart: { height: 140, flexDirection: 'row', marginBottom: 8 },

  barGroup: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 4 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 4 },
  barVal: { fontSize: 9, color: Colors.primary, marginTop: 2 },

  dotGroup: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' },
  dotCol: { flex: 1, alignItems: 'center', height: '100%' },
  weightDot: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#e09860',
  },

  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColor: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, color: '#888' },

  xLabels: { flexDirection: 'row' },
  xLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: '#bbb' },

  latest: { marginTop: 10, fontSize: 12, color: '#888', textAlign: 'center', fontWeight: '500' },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GrowthChart.tsx
git commit -m "feat: add GrowthChart component with bar/dot visualization"
```

---

### Task 4: 创建 StatsSummary 组件

**Files:**
- Create: `src/components/StatsSummary.tsx`

- [ ] **Step 1: 创建组件文件**

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

const stats = [
  {
    title: '本周喂养',
    icon: '🍼',
    color: Colors.feeding,
    rows: [
      { label: '日均喂养次数', value: '5.2 次' },
      { label: '日均辅食餐数', value: '2 餐' },
      { label: '最常食物', value: '南瓜泥 · 母乳' },
    ],
  },
  {
    title: '本周睡眠',
    icon: '😴',
    color: Colors.sleep,
    rows: [
      { label: '日均夜间睡眠', value: '8.0h' },
      { label: '日均白天小觉', value: '1.2h' },
      { label: '日均夜醒次数', value: '1.8 次' },
    ],
  },
  {
    title: '本周便便',
    icon: '💩',
    color: Colors.poop,
    rows: [
      { label: '日均次数', value: '2.1 次' },
      { label: '健康分均值', value: '83 分' },
      { label: '异常天数', value: '0 天' },
    ],
  },
];

export default function StatsSummary() {
  return (
    <View>
      {stats.map((section, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconBg, { backgroundColor: section.color }]}>
              <Text style={styles.icon}>{section.icon}</Text>
            </View>
            <Text style={styles.title}>{section.title}</Text>
          </View>
          <View style={styles.divider} />
          {section.rows.map((row, j) => (
            <View key={j} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  iconBg: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 14 },
  title: { fontSize: 14, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.divider, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 13, color: '#888' },
  value: { fontSize: 13, fontWeight: '600', color: Colors.text },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatsSummary.tsx
git commit -m "feat: add StatsSummary component for weekly trends"
```

---

### Task 5: 重写 RecordsScreen 为统计+疫苗视图

**Files:**
- Rewrite: `src/screens/RecordsScreen.tsx`

- [ ] **Step 1: 用新内容完整替换 RecordsScreen.tsx**

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import VaccineSchedule from '../components/VaccineSchedule';
import GrowthChart from '../components/GrowthChart';
import StatsSummary from '../components/StatsSummary';

const babies = ['小宝 · 6 个月', '姐姐 · 3 岁'];

export default function RecordsScreen() {
  const [activeBaby, setActiveBaby] = useState(0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>成长档案</Text>
          <TouchableOpacity style={styles.addBabyBtn}>
            <Text style={styles.addBabyBtnText}>＋ 添加宝宝</Text>
          </TouchableOpacity>
        </View>

        {/* Baby Chips */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.babyList} contentContainerStyle={{ gap: 8 }}
        >
          {babies.map((name, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.babyChip, activeBaby === i && styles.babyChipActive]}
              onPress={() => setActiveBaby(i)}
            >
              <Text style={[styles.babyChipText, activeBaby === i && styles.babyChipTextActive]}>
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vaccine Reminder Card */}
        <View style={styles.vaccineReminder}>
          <Text style={styles.reminderIcon}>🔔</Text>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>下一次接种提醒</Text>
            <Text style={styles.reminderVaccine}>乙肝③ + A群流脑①</Text>
            <Text style={styles.reminderMeta}>建议月龄: 6 月 · 本周可接种</Text>
          </View>
        </View>

        {/* Growth Chart */}
        <GrowthChart />

        {/* Vaccine Schedule */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>疫苗接种时间表</Text>
        </View>
        <VaccineSchedule />

        <View style={{ height: 14 }} />

        {/* Weekly Stats */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>趋势统计</Text>
        </View>
        <StatsSummary />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18,
  },
  appName: { fontSize: 20, fontWeight: '700', color: Colors.text },
  addBabyBtn: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  addBabyBtnText: { fontSize: 12, color: '#555', fontWeight: '500' },

  babyList: { marginHorizontal: 20, marginBottom: 16 },
  babyChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  babyChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  babyChipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  babyChipTextActive: { color: Colors.white },

  vaccineReminder: {
    marginHorizontal: 20, marginBottom: 18,
    backgroundColor: '#fef9f0', borderRadius: 14,
    borderWidth: 1, borderColor: '#f0dcc0',
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  reminderIcon: { fontSize: 36 },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 12, color: '#b89830', fontWeight: '500' },
  reminderVaccine: { fontSize: 18, fontWeight: '700', color: Colors.text, marginVertical: 4 },
  reminderMeta: { fontSize: 12, color: '#888' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },
});
```

- [ ] **Step 2: 验证并构建**

```bash
cd E:/claude_code/infant && npx expo export --platform web
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/RecordsScreen.tsx
git commit -m "feat: rewrite Records page with vaccine tracking, growth chart, and weekly stats"
```

---

### Task 6: 更新底部 Tab 标签

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: 更新 tabBarLabel**

将 `App.tsx` 中 `Records` Tab 的 label 从 `'档案'` 改为 `'成长'`：

```
<Tab.Screen name="Records" component={RecordsScreen} options={{ tabBarLabel: '成长' }} />
```

- [ ] **Step 2: Commit**

```bash
git add App.tsx
git commit -m "chore: rename Records tab label to 成长"
```

---

### Task 7: 最终构建并验证

- [ ] **Step 1: 重新构建 web export**

```bash
cd E:/claude_code/infant && npx expo export --platform web
```

- [ ] **Step 2: 更新 dist/index.html 标题**

使用 `web/index.html` 模板，确保已存在。

- [ ] **Step 3: 本地预览验证**

启动 serve 并检查所有页面正常导航。

- [ ] **Step 4: Commit**

```bash
git add dist/ web/
git commit -m "build: final web export with vaccine and stats features"
```
