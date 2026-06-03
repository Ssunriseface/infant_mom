import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '../theme/colors';

const sootheSounds = [
  { icon: '🌧', name: '雨声' },
  { icon: '🌊', name: '海浪' },
  { icon: '💨', name: '白噪音' },
  { icon: '💓', name: '心跳' },
  { icon: '🎵', name: '摇篮曲' },
];

const sleepLogs = [
  { icon: '🌙', iconBg: Colors.sleep, time: '20:35 入睡', tag: '自主入睡 · 昨晚', ago: '8h前' },
  { icon: '☀️', iconBg: Colors.feeding, time: '06:15 醒来', tag: '情绪开心', ago: '22h前' },
  { icon: '☁️', iconBg: Colors.sleep, time: '14:00 午觉', tag: '白天小觉 · 40 分钟', ago: '昨天' },
];

const moodEmojis = ['😊', '😐', '😢'];

export default function SleepToolScreen() {
  const [playing, setPlaying] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wakeCount, setWakeCount] = useState(0);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [mood, setMood] = useState(0);
  const [notes, setNotes] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  useEffect(() => {
    if (isSleeping) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isSleeping]);

  const formatTime = (sec: number) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleEndSleep = () => {
    setIsSleeping(false);
    setShowSaveForm(true);
  };

  const handleSave = () => {
    setShowSaveForm(false);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    setSavedMsg(`已保存 · ${h}h ${m}m · 夜醒 ${wakeCount} 次`);
    setElapsed(0);
    setWakeCount(0);
    setNotes('');
    setMood(0);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleCancelSave = () => {
    setShowSaveForm(false);
    setElapsed(0);
    setWakeCount(0);
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Saved confirmation */}
        {savedMsg !== '' && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedBannerText}>✅ {savedMsg}</Text>
          </View>
        )}

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

        {/* Sleep Timer */}
        {isSleeping && (
          <View style={styles.timerCard}>
            <Text style={styles.timerTitle}>正在记录睡眠...</Text>
            <Text style={styles.timerClock}>{formatTime(elapsed)}</Text>
            <View style={styles.timerActions}>
              <TouchableOpacity style={styles.wakeBtn} onPress={() => setWakeCount((c) => c + 1)}>
                <Text style={styles.wakeBtnText}>记录夜醒 +{wakeCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.endBtn} onPress={handleEndSleep}>
                <Text style={styles.endBtnText}>宝宝醒了，结束记录</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Save Form (appears after ending sleep) */}
        {showSaveForm && (
          <View style={styles.saveFormCard}>
            <Text style={styles.saveFormTitle}>记录睡眠完成</Text>
            <Text style={styles.saveFormClock}>
              {Math.floor(elapsed / 3600)}h {Math.floor((elapsed % 3600) / 60)}m
            </Text>
            <Text style={styles.saveFormDetail}>
              夜醒 {wakeCount} 次 · 20:35 — {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </Text>

            <Text style={styles.saveFormSub}>醒来情绪</Text>
            <View style={styles.moodRow}>
              {moodEmojis.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.moodDot, mood === i && styles.moodDotSel]}
                  onPress={() => setMood(i)}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="添加备注（选填）..."
              placeholderTextColor="#ccc"
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>保存记录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelSave}>
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Logs */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>最近记录</Text>
        </View>

        <View style={styles.logCard}>
          {sleepLogs.map((log, i) => (
            <View key={i} style={[styles.logEntry, i < sleepLogs.length - 1 && styles.logEntryBorder]}>
              <View style={styles.logLeft}>
                <View style={[styles.logDot, { backgroundColor: log.iconBg }]}>
                  <Text style={styles.logDotEmoji}>{log.icon}</Text>
                </View>
                <View>
                  <Text style={styles.logTime}>{log.time}</Text>
                  <Text style={styles.logTag}>{log.tag}</Text>
                </View>
              </View>
              <Text style={styles.logAgo}>{log.ago}</Text>
            </View>
          ))}
        </View>

        {/* Soothing Sounds */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>哄睡声音</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sootheStrip} contentContainerStyle={{ gap: 10 }}>
          {sootheSounds.map((sound, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.sootheItem, playing === i && styles.sootheItemActive]}
              onPress={() => setPlaying(i)}
            >
              <View style={styles.sootheIcon}>
                <Text style={styles.sootheEmoji}>{sound.icon}</Text>
              </View>
              <Text style={styles.sootheName}>{sound.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  savedBanner: {
    marginHorizontal: 20, marginTop: 10, backgroundColor: Colors.ok,
    borderRadius: 10, paddingVertical: 10, alignItems: 'center',
  },
  savedBannerText: { fontSize: 13, fontWeight: '600', color: Colors.okText },

  predictCard: {
    marginHorizontal: 20, marginTop: 10, marginBottom: 14,
    backgroundColor: Colors.white, borderRadius: 14, padding: 18,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  predictLabel: { fontSize: 12, color: Colors.subtext, marginBottom: 4 },
  predictTime: { fontSize: 26, fontWeight: '700', color: Colors.text },
  predictDetail: { fontSize: 12, color: '#888', marginTop: 6 },

  btnRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 14, gap: 10 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnPrimary: { backgroundColor: Colors.primary },
  btnPrimaryText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  btnSecondary: { backgroundColor: Colors.white, borderWidth: 1, borderColor: '#d8ddf0' },
  btnSecondaryText: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  timerCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  timerTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  timerClock: { fontSize: 38, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  timerActions: { width: '100%', gap: 8 },
  wakeBtn: {
    paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#f5f7fb',
    borderRadius: 10, alignItems: 'center',
  },
  wakeBtnText: { fontSize: 14, color: '#555', fontWeight: '500' },
  endBtn: {
    paddingVertical: 14, backgroundColor: '#e09860',
    borderRadius: 10, alignItems: 'center',
  },
  endBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white },

  // Save form
  saveFormCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  saveFormTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  saveFormClock: { fontSize: 32, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  saveFormDetail: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 16 },
  saveFormSub: { fontSize: 13, fontWeight: '500', color: '#888', textAlign: 'center', marginBottom: 8 },
  moodRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 14 },
  moodDot: {
    width: 44, height: 44, borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  moodDotSel: { borderColor: Colors.primary, backgroundColor: '#f5f7fb' },
  moodEmoji: { fontSize: 20 },
  notesInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 14, color: Colors.text,
    marginBottom: 14, backgroundColor: '#fafafa',
  },
  saveBtn: {
    paddingVertical: 14, backgroundColor: Colors.primary,
    borderRadius: 10, alignItems: 'center', marginBottom: 8,
  },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, color: Colors.subtext },

  // Log
  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },

  logCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  logEntry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  logEntryBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logDot: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logDotEmoji: { fontSize: 14 },
  logTime: { fontSize: 15, fontWeight: '600', color: Colors.text },
  logTag: { fontSize: 11, color: Colors.subtext },
  logAgo: { fontSize: 11, color: '#bbb' },

  // Soothing
  sootheStrip: { paddingHorizontal: 20, marginBottom: 20 },
  sootheItem: {
    width: 88, paddingVertical: 14, paddingHorizontal: 10,
    backgroundColor: Colors.white, borderRadius: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sootheItemActive: { shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  sootheIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  sootheEmoji: { fontSize: 16 },
  sootheName: { fontSize: 11, color: '#555', fontWeight: '500' },
});
