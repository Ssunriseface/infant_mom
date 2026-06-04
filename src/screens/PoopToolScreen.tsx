import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useRecords } from '../contexts/RecordContext';

const history = [
  { date: '今天', color: '#e8d088', score: '85 分' },
  { date: '昨天', color: '#b89868', score: '78 分' },
  { date: '5/27', color: '#e8d088', score: '90 分' },
  { date: '5/26', color: '#a0b888', score: '65 分' },
];

export default function PoopToolScreen() {
  const { isExpired } = useSubscription();
  const { addPoop } = useRecords();
  const [hasResult, setHasResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setHasResult(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };

  const handleCallNanny = () => {
    Alert.alert(
      '呼叫月嫂',
      '即将接通专业月嫂视频通话\n\n单次费用：¥19.9\n月嫂帮您判断便便是否正常',
      [
        { text: '取消', style: 'cancel' },
        { text: '立即接通', onPress: () => Alert.alert('提示', '正在为您连接月嫂...') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Upload Area */}
        <TouchableOpacity
          style={[styles.uploadArea, isAnalyzing && styles.uploadAreaAnalyzing]}
          onPress={handleAnalyze}
          activeOpacity={0.7}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={[styles.uploadText, { marginTop: 14 }]}>AI 正在分析中...</Text>
              <Text style={styles.uploadHint}>请稍候，正在识别便便颜色与性状</Text>
            </>
          ) : (
            <>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>拍照或从相册选择</Text>
              <Text style={styles.uploadHint}>也可以手动描述颜色和性状</Text>
            </>
          )}
        </TouchableOpacity>

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

              <TouchableOpacity
                style={styles.saveRecordBtn}
                onPress={() => {
                  addPoop({
                    time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
                    color: '#e8d088',
                    colorName: '金黄',
                    texture: '软',
                    note: 'AI 分析',
                  });
                }}
              >
                <Text style={styles.saveRecordBtnText}>保存到记录</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.nannyLink} onPress={handleCallNanny}>
                <Text style={styles.nannyLinkText}>不准？连线月嫂帮你看</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {/* History */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>历史记录</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.historyStrip}
          contentContainerStyle={{ gap: 8 }}
        >
          {history.map((item, i) => (
            <View key={i} style={styles.historyItem}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <View style={[styles.historyColor, { backgroundColor: item.color }]} />
              <Text style={styles.historyScore}>{item.score}</Text>
            </View>
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

  uploadArea: {
    marginHorizontal: 20, marginTop: 10, marginBottom: 10,
    height: 170, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: '#d0d0d0', borderStyle: 'dashed',
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  uploadAreaAnalyzing: { borderColor: Colors.primary, backgroundColor: '#fcfdfe' },
  uploadIcon: { fontSize: 36, marginBottom: 8, opacity: 0.6 },
  uploadText: { fontSize: 14, color: '#888', fontWeight: '500' },
  uploadHint: { fontSize: 11, color: '#bbb', marginTop: 4 },

  resultCard: {
    marginHorizontal: 20, marginBottom: 18, backgroundColor: Colors.white,
    borderRadius: 14, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  scoreCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.ok, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  scoreNum: { fontSize: 32, fontWeight: '700', color: Colors.okText },
  scoreLabel: { fontSize: 11, color: Colors.okText },
  resultDetail: { fontSize: 13, color: '#555', marginBottom: 4 },
  resultOk: { color: Colors.okText },
  resultSub: { fontSize: 13, color: '#999', textAlign: 'center' },

  nannyLink: {
    marginTop: 14, paddingVertical: 10, backgroundColor: '#fef9f0',
    borderRadius: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#f0dcc0',
    paddingHorizontal: 24,
  },
  nannyLinkText: { fontSize: 13, fontWeight: '600', color: '#6b4e30' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },

  historyStrip: { paddingHorizontal: 20, marginBottom: 20 },
  historyItem: {
    width: 72, paddingVertical: 12, paddingHorizontal: 8,
    backgroundColor: Colors.white, borderRadius: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  historyDate: { fontSize: 10, color: '#bbb' },
  historyColor: { width: 28, height: 28, borderRadius: 14, marginVertical: 6 },
  historyScore: { fontSize: 13, fontWeight: '600', color: Colors.text },

  paywallOverlay: { marginHorizontal: 20, marginBottom: 18, position: 'relative' },
  paywallBlurred: { opacity: 0.25, overflow: 'hidden', borderRadius: 14 },
  paywallContent: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14,
  },
  paywallIcon: { fontSize: 36, marginBottom: 10 },
  paywallText: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  paywallSub: { fontSize: 13, color: Colors.subtext, textAlign: 'center' },

  saveRecordBtn: {
    marginTop: 12, paddingVertical: 10, backgroundColor: Colors.ok,
    borderRadius: 10, alignItems: 'center',
    paddingHorizontal: 24,
  },
  saveRecordBtnText: { fontSize: 13, fontWeight: '600', color: Colors.okText },

  fakeNannyLink: {
    marginTop: 14, paddingVertical: 10, backgroundColor: '#fef9f0',
    borderRadius: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#f0dcc0', paddingHorizontal: 24,
  },
});
