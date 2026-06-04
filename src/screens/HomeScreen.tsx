import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useRecords, FeedingRecord, SleepRecord, PoopRecord } from '../contexts/RecordContext';

function RecordCard({ date, title, detail, badge, badgeType }: {
  date: string; title: string; detail: string; badge: string; badgeType: string;
}) {
  return (
    <View style={styles.recordCard}>
      <Text style={styles.rcDate}>{date}</Text>
      <Text style={styles.rcTitle}>{title}</Text>
      <Text style={styles.rcDetail}>{detail}</Text>
      <View style={[
        styles.rcBadge,
        badgeType === 'ok' && { backgroundColor: Colors.ok },
        badgeType === 'warn' && { backgroundColor: Colors.warn },
        badgeType === 'info' && { backgroundColor: Colors.primaryLight },
      ]}>
        <Text style={[
          styles.rcBadgeText,
          badgeType === 'ok' && { color: Colors.okText },
          badgeType === 'warn' && { color: Colors.warnText },
          badgeType === 'info' && { color: Colors.primary },
        ]}>{badge}</Text>
      </View>
    </View>
  );
}

const FEEDING_TYPES: FeedingRecord['type'][] = ['母乳', '配方奶', '辅食'];
const POOP_COLORS = [
  { code: '#e8d088', name: '金黄' },
  { code: '#a0b888', name: '绿' },
  { code: '#b89868', name: '棕' },
  { code: '#c0c0c0', name: '灰' },
  { code: '#d47868', name: '红' },
];
const POOP_TEXTURES: PoopRecord['texture'][] = ['软', '稀', '硬'];

