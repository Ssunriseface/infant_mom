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
import { useSubscription } from '../contexts/SubscriptionContext';

const sootheSounds = [
  { icon: '🌧', name: '雨声' },
  { icon: '🌊', name: '海浪' },
  { icon: '💨', name: '白噪音' },
  { icon: '💓', name: '心跳' },
  { icon: '🎵', name: '摇篮曲' },
];

const sleepLogs = [
  { date: '昨晚 6月2日', sleep: '20:35', wake: '06:15', duration: '9h 40m', wakes: '夜醒 2 次', quality: '良好' },
  { date: '前天 6月1日', sleep: '21:00', wake: '05:50', duration: '8h 50m', wakes: '夜醒 3 次', quality: '一般' },
  { date: '5月31日', sleep: '20:10', wake: '06:30', duration: '10h 20m', wakes: '夜醒 1 次', quality: '优秀' },
];

const moodEmojis = ['😊', '😐', '😢'];

export default function SleepToolScreen() {
  const { isExpired } = useSubscription();
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

        {sleepLogs.map((log, i) => (
          <View key={i} style={styles.logCard}>
            <View style={styles.logHeader}>
              <Text style={styles.logDate}>🌙 {log.date}</Text>
              <View style={styles.logQuality}>
                <Text style={styles.logQualityText}>{log.quality}</Text>
              </View>
            </View>
            <View style={styles.logTimeline}>
              <View style={styles.logPoint}>
                <Text style={styles.logPointLabel}>入睡</Text>
                <Text style={styles.logPointTime}>{log.sleep}</Text>
              </View>
              <View style={styles.logLine}>
                <Text style={styles.logDuration}>{log.duration}</Text>
              </View>
              <View style={styles.logPoint}>
                <Text style={styles.logPointLabel}>醒来</Text>
                <Text style={styles.logPointTime}>{log.wake}</Text>
              </View>
            </View>
            <Text style={styles.logWakes}>{log.wakes}</Text>
          </View>
        ))}

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
    marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.white,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logDate: { fontSize: 13, fontWeight: '600', color: Colors.text },
  logQuality: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  logQualityText: { fontSize: 11, fontWeight: '500', color: Colors.primary },
  logTimeline: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 4, marginBottom: 8,
  },
  logPoint: { flex: 1 },
  logPointLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  logPointTime: { fontSize: 20, fontWeight: '700', color: Colors.text },
  logLine: {
    flex: 2, alignItems: 'center', paddingTop: 14,
  },
  logDuration: { fontSize: 12, color: '#888', fontWeight: '500' },
  logWakes: { fontSize: 12, color: '#999' },

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

  paywallOverlay: { marginHorizontal: 20, marginBottom: 14, position: 'relative' },
  paywallBlurred: { opacity: 0.25, overflow: 'hidden', borderRadius: 14 },
  paywallContent: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14,
  },
  paywallIcon: { fontSize: 30, marginBottom: 8 },
  paywallText: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  paywallSub: { fontSize: 13, color: Colors.subtext, textAlign: 'center' },
});
