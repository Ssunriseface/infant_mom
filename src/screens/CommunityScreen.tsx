import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors } from '../theme/colors';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['推荐', 'AI 生成', '关注'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>育儿社区</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>🔍 搜索</Text>
          </TouchableOpacity>
        </View>

        {/* Community Tabs */}
        <View style={styles.commTabs}>
          {tabs.map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.commTab, activeTab === i && styles.commTabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.commTabText, activeTab === i && styles.commTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feed Items */}
        {feeds.map((item, i) => (
          <View key={i} style={styles.feedItem}>
            {/* Author */}
            <View style={styles.feedAuthor}>
              <View style={[styles.feedAvatar, item.isAI && { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.feedAvatarText, item.isAI && { color: Colors.primary }]}>
                  {item.isAI ? 'AI' : item.avatar}
                </Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.feedName}>{item.author}</Text>
                  {item.isAI && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>AI 生成</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.feedMeta}>{item.time} · {item.location}</Text>
              </View>
            </View>

            {/* Title & Body */}
            <Text style={styles.feedTitle}>{item.title}</Text>
            <Text style={styles.feedBody}>{item.body}</Text>

            {/* Tags */}
            <View style={styles.feedTags}>
              {item.tags.map((tag: string, j: number) => (
                <View key={j} style={styles.feedTag}>
                  <Text style={styles.feedTagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.feedActions}>
              <Text style={styles.actionText}>♥ {item.likes}</Text>
              <Text style={styles.actionText}>💬 {item.comments}</Text>
              <Text style={styles.actionText}>☆ 收藏</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const feeds = [
  {
    author: '果果妈妈',
    avatar: '果',
    time: '2 小时前',
    location: '北京',
    title: '6 个月宝宝辅食添加一周食谱分享',
    body: '从单一到混合，从稀到稠，果果这一周吃得很顺利。周一南瓜泥 → 周二胡萝卜泥 → 周三开始加蛋黄，每个宝宝节奏不同，不着急。',
    tags: ['辅食攻略', '6 月龄'],
    likes: '328',
    comments: '56',
    isAI: false,
  },
  {
    author: '贝养 AI 助手',
    time: '4 小时前',
    location: '',
    title: '宝宝夜醒频繁？可能是这 5 个原因',
    body: '很多妈妈都在问夜醒问题。AI 整理了最新育儿研究：1. 出牙期不适（4-10 个月高发）2. 大运动发育期睡眠倒退 3. 分离焦虑 4. 室温 / 湿度不适宜 5. 白天小觉不足导致过度疲劳。你家宝宝中了几条？',
    tags: ['睡眠问题', 'AI 科普', '夜醒'],
    likes: '892',
    comments: '134',
    isAI: true,
  },
  {
    author: '豆豆妈妈',
    avatar: '豆',
    time: '6 小时前',
    location: '上海',
    title: '便便分析这个功能真的实用',
    body: '豆豆昨天拉了绿色便便吓死我了，用贝养分析了一下，AI 判断是消化不良，建议暂停新辅食观察。今天果然恢复正常了，比百度查靠谱太多了。',
    tags: ['用户体验', '便便分析'],
    likes: '556',
    comments: '89',
    isAI: false,
  },
  {
    author: '贝养 AI 助手',
    time: '昨天',
    location: '',
    title: '本周育儿热点 · 夏季宝宝防晒全攻略',
    body: '6 个月以上宝宝可以使用物理防晒霜（氧化锌 / 二氧化钛）。但美国儿科学会建议：6 个月以下婴儿避免直接日晒，以物理遮挡为主。你家宝宝的防晒做对了吗？',
    tags: ['夏季护理', 'AI 科普', '防晒'],
    likes: '1201',
    comments: '203',
    isAI: true,
  },
];

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
  searchBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  searchBtnText: { fontSize: 12, color: '#555', fontWeight: '500' },

  commTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  commTab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  commTabActive: { backgroundColor: '#f5f7fb' },
  commTabText: { fontSize: 13, fontWeight: '500', color: Colors.subtext },
  commTabTextActive: { color: Colors.primary },

  feedItem: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  feedAuthor: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8ecf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedAvatarText: { fontSize: 16, color: Colors.primary },
  feedName: { fontSize: 13, fontWeight: '600', color: Colors.text },
  feedMeta: { fontSize: 10, color: '#bbb' },
  aiBadge: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  aiBadgeText: { fontSize: 10, color: Colors.primary },

  feedTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  feedBody: { fontSize: 13, color: '#555', lineHeight: 23, marginBottom: 10 },

  feedTags: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  feedTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f5f7fb',
  },
  feedTagText: { fontSize: 10, fontWeight: '500', color: '#777' },

  feedActions: { flexDirection: 'row', gap: 24 },
  actionText: { fontSize: 12, color: '#bbb' },
});
