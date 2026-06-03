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

const history = [
  { date: '今天', color: '#e8d088', score: '85 分' },
  { date: '昨天', color: '#b89868', score: '78 分' },
  { date: '5/27', color: '#e8d088', score: '90 分' },
  { date: '5/26', color: '#a0b888', score: '65 分' },
];

export default function PoopToolScreen() {
  const [hasResult, setHasResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [remainingFree, setRemainingFree] = useState(8);

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

        {/* Free Remaining */}
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>剩余免费次数：{remainingFree} 次</Text>
        </View>

        {/* Result */}
        {hasResult && !isAnalyzing && (
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

        {/* Upgrade prompt */}
        {remainingFree <= 3 && remainingFree > 0 && (
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeText}>
              仅剩 {remainingFree} 次免费分析 · 开通睡眠会员无限次使用
            </Text>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>¥9.9/月 立即开通</Text>
            </TouchableOpacity>
          </View>
        )}

        {remainingFree <= 0 && (
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeText}>
              免费次数已用完 · 开通睡眠会员即可无限使用
            </Text>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>¥9.9/月 立即开通</Text>
            </TouchableOpacity>
          </View>
        )}

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

  freeBadge: {
    marginHorizontal: 20, marginBottom: 18,
    backgroundColor: Colors.primaryLight, borderRadius: 8,
    paddingVertical: 6, alignItems: 'center',
  },
  freeBadgeText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },

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

  upgradeCard: {
    marginHorizontal: 20, backgroundColor: '#fef9f0',
    borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#f0dcc0',
  },
  upgradeText: { fontSize: 12, color: '#6b4e30', marginBottom: 10, textAlign: 'center' },
  upgradeBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 24,
  },
  upgradeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
});
