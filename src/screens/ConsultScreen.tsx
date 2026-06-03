import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';

const quickQuestions = [
  '宝宝不肯吃辅食怎么办',
  '夜醒频繁是什么原因',
  '宝宝便秘怎么办',
  '出牙期怎么护理',
  '母乳不够怎么办',
  '辅食过敏怎么判断',
];

export default function ConsultScreen() {
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAskAI = () => {
    if (!question.trim()) {
      Alert.alert('提示', '请先输入或选择您的问题');
      return;
    }
    // In production: call DeepSeek API
    setAiAnswer('根据您的问题，AI 正在生成建议...\n\n(实际产品中调用 DeepSeek API 实时生成个性化育儿建议)');
    setShowAnswer(true);
  };

  const handleCallNanny = () => {
    Alert.alert(
      '呼叫月嫂',
      '即将接通专业月嫂视频通话\n\n单次费用：¥19.9\n资深月嫂在线解答您的育儿问题',
      [
        { text: '取消', style: 'cancel' },
        { text: '立即接通', onPress: () => Alert.alert('提示', '正在为您连接月嫂...') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>在线咨询</Text>
          <Text style={styles.headerSub}>AI 免费问答 · 真人月嫂即时视频</Text>
        </View>

        {/* Input Area */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="描述您遇到的育儿问题..."
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={4}
            value={question}
            onChangeText={setQuestion}
            textAlignVertical="top"
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.aiBtn} onPress={handleAskAI}>
              <Text style={styles.aiBtnText}>🤖 AI 免费问答</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nannyBtn} onPress={handleCallNanny}>
              <Text style={styles.nannyBtnText}>👩‍🍼 连线月嫂 ¥19.9</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Questions */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>常见问题 · 点击快速提问</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickQuestions.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickChip}
              onPress={() => {
                setQuestion(q);
                setShowAnswer(false);
              }}
            >
              <Text style={styles.quickChipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Answer */}
        {showAnswer && (
          <View style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <Text style={styles.answerIcon}>🤖</Text>
              <Text style={styles.answerTitle}>AI 回答</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>免费</Text>
              </View>
            </View>
            <Text style={styles.answerBody}>{aiAnswer}</Text>
            <View style={styles.answerFooter}>
              <Text style={styles.answerHint}>
                AI 回答仅供参考，如需更准确的判断，可连线真人月嫂
              </Text>
              <TouchableOpacity style={styles.upgradeBtn} onPress={handleCallNanny}>
                <Text style={styles.upgradeBtnText}>连线月嫂 ¥19.9</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Nanny Intro Card */}
        <View style={styles.nannyIntroCard}>
          <Text style={styles.nannyIntroTitle}>👩‍🍼 我们的月嫂</Text>
          <View style={styles.nannyFeatures}>
            <View style={styles.nannyFeature}>
              <Text style={styles.nannyFeatureIcon}>✅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.nannyFeatureTitle}>持证上岗</Text>
                <Text style={styles.nannyFeatureDesc}>高级母婴护理证 + 3年以上实操经验</Text>
              </View>
            </View>
            <View style={styles.nannyFeature}>
              <Text style={styles.nannyFeatureIcon}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.nannyFeatureTitle}>即时接通</Text>
                <Text style={styles.nannyFeatureDesc}>7×24 小时在线，视频面对面判断</Text>
              </View>
            </View>
            <View style={styles.nannyFeature}>
              <Text style={styles.nannyFeatureIcon}>💰</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.nannyFeatureTitle}>¥19.9/次</Text>
                <Text style={styles.nannyFeatureDesc}>比上门月嫂便宜 95%，按次付费无负担</Text>
              </View>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  appName: { fontSize: 20, fontWeight: '700', color: Colors.text },
  headerSub: { fontSize: 12, color: Colors.subtext, marginTop: 4 },

  inputCard: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 18,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    backgroundColor: '#fafafa',
  },
  inputActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  aiBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    alignItems: 'center',
  },
  aiBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  nannyBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fef9f0',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0dcc0',
  },
  nannyBtnText: { fontSize: 13, fontWeight: '600', color: '#6b4e30' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 18,
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipText: { fontSize: 12, color: '#555', fontWeight: '500' },

  answerCard: {
    marginHorizontal: 20,
    marginBottom: 18,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  answerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  answerIcon: { fontSize: 18 },
  answerTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  aiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: Colors.ok,
  },
  aiBadgeText: { fontSize: 10, fontWeight: '500', color: Colors.okText },
  answerBody: { fontSize: 13, color: '#555', lineHeight: 23, marginBottom: 14 },
  answerFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
    gap: 8,
  },
  answerHint: { fontSize: 11, color: '#bbb', textAlign: 'center' },
  upgradeBtn: {
    paddingVertical: 10,
    backgroundColor: '#fef9f0',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0dcc0',
  },
  upgradeBtnText: { fontSize: 13, fontWeight: '600', color: '#6b4e30' },

  nannyIntroCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  nannyIntroTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 14 },
  nannyFeatures: { gap: 12 },
  nannyFeature: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  nannyFeatureIcon: { fontSize: 16, marginTop: 1 },
  nannyFeatureTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  nannyFeatureDesc: { fontSize: 11, color: Colors.subtext, marginTop: 2 },
});
