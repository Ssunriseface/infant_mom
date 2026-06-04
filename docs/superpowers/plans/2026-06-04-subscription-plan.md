# 订阅/付费体系 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增「我的」Tab（订阅状态卡片 + 设置），实现 15 天试用计时 + AI 工具付费墙。

**Architecture:** SubscriptionContext 用 AsyncStorage 管理试用状态，全局 provide；ProfileScreen 和三个 AI Tool Screen 消费该 Context。付费墙在 AI 工具结果区域覆盖模糊层和升级提示。

**Tech Stack:** React Native + Expo SDK 56, AsyncStorage, React Context

---

### Task 1: Add subscription colors to theme

**Files:**
- Modify: `src/theme/colors.ts`

- [ ] **Step 1: Add member gold colors**

```ts
export const Colors = {
  primary: '#5b7ab8',
  primaryLight: '#eef2ff',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a1a',
  subtext: '#999',
  border: '#e0e0e0',
  divider: '#f5f5f5',
  white: '#ffffff',

  feeding: '#fff5e8',
  feedingText: '#e09860',
  sleep: '#eef2ff',
  sleepText: '#6b7ec8',
  cry: '#fff0ee',
  cryText: '#d47868',
  poop: '#f0f5ec',
  poopText: '#7a9a60',

  ok: '#eef5e6',
  okText: '#5b8a40',
  warn: '#fef7e6',
  warnText: '#b89830',

  // 会员/订阅
  memberGold: '#d4a853',
  memberGoldLight: '#fdf6e8',
};
```

- [ ] **Step 2: Commit**

```bash
cd E:\claude_code\infant && git add src/theme/colors.ts && git commit -m "feat: add subscription gold colors to theme"
```

---

### Task 2: Create SubscriptionContext

**Files:**
- Create: `src/contexts/SubscriptionContext.tsx`

- [ ] **Step 1: Implement SubscriptionContext with AsyncStorage trial tracking**

```tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_DAYS = 15;
const STORAGE_KEY = 'firstLaunchDate';
const SUBSCRIBED_KEY = 'isSubscribed';

interface SubscriptionState {
  isExpired: boolean;
  daysLeft: number;
  isSubscribed: boolean;
  subscribe: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState>({
  isExpired: false,
  daysLeft: TRIAL_DAYS,
  isSubscribed: false,
  subscribe: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [firstLaunchDate, setFirstLaunchDate] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    (async () => {
      let date = await AsyncStorage.getItem(STORAGE_KEY);
      if (!date) {
        date = new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_KEY, date);
      }
      setFirstLaunchDate(date);
      const sub = await AsyncStorage.getItem(SUBSCRIBED_KEY);
      setIsSubscribed(sub === 'true');
    })();
  }, []);

  const daysSinceLaunch = firstLaunchDate
    ? Math.floor((Date.now() - new Date(firstLaunchDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const daysLeft = TRIAL_DAYS - daysSinceLaunch;
  const isExpired = !isSubscribed && daysLeft <= 0;

  const subscribe = useCallback(async () => {
    await AsyncStorage.setItem(SUBSCRIBED_KEY, 'true');
    setIsSubscribed(true);
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isExpired, daysLeft, isSubscribed, subscribe }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
```

- [ ] **Step 2: Install AsyncStorage**

Run: `cd E:\claude_code\infant && npm install @react-native-async-storage/async-storage`

Expected: package installed, package.json updated

- [ ] **Step 3: Commit**

```bash
git add src/contexts/SubscriptionContext.tsx package.json package-lock.json && git commit -m "feat: add SubscriptionContext with 15-day trial tracking"
```

---

### Task 3: Create ProfileScreen

**Files:**
- Create: `src/screens/ProfileScreen.tsx`

- [ ] **Step 1: Implement ProfileScreen with subscription card + gear icon**

```tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function ProfileScreen({ navigation }: any) {
  const { isExpired, daysLeft, isSubscribed } = useSubscription();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>我的</Text>
        <TouchableOpacity
          style={styles.gearBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Subscription Card */}
        <View style={styles.memberCard}>
          <View style={styles.memberIconRow}>
            <Text style={styles.memberIcon}>🎖</Text>
            <Text style={styles.memberTitle}>贝养会员</Text>
          </View>

          {isSubscribed ? (
            <>
              <Text style={styles.memberStatus}>已订阅 · 会员有效</Text>
              <TouchableOpacity style={styles.memberBtn}>
                <Text style={styles.memberBtnText}>续费管理</Text>
              </TouchableOpacity>
            </>
          ) : !isExpired ? (
            <>
              <Text style={styles.memberStatus}>
                剩余 <Text style={styles.daysHighlight}>{daysLeft}</Text> 天免费试用
              </Text>
              {/* Progress bar */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((15 - daysLeft) / 15) * 100}%` },
                  ]}
                />
              </View>
              <TouchableOpacity style={styles.memberBtn}>
                <Text style={styles.memberBtnText}>立即开通 ¥49/月</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.memberStatusExpired}>试用已结束</Text>
              <TouchableOpacity style={styles.memberBtn}>
                <Text style={styles.memberBtnText}>开通会员 ¥49/月</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.memberDesc}>
            解锁全部 AI 智能工具 · 无限次使用 · 专业育儿分析
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  memberCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.memberGoldLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  memberIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  memberIcon: { fontSize: 28 },
  memberTitle: { fontSize: 20, fontWeight: '700', color: Colors.memberGold },
  memberStatus: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberStatusExpired: {
    fontSize: 16,
    color: '#d47868',
    fontWeight: '600',
    marginBottom: 8,
  },
  daysHighlight: {
    color: Colors.memberGold,
    fontSize: 24,
    fontWeight: '700',
  },

  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.memberGold,
    borderRadius: 3,
  },

  memberBtn: {
    backgroundColor: Colors.memberGold,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  memberBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  memberDesc: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ProfileScreen.tsx && git commit -m "feat: add ProfileScreen with subscription card"
```

---

### Task 4: Create SettingsScreen

**Files:**
- Create: `src/screens/SettingsScreen.tsx`

- [ ] **Step 1: Implement SettingsScreen with static list**

```tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const settingsItems = [
  { icon: 'notifications-outline', label: '通知设置' },
  { icon: 'person-outline', label: '宝宝档案' },
  { icon: 'chatbox-ellipses-outline', label: '帮助与反馈' },
  { icon: 'document-text-outline', label: '隐私政策' },
  { icon: 'information-circle-outline', label: '关于贝养+' },
];

export default function SettingsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>设置</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {settingsItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.row,
                i < settingsItems.length - 1 && styles.rowBorder,
              ]}
              activeOpacity={0.6}
            >
              <View style={styles.rowLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={Colors.text}
                />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: { fontSize: 15, color: Colors.text, fontWeight: '500' },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SettingsScreen.tsx && git commit -m "feat: add SettingsScreen with static settings list"
```

---

### Task 5: Update App.tsx — add Profile tab and routes

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Add ProfileStack, 4th tab, and wrap with SubscriptionProvider**

Replace the full file content. Current file is:

```tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from './src/theme/colors';

import HomeScreen from './src/screens/HomeScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import ConsultScreen from './src/screens/ConsultScreen';
import FeedingToolScreen from './src/screens/FeedingToolScreen';
import SleepToolScreen from './src/screens/SleepToolScreen';
import PoopToolScreen from './src/screens/PoopToolScreen';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="FeedingTool" component={FeedingToolScreen}
        options={{
          headerShown: true, headerTitle: 'AI 辅食生成',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="SleepTool" component={SleepToolScreen}
        options={{
          headerShown: true, headerTitle: '睡眠助手',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="PoopTool" component={PoopToolScreen}
        options={{
          headerShown: true, headerTitle: '便便分析',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

const TabIcons: Record<string, { active: string; inactive: string }> = {
  Home:      { active: 'home',        inactive: 'home-outline' },
  Records:   { active: 'document-text',       inactive: 'document-text-outline' },
  Consult:   { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
};

function TabIcon({ name, focused, color, size }: {
  name: string; focused: boolean; color: string; size: number;
}) {
  const icons = TabIcons[name];
  if (!icons) return null;
  return <Ionicons name={focused ? icons.active : icons.inactive as any} size={size} color={color} />;
}

export default function App() {
  const content = (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <TabIcon name={route.name} focused={focused} color={color} size={size} />,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#bbb',
          tabBarStyle: {
            borderTopWidth: 1, borderTopColor: '#eee',
            paddingTop: 8, paddingBottom: 22, height: 80, backgroundColor: Colors.white,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: '首页' }} />
        <Tab.Screen name="Records" component={RecordsScreen} options={{ tabBarLabel: '成长' }} />
        <Tab.Screen name="Consult" component={ConsultScreen} options={{ tabBarLabel: '咨询' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#e8ecf1',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 390,
          height: '100%',
          maxHeight: 850,
          overflow: 'hidden',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 10,
        }}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}
```

New content:

```tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from './src/theme/colors';
import { SubscriptionProvider } from './src/contexts/SubscriptionContext';

import HomeScreen from './src/screens/HomeScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import ConsultScreen from './src/screens/ConsultScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FeedingToolScreen from './src/screens/FeedingToolScreen';
import SleepToolScreen from './src/screens/SleepToolScreen';
import PoopToolScreen from './src/screens/PoopToolScreen';

const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="FeedingTool" component={FeedingToolScreen}
        options={{
          headerShown: true, headerTitle: 'AI 辅食生成',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="SleepTool" component={SleepToolScreen}
        options={{
          headerShown: true, headerTitle: '睡眠助手',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="PoopTool" component={PoopToolScreen}
        options={{
          headerShown: true, headerTitle: '便便分析',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen
        name="Settings" component={SettingsScreen}
        options={{
          headerShown: true, headerTitle: '设置',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}

const TabIcons: Record<string, { active: string; inactive: string }> = {
  Home:      { active: 'home',        inactive: 'home-outline' },
  Records:   { active: 'document-text',       inactive: 'document-text-outline' },
  Consult:   { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  Profile:   { active: 'person',              inactive: 'person-outline' },
};

function TabIcon({ name, focused, color, size }: {
  name: string; focused: boolean; color: string; size: number;
}) {
  const icons = TabIcons[name];
  if (!icons) return null;
  return <Ionicons name={focused ? icons.active : icons.inactive as any} size={size} color={color} />;
}

export default function App() {
  const content = (
    <SubscriptionProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => <TabIcon name={route.name} focused={focused} color={color} size={size} />,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: '#bbb',
            tabBarStyle: {
              borderTopWidth: 1, borderTopColor: '#eee',
              paddingTop: 8, paddingBottom: 22, height: 80, backgroundColor: Colors.white,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
          })}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: '首页' }} />
          <Tab.Screen name="Records" component={RecordsScreen} options={{ tabBarLabel: '成长' }} />
          <Tab.Screen name="Consult" component={ConsultScreen} options={{ tabBarLabel: '咨询' }} />
          <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ tabBarLabel: '我的' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SubscriptionProvider>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#e8ecf1',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 390,
          height: '100%',
          maxHeight: 850,
          overflow: 'hidden',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 10,
        }}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}
```

- [ ] **Step 2: Commit**

```bash
git add App.tsx && git commit -m "feat: add Profile tab and Settings route to navigation"
```

---

### Task 6: Add paywall to FeedingToolScreen

**Files:**
- Modify: `src/screens/FeedingToolScreen.tsx`

- [ ] **Step 1: Import SubscriptionContext and wrap AI result area with paywall**

Add import at top:
```tsx
import { useSubscription } from '../contexts/SubscriptionContext';
```

Add at top of component body (after `const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);`):
```tsx
const { isExpired } = useSubscription();
```

Wrap the generated recipe section (the `{generatedRecipe && (...)}` block around line 137-144) with a paywall check. Replace:

```tsx
        {/* Generated Recipe */}
        {generatedRecipe && (
          <>
            <View style={styles.generatedLabel}>
              <Text style={styles.generatedLabelText}>✨ AI 为您生成</Text>
            </View>
            <RecipeCard recipe={generatedRecipe} highlight />
          </>
        )}
```

With:

```tsx
        {/* Generated Recipe */}
        {generatedRecipe && (
          <>
            <View style={styles.generatedLabel}>
              <Text style={styles.generatedLabelText}>✨ AI 为您生成</Text>
            </View>
            {isExpired ? (
              <View style={styles.paywallOverlay}>
                <View style={styles.paywallContent}>
                  <Text style={styles.paywallIcon}>🔒</Text>
                  <Text style={styles.paywallText}>试用已结束</Text>
                  <Text style={styles.paywallSub}>开通会员解锁完整 AI 食谱分析</Text>
                </View>
                <View style={styles.paywallBlurred}>
                  <RecipeCard recipe={generatedRecipe} highlight />
                </View>
              </View>
            ) : (
              <RecipeCard recipe={generatedRecipe} highlight />
            )}
          </>
        )}
```

Add these styles to the StyleSheet:
```ts
  paywallOverlay: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 14,
  },
  paywallBlurred: {
    opacity: 0.25,
    overflow: 'hidden',
    borderRadius: 14,
  },
  paywallContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
  },
  paywallIcon: { fontSize: 36, marginBottom: 10 },
  paywallText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  paywallSub: {
    fontSize: 13,
    color: Colors.subtext,
    textAlign: 'center',
  },
```

Also replace the top-level imports to include `useSubscription`:
```tsx
import { useSubscription } from '../contexts/SubscriptionContext';
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/FeedingToolScreen.tsx && git commit -m "feat: add paywall overlay to FeedingTool when trial expired"
```

---

### Task 7: Add paywall to SleepToolScreen

**Files:**
- Modify: `src/screens/SleepToolScreen.tsx`

- [ ] **Step 1: Import SubscriptionContext and wrap AI prediction + timer with paywall**

Add import at top:
```tsx
import { useSubscription } from '../contexts/SubscriptionContext';
```

Add at top of component body:
```tsx
const { isExpired } = useSubscription();
```

Wrap the AI prediction card and the action buttons with paywall when expired. Replace:

```tsx
        {/* Sleep Prediction */}
        <Animated.View style={[styles.predictCard, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.predictLabel}>AI 今晚预测</Text>
          <Text style={styles.predictTime}>预计 20:30 入睡</Text>
          <Text style={styles.predictDetail}>睡眠约 9.2h · 夜醒 1–2 次 · 建议 20:00 开始哄睡</Text>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => setIsSleeping(!isSleeping)}
          >
            <Text style={styles.btnPrimaryText}>
              {isSleeping ? `记录中... ${formatTime(elapsed)}` : '开始睡眠'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
            <Text style={styles.btnSecondaryText}>哄睡辅助</Text>
          </TouchableOpacity>
        </View>
```

With:

```tsx
        {/* Sleep Prediction */}
        {isExpired ? (
          <View style={styles.paywallOverlay}>
            <View style={styles.paywallContent}>
              <Text style={styles.paywallIcon}>🔒</Text>
              <Text style={styles.paywallText}>试用已结束</Text>
              <Text style={styles.paywallSub}>开通会员解锁 AI 睡眠预测</Text>
            </View>
            <View style={styles.paywallBlurred}>
              <Animated.View style={[styles.predictCard, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.predictLabel}>AI 今晚预测</Text>
                <Text style={styles.predictTime}>预计 20:30 入睡</Text>
                <Text style={styles.predictDetail}>睡眠约 9.2h · 夜醒 1–2 次 · 建议 20:00 开始哄睡</Text>
              </Animated.View>
              <View style={styles.btnRow}>
                <View style={[styles.btn, styles.btnPrimary]}>
                  <Text style={styles.btnPrimaryText}>开始睡眠</Text>
                </View>
                <View style={[styles.btn, styles.btnSecondary]}>
                  <Text style={styles.btnSecondaryText}>哄睡辅助</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            <Animated.View style={[styles.predictCard, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.predictLabel}>AI 今晚预测</Text>
              <Text style={styles.predictTime}>预计 20:30 入睡</Text>
              <Text style={styles.predictDetail}>睡眠约 9.2h · 夜醒 1–2 次 · 建议 20:00 开始哄睡</Text>
            </Animated.View>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => setIsSleeping(!isSleeping)}
              >
                <Text style={styles.btnPrimaryText}>
                  {isSleeping ? `记录中... ${formatTime(elapsed)}` : '开始睡眠'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
                <Text style={styles.btnSecondaryText}>哄睡辅助</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
```

Add these styles to the StyleSheet:
```ts
  paywallOverlay: {
    marginHorizontal: 20,
    marginBottom: 14,
    position: 'relative',
  },
  paywallBlurred: {
    opacity: 0.25,
    overflow: 'hidden',
    borderRadius: 14,
  },
  paywallContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
  },
  paywallIcon: { fontSize: 30, marginBottom: 8 },
  paywallText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  paywallSub: {
    fontSize: 13,
    color: Colors.subtext,
    textAlign: 'center',
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SleepToolScreen.tsx && git commit -m "feat: add paywall overlay to SleepTool when trial expired"
```

---

### Task 8: Add paywall to PoopToolScreen — replace old hardcoded paywall

**Files:**
- Modify: `src/screens/PoopToolScreen.tsx`

- [ ] **Step 1: Replace hardcoded paywall with SubscriptionContext-based one**

Add import at top:
```tsx
import { useSubscription } from '../contexts/SubscriptionContext';
```

Remove the old state:
```tsx
// REMOVE: const [remainingFree, setRemainingFree] = useState(8);
```

Add at top of component body:
```tsx
const { isExpired } = useSubscription();
```

Replace the `handleAnalyze` function. Old:
```tsx
  const handleAnalyze = () => {
    if (isAnalyzing) return;

    if (remainingFree <= 0) {
      Alert.alert(
        '免费次数已用完',
        '10 次免费分析已用完。开通睡眠助手会员（¥9.9/月）即可无限次使用便便分析。',
        [
          { text: '稍后再说', style: 'cancel' },
          { text: '开通会员', onPress: () => Alert.alert('提示', '即将跳转会员开通页面...') },
        ]
      );
      return;
    }

    setIsAnalyzing(true);
    setHasResult(false);
    setRemainingFree((r) => r - 1);

    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };
```

New:
```tsx
  const handleAnalyze = () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setHasResult(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };
```

Remove the free badge:
```tsx
        {/* REMOVE THIS BLOCK:
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>剩余免费次数：{remainingFree} 次</Text>
        </View>
        */}
```

Wrap the result card with paywall when expired. Replace:

```tsx
        {/* Result */}
        {hasResult && !isAnalyzing && (
          <View style={styles.resultCard}>
            ...result content...
          </View>
        )}
```

With:

```tsx
        {/* Result */}
        {hasResult && !isAnalyzing && (
          isExpired ? (
            <View style={styles.paywallOverlay}>
              <View style={styles.paywallContent}>
                <Text style={styles.paywallIcon}>🔒</Text>
                <Text style={styles.paywallText}>试用已结束</Text>
                <Text style={styles.paywallSub}>开通会员解锁完整 AI 分析结果</Text>
              </View>
              <View style={styles.paywallBlurred}>
                <View style={styles.resultCard}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreNum}>85</Text>
                    <Text style={styles.scoreLabel}>健康分</Text>
                  </View>
                  <Text style={styles.resultDetail}>
                    <Text style={styles.resultOk}>颜色正常</Text>
                    {' · '}
                    <Text style={styles.resultOk}>性状正常</Text>
                  </Text>
                  <Text style={styles.resultSub}>金黄色软便，糊状，母乳喂养典型</Text>
                  <View style={styles.fakeNannyLink}>
                    <Text style={styles.nannyLinkText}>不准？连线月嫂帮你看</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.resultCard}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNum}>85</Text>
                <Text style={styles.scoreLabel}>健康分</Text>
              </View>
              <Text style={styles.resultDetail}>
                <Text style={styles.resultOk}>颜色正常</Text>
                {' · '}
                <Text style={styles.resultOk}>性状正常</Text>
              </Text>
              <Text style={styles.resultSub}>金黄色软便，糊状，母乳喂养典型</Text>

              <TouchableOpacity style={styles.nannyLink} onPress={handleCallNanny}>
                <Text style={styles.nannyLinkText}>不准？连线月嫂帮你看</Text>
              </TouchableOpacity>
            </View>
          )}
        )}
```

Remove the old upgrade cards at the bottom:
```tsx
        {/* REMOVE:
        {remainingFree <= 3 && remainingFree > 0 && (
          <View style={styles.upgradeCard}>
            ...
          </View>
        )}

        {remainingFree <= 0 && (
          <View style={styles.upgradeCard}>
            ...
          </View>
        )}
        */}
```

Add these styles to the StyleSheet:
```ts
  paywallOverlay: {
    marginHorizontal: 20,
    marginBottom: 18,
    position: 'relative',
  },
  paywallBlurred: {
    opacity: 0.25,
    overflow: 'hidden',
    borderRadius: 14,
  },
  paywallContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
  },
  paywallIcon: { fontSize: 36, marginBottom: 10 },
  paywallText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  paywallSub: {
    fontSize: 13,
    color: Colors.subtext,
    textAlign: 'center',
  },
  fakeNannyLink: {
    marginTop: 14,
    paddingVertical: 10,
    backgroundColor: '#fef9f0',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0dcc0',
    paddingHorizontal: 24,
  },
```

Also remove unused `Alert` import (if `handleCallNanny` still uses it, keep it). Since `handleCallNanny` still uses `Alert.alert`, keep `Alert` import.

- [ ] **Step 2: Commit**

```bash
git add src/screens/PoopToolScreen.tsx && git commit -m "feat: replace hardcoded paywall in PoopTool with SubscriptionContext-based paywall"
```

---

### Task 9: Final verification

- [ ] **Step 1: TypeScript type check**

Run: `cd E:\claude_code\infant && npx tsc --noEmit`

Expected: no type errors

- [ ] **Step 2: Start dev server and verify**

Run: `cd E:\claude_code\infant && npx expo start --web`

Manual verification:
1. 4 tabs visible at bottom: 首页, 成长, 咨询, 我的
2. "我的" tab shows subscription card with "剩余 15 天试用"
3. Gear icon opens Settings page, back works
4. AI tools work normally (within 15 days)
5. To test expired state: temporarily set `TRIAL_DAYS = 0` in SubscriptionContext, verify paywall overlays appear

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "chore: final verification fixes"
```