export default function HomeScreen({ navigation }: any) {
  const { feedingRecords, sleepRecords, poopRecords, addFeeding, addSleep, addPoop } = useRecords();
  const [openForm, setOpenForm] = useState<'feeding' | 'sleep' | 'poop' | null>(null);

  // Feeding form state
  const [feedType, setFeedType] = useState<FeedingRecord['type']>('辅食');
  const [feedFood, setFeedFood] = useState('');
  const [feedAmount, setFeedAmount] = useState('');
  const [feedNote, setFeedNote] = useState('');

  // Sleep form state
  const [sleepTime, setSleepTime] = useState('20:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepWakes, setSleepWakes] = useState('0');
  const [sleepNote, setSleepNote] = useState('');

  // Poop form state
  const [poopColor, setPoopColor] = useState(POOP_COLORS[0]);
  const [poopTexture, setPoopTexture] = useState<PoopRecord['texture']>('软');
  const [poopNote, setPoopNote] = useState('');

  const now = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const calcDuration = (st: string, wt: string) => {
    const [sh, sm] = st.split(':').map(Number);
    const [wh, wm] = wt.split(':').map(Number);
    let mins = (wh * 60 + wm) - (sh * 60 + sm);
    if (mins < 0) mins += 24 * 60;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h${m > 0 ? m + 'm' : ''}`;
  };

  const handleSaveFeeding = () => {
    if (!feedFood.trim()) return;
    addFeeding({
      time: now(),
      type: feedType,
      food: feedFood.trim(),
      amount: feedAmount.trim() || undefined,
      note: feedNote.trim() || undefined,
    });
    setFeedFood(''); setFeedAmount(''); setFeedNote(''); setOpenForm(null);
  };

  const handleSaveSleep = () => {
    addSleep({
      date: '昨晚',
      sleepTime,
      wakeTime,
      duration: calcDuration(sleepTime, wakeTime),
      wakes: parseInt(sleepWakes, 10) || 0,
      note: sleepNote.trim() || undefined,
    });
    setSleepNote(''); setOpenForm(null);
  };

  const handleSavePoop = () => {
    addPoop({
      time: now(),
      color: poopColor.code,
      colorName: poopColor.name,
      texture: poopTexture,
      note: poopNote.trim() || undefined,
    });
    setPoopNote(''); setOpenForm(null);
  };

  const feedingCards = feedingRecords.slice(0, 5).map((r) => ({
    date: `今天 ${r.time}`,
    title: r.food,
    detail: `${r.type}${r.amount ? ' · ' + r.amount : ''}${r.note ? ' · ' + r.note : ''}`,
    badge: r.type === '辅食' ? '辅食' : r.type,
    badgeType: 'ok',
  }));

  const sleepCards = sleepRecords.slice(0, 5).map((r) => ({
    date: r.date,
    title: `夜间睡眠 ${r.duration}`,
    detail: `${r.sleepTime} → ${r.wakeTime} · 夜醒 ${r.wakes} 次`,
    badge: r.wakes <= 1 ? '良好' : r.wakes <= 2 ? '正常' : '注意',
    badgeType: r.wakes <= 1 ? 'ok' : r.wakes <= 2 ? 'info' : 'warn',
  }));

  const poopCards = poopRecords.slice(0, 5).map((r) => ({
    date: `今天 ${r.time}`,
    title: `${r.colorName}${r.texture}便`,
    detail: r.note || `${r.colorName}色${r.texture}便`,
    badge: r.texture === '软' ? '正常' : '注意',
    badgeType: r.texture === '软' ? 'ok' : 'warn',
  }));

  const todayFeedCount = feedingRecords.filter((r) => r.time.startsWith(new Date().getHours().toString())).length || feedingRecords.length || 0;

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
          <TouchableOpacity style={styles.toolCard} onPress={() => navigation.navigate('FeedingTool')} activeOpacity={0.7}>
            <View style={[styles.toolIcon, { backgroundColor: Colors.feeding }]}>
              <Text style={styles.toolEmoji}>🥣</Text>
            </View>
            <Text style={styles.toolName}>AI 辅食生成</Text>
            <Text style={styles.toolDesc}>按月龄定制食谱{'\n'}过敏提醒·营养分析</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolCard} onPress={() => navigation.navigate('SleepTool')} activeOpacity={0.7}>
            <View style={[styles.toolIcon, { backgroundColor: Colors.sleep }]}>
              <Text style={styles.toolEmoji}>😴</Text>
            </View>
            <Text style={styles.toolName}>睡眠助手</Text>
            <Text style={styles.toolDesc}>追踪·哄睡·AI 预测{'\n'}今晚预计 20:30 入睡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolCard} onPress={() => navigation.navigate('PoopTool')} activeOpacity={0.7}>
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
            <Text style={styles.todayVal}>{todayFeedCount} 餐</Text>
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

        {/* === Feeding Records === */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>喂养记录</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setOpenForm(openForm === 'feeding' ? null : 'feeding')}
            >
              <Text style={styles.addBtnText}>{openForm === 'feeding' ? '−' : '＋'}</Text>
            </TouchableOpacity>
          </View>

          {openForm === 'feeding' && (
            <View style={styles.formCard}>
              <View style={styles.chipRow}>
                {FEEDING_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, feedType === t && styles.chipActive]}
                    onPress={() => setFeedType(t)}
                  >
                    <Text style={[styles.chipText, feedType === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={styles.input} placeholder="食物名称" placeholderTextColor="#ccc" value={feedFood} onChangeText={setFeedFood} />
              <TextInput style={styles.input} placeholder="食量（选填）" placeholderTextColor="#ccc" value={feedAmount} onChangeText={setFeedAmount} />
              <TextInput style={styles.input} placeholder="备注（选填）" placeholderTextColor="#ccc" value={feedNote} onChangeText={setFeedNote} />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFeeding}>
                <Text style={styles.saveBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {feedingCards.length > 0 ? feedingCards.map((item, i) => (
              <RecordCard key={i} {...item} />
            )) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无喂养记录</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* === Sleep Records === */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>睡眠记录</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setOpenForm(openForm === 'sleep' ? null : 'sleep')}
            >
              <Text style={styles.addBtnText}>{openForm === 'sleep' ? '−' : '＋'}</Text>
            </TouchableOpacity>
          </View>

          {openForm === 'sleep' && (
            <View style={styles.formCard}>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>入睡</Text>
                  <TextInput style={styles.input} placeholder="20:00" placeholderTextColor="#ccc" value={sleepTime} onChangeText={setSleepTime} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>醒来</Text>
                  <TextInput style={styles.input} placeholder="06:00" placeholderTextColor="#ccc" value={wakeTime} onChangeText={setWakeTime} />
                </View>
              </View>
              <Text style={styles.durationText}>时长: {calcDuration(sleepTime, wakeTime)}</Text>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>夜醒次数</Text>
                  <TextInput style={styles.input} placeholder="0" placeholderTextColor="#ccc" value={sleepWakes} onChangeText={setSleepWakes} keyboardType="numeric" />
                </View>
              </View>
              <TextInput style={styles.input} placeholder="备注（选填）" placeholderTextColor="#ccc" value={sleepNote} onChangeText={setSleepNote} />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSleep}>
                <Text style={styles.saveBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sleepCards.length > 0 ? sleepCards.map((item, i) => (
              <RecordCard key={i} {...item} />
            )) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无睡眠记录</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* === Poop Records === */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>便便记录</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setOpenForm(openForm === 'poop' ? null : 'poop')}
            >
              <Text style={styles.addBtnText}>{openForm === 'poop' ? '−' : '＋'}</Text>
            </TouchableOpacity>
          </View>

          {openForm === 'poop' && (
            <View style={styles.formCard}>
              <Text style={styles.formLabel}>颜色</Text>
              <View style={styles.chipRow}>
                {POOP_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c.name}
                    style={[styles.colorChip, poopColor.name === c.name && styles.colorChipActive]}
                    onPress={() => setPoopColor(c)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: c.code }]} />
                    <Text style={styles.colorName}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.formLabel}>性状</Text>
              <View style={styles.chipRow}>
                {POOP_TEXTURES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, poopTexture === t && styles.chipActive]}
                    onPress={() => setPoopTexture(t)}
                  >
                    <Text style={[styles.chipText, poopTexture === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={styles.input} placeholder="备注（选填）" placeholderTextColor="#ccc" value={poopNote} onChangeText={setPoopNote} />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSavePoop}>
                <Text style={styles.saveBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {poopCards.length > 0 ? poopCards.map((item, i) => (
              <RecordCard key={i} {...item} />
            )) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无便便记录</Text>
              </View>
            )}
          </ScrollView>
        </View>

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
  babyTag: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  babyTagText: { fontSize: 12, color: '#555', fontWeight: '500' },
  babyCard: {
    marginHorizontal: 20, marginBottom: 18, backgroundColor: Colors.white,
    borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#c4d4f0', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, color: Colors.white },
  babyInfo: { flex: 1 },
  babyAge: { fontSize: 12, color: Colors.subtext },
  babyDays: { fontSize: 18, fontWeight: '700', color: Colors.text, marginVertical: 2 },
  babyTip: { fontSize: 12, color: '#777' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },

  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, marginBottom: 18, gap: 10 },
  toolCard: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 14, padding: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  toolIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  toolEmoji: { fontSize: 24 },
  toolName: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  toolDesc: { fontSize: 11, color: Colors.subtext, lineHeight: 17, textAlign: 'center' },

  todayStrip: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: Colors.white, borderRadius: 14,
    padding: 16, flexDirection: 'row', justifyContent: 'space-around',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  todayItem: { alignItems: 'center' },
  todayVal: { fontSize: 18, fontWeight: '700', color: Colors.text },
  todayLbl: { fontSize: 11, color: Colors.subtext, marginTop: 4 },

  // Record section
  section: { marginHorizontal: 20, marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  addBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 18, fontWeight: '600', color: Colors.primary, lineHeight: 20 },

  // Inline form
  formCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: '#555', fontWeight: '500' },
  chipTextActive: { color: Colors.white },
  colorChip: {
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  colorChipActive: { borderColor: Colors.primary, borderWidth: 2 },
  colorDot: { width: 14, height: 14, borderRadius: 7 },
  colorName: { fontSize: 11, fontWeight: '500', color: Colors.text },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, fontSize: 13, color: Colors.text,
    backgroundColor: '#fafafa', marginBottom: 10,
  },
  formRow: { flexDirection: 'row', gap: 10 },
  formCol: { flex: 1 },
  formLabel: { fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 4 },
  durationText: { fontSize: 14, fontWeight: '600', color: Colors.primary, marginBottom: 10, textAlign: 'center' },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', marginTop: 4,
  },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },

  // Record cards
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

  emptyCard: {
    width: 150, backgroundColor: Colors.white, borderRadius: 14,
    padding: 24, marginRight: 10, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  emptyText: { fontSize: 12, color: '#ccc' },
});
