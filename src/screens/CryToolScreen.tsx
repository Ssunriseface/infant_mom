import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';

export default function CryToolScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Cleanup animation on unmount
  useEffect(() => {
    return () => { pulseAnim.setValue(1); };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 750, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
      ])
    ).start();
    // Auto-stop after 15 seconds
    setTimeout(() => { if (isRecording) stopRecording(); }, 15000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    setHasResult(false);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isAnalyzing) {
      startRecording();
    }
  };

  const handleCallNanny = () => {
    Alert.alert(
      '呼叫月嫂',
      '即将接通专业月嫂视频通话\n\n单次费用：¥19.9\n月嫂为您判断宝宝哭声原因',
      [
        { text: '取消', style: 'cancel' },
        { text: '立即接通', onPress: () => Alert.alert('提示', '正在为您连接月嫂...\n\n(实际产品中接入声网/腾讯TRTC视频通话)') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recording Area */}
        <View style={styles.cryMain}>
          <Animated.View
            style={[
              styles.cryCircle,
              isRecording && styles.cryCircleRecording,
              isAnalyzing && styles.cryCircleAnalyzing,
              { transform: [{ scale: isRecording ? pulseAnim : isAnalyzing ? 1 : 1 }] },
            ]}
          >
            {isAnalyzing ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text style={styles.cryIcon}>🎤</Text>
            )}
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.cryBtn,
              isRecording && styles.cryBtnRecording,
              isAnalyzing && styles.cryBtnDisabled,
            ]}
            onPress={toggleRecording}
            disabled={isAnalyzing}
          >
            <Text style={styles.cryBtnText}>
              {isAnalyzing ? 'AI 分析中...' : isRecording ? '录音中... 点击停止' : '按住录音分析'}
            </Text>
          </TouchableOpacity>

          {isAnalyzing && (
            <Text style={styles.analyzingHint}>正在分析哭声特征，请稍候...</Text>
          )}
          {!isRecording && !isAnalyzing && (
            <Text style={styles.cryHint}>将手机靠近宝宝，录制 10–30 秒哭声</Text>
          )}
        </View>

        {/* Analysis Result */}
        {hasResult && !isAnalyzing && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>分析结果</Text>

            <View style={styles.barContainer}>
              <ResultBar label="饥饿" pct={45} color={Colors.feedingText} />
              <ResultBar label="困了 / 疲劳" pct={30} color={Colors.sleepText} />
              <ResultBar label="尿布不适" pct={15} color={Colors.poopText} />
              <ResultBar label="其他" pct={10} color="#bbb" />
            </View>

            <View style={styles.conclusionRow}>
              <View style={styles.conclusionDot} />
              <Text style={styles.conclusionText}>
                AI 判断：宝宝最可能是饿了，建议先尝试喂奶。注意观察是否伴有其他不适表现。
              </Text>
            </View>

            <TouchableOpacity style={styles.nannyBtn} onPress={handleCallNanny}>
              <View style={styles.nannyBtnInner}>
                <Text style={styles.nannyIcon}>👩‍🍼</Text>
                <View style={styles.nannyInfo}>
                  <Text style={styles.nannyTitle}>不准？连线真人月嫂判断</Text>
                  <Text style={styles.nannySub}>专业月嫂即时视频 · ¥19.9/次</Text>
                </View>
                <Text style={styles.nannyArrow}>▶</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              * AI 分析仅供参考，不可替代专业医疗诊断{'\n'}如宝宝持续哭闹，请及时就医
            </Text>
          </View>
        )}

        {/* Empty state */}
        {!hasResult && !isAnalyzing && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👶</Text>
            <Text style={styles.emptyText}>点击上方按钮开始录音{'\n'}AI 将分析宝宝哭声背后的原因</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function ResultBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barPct}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  cryMain: { marginHorizontal: 20, marginTop: 10, marginBottom: 20, alignItems: 'center' },
  cryCircle: {
    width: 130, height: 130, borderRadius: 16,
    backgroundColor: '#f5f7fb', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  cryCircleRecording: { backgroundColor: Colors.primaryLight },
  cryCircleAnalyzing: { backgroundColor: '#fef9f0' },
  cryIcon: { fontSize: 48 },

  cryBtn: {
    width: 170, paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: 24, backgroundColor: Colors.primary, alignItems: 'center', marginBottom: 8,
  },
  cryBtnRecording: { backgroundColor: Colors.cryText },
  cryBtnDisabled: { backgroundColor: '#bbb' },
  cryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },

  cryHint: { fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 8 },
  analyzingHint: { fontSize: 12, color: '#b89830', textAlign: 'center', marginTop: 8, fontWeight: '500' },

  // Result
  resultCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  resultTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 14 },

  barContainer: { gap: 8, marginBottom: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 80, fontSize: 11, color: '#555', textAlign: 'right' },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#f0f0f0', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barPct: { width: 36, fontSize: 13, fontWeight: '600', color: Colors.text },

  conclusionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 6 },
  conclusionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6 },
  conclusionText: { fontSize: 12, color: Colors.subtext, flex: 1, lineHeight: 20 },

  nannyBtn: {
    backgroundColor: '#fef9f0', borderRadius: 12,
    borderWidth: 1, borderColor: '#f0dcc0', padding: 14, marginBottom: 12,
  },
  nannyBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nannyIcon: { fontSize: 28 },
  nannyInfo: { flex: 1 },
  nannyTitle: { fontSize: 14, fontWeight: '600', color: '#6b4e30' },
  nannySub: { fontSize: 12, color: '#b89830', marginTop: 2 },
  nannyArrow: { fontSize: 14, color: '#b89830' },

  disclaimer: { fontSize: 10, color: '#bbb', textAlign: 'center', lineHeight: 16 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyText: { fontSize: 14, color: '#bbb', textAlign: 'center', lineHeight: 22 },
});
