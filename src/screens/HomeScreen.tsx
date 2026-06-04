import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';

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

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>贝养+</Text>
          <TouchableOpacity style={styles.babyTag}>
            <Text style={styles.babyTagText}>小宝 ▾</Text>
          </TouchableOpacity>
        </View>

        {/* Baby Info Card */}
        <View style={styles.babyCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>小</Text>
          </View>
          <View style={styles.babyInfo}>
            <Text style={styles.babyAge}>男宝 · 纯母乳喂养</Text>
            <Text style={styles.babyDays}>6 个月 12 天</Text>
            <Text style={styles.babyTip}>今天适合添加 南瓜泥 / 蛋黄 ｜ 今晚预计 20:30 入睡</Text>
          </View>
        </View>

        {/* Tools Grid */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>AI 智能工具</Text>
        </View>

        <View style={styles.toolGrid}>
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('FeedingTool')}
            activeOpacity={0.7}
          >
            <View style={[styles.toolIcon, { backgroundColor: Colors.feeding }]}>
              <Text style={styles.toolEmoji}>🥣</Text>
            </View>
            <Text style={styles.toolName}>AI 辅食生成</Text>
            <Text style={styles.toolDesc}>按月龄定制食谱{'\n'}过敏提醒·营养分析</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('SleepTool')}
            activeOpacity={0.7}
          >
            <View style={[styles.toolIcon, { backgroundColor: Colors.sleep }]}>
              <Text style={styles.toolEmoji}>😴</Text>
            </View>
            <Text style={styles.toolName}>睡眠助手</Text>
            <Text style={styles.toolDesc}>追踪·哄睡·AI 预测{'\n'}今晚预计 20:30 入睡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('CryTool')}
            activeOpacity={0.7}
          >
            <View style={[styles.toolIcon, { backgroundColor: Colors.cry }]}>
              <Text style={styles.toolEmoji}>🎤</Text>
            </View>
            <Text style={styles.toolName}>哭声翻译器</Text>
            <Text style={styles.toolDesc}>手机收音·AI 识别{'\n'}饿了·困了·不舒服</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('PoopTool')}
            activeOpacity={0.7}
          >
            <View style={[styles.toolIcon, { backgroundColor: Colors.poop }]}>
              <Text style={styles.toolEmoji}>📋</Text>
            </View>
            <Text style={styles.toolName}>便便分析</Text>
            <Text style={styles.toolDesc}>拍照分析颜色性状{'\n'}AI 健康评估报告</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>今日速览</Text>
        </View>

        <View style={styles.todayStrip}>
          <View style={styles.todayItem}>
            <Text style={styles.todayVal}>2 餐</Text>
            <Text style={styles.todayLbl}>辅食</Text>
          </View>
          <View style={styles.todayItem}>
            <Text style={styles.todayVal}>8.2h</Text>
            <Text style={styles.todayLbl}>昨夜睡眠</Text>
          </View>
          <View style={styles.todayItem}>
            <Text style={styles.todayVal}>85 分</Text>
            <Text style={styles.todayLbl}>便便健康</Text>
          </View>
          <View style={styles.todayItem}>
            <Text style={styles.todayVal}>正常</Text>
            <Text style={styles.todayLbl}>情绪状态</Text>
          </View>
        </View>

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

      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => Alert.alert('提示', '记录已添加（演示）')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
  appName: { fontSize: 20, fontWeight: '700', color: Colors.text },
  babyTag: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  babyTagText: { fontSize: 12, color: '#555', fontWeight: '500' },

  babyCard: {
    marginHorizontal: 20,
    marginBottom: 18,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#c4d4f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, color: Colors.white },
  babyInfo: { flex: 1 },
  babyAge: { fontSize: 12, color: Colors.subtext },
  babyDays: { fontSize: 18, fontWeight: '700', color: Colors.text, marginVertical: 2 },
  babyTip: { fontSize: 12, color: '#777' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },

  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 18,
    gap: 10,
  },
  toolCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolEmoji: { fontSize: 24 },
  toolName: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  toolDesc: { fontSize: 11, color: Colors.subtext, lineHeight: 17, textAlign: 'center' },

  todayStrip: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  todayItem: { alignItems: 'center' },
  todayVal: { fontSize: 18, fontWeight: '700', color: Colors.text },
  todayLbl: { fontSize: 11, color: Colors.subtext, marginTop: 4 },

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
});
