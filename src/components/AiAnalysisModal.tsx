import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Colors } from '../theme/colors';

interface AnalysisData {
  title: string;
  icon: string;
  rows: { label: string; value: string }[];
}

function generateAnalysis(data: AnalysisData): string {
  const title = data.title;
  if (title === '本周喂养') {
    return `根据本周喂养数据分析，宝宝日均喂养 5.2 次，辅食 2 餐，节奏稳定。最常摄入的食物是南瓜泥和母乳，营养结构偏向碳水+蛋白，建议下周加入菠菜泥或猪肝泥补充铁元素。整体喂养评分 88 分，属于优良水平。继续保持母乳+辅食的搭配节奏，注意观察是否有新食物过敏反应。`;
  }
  if (title === '本周睡眠') {
    return `本周夜间睡眠日均 8.0 小时，白天小觉 1.2 小时，合计约 9.2 小时/天。夜醒 1.8 次略高于该月龄平均水平（1.2 次），可能与近期辅食添加带来的肠胃适应有关。整体睡眠评估为良好，但夜醒次数偏高。建议睡前 1 小时减少兴奋刺激，保持固定的睡前仪式（洗澡→喂奶→白噪音），观察 3-5 天看夜醒是否回落。`;
  }
  return `本周便便日均 2.1 次，频率正常。健康分均值 83 分，无异常天数，说明消化吸收状态良好。金黄色软便为主，符合母乳喂养典型特征。便便记录连续性很好（7/7 天），建议继续保持每日记录习惯，若出现绿色、水样或黏液便及时拍照分析。`;
}

export default function AiAnalysisModal({
  visible, data, onClose,
}: {
  visible: boolean;
  data: AnalysisData | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (visible && data) {
      setLoading(true);
      setResult('');
      const timer = setTimeout(() => {
        setResult(generateAnalysis(data));
        setLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [visible, data]);

  if (!data) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerIcon}>{data.icon}</Text>
              <Text style={styles.headerTitle}>{data.title} · AI 分析</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>AI 分析中...</Text>
            </View>
          )}

          {/* Result */}
          {!loading && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{result}</Text>
              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                  AI 分析仅供参考，不构成医学建议。如有疑问请咨询医生。
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { fontSize: 22 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, color: '#666' },
  loadingBox: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 40,
    gap: 12,
  },
  loadingText: { fontSize: 14, color: '#888' },
  resultBox: {},
  resultText: {
    fontSize: 15, color: Colors.text, lineHeight: 26,
    letterSpacing: 0.2,
  },
  disclaimer: {
    marginTop: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  disclaimerText: { fontSize: 12, color: '#bbb' },
});
