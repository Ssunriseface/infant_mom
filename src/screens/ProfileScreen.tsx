import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function ProfileScreen({ navigation }: any) {
  const { isExpired, daysLeft, isSubscribed } = useSubscription();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>我的</Text>
        <TouchableOpacity
          style={styles.gearBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Subscription Card */}
        <View style={styles.memberCard}>
          <View style={styles.memberIconRow}>
            <Text style={styles.memberIcon}>🎖</Text>
            <Text style={styles.memberTitle}>贝养会员</Text>
          </View>

          {isSubscribed ? (
            <>
              <Text style={styles.memberStatus}>已订阅 · 会员有效</Text>
              <TouchableOpacity style={styles.memberBtn}>
                <Text style={styles.memberBtnText}>续费管理</Text>
              </TouchableOpacity>
            </>
          ) : !isExpired ? (
            <>
              <Text style={styles.memberStatus}>
                剩余 <Text style={styles.daysHighlight}>{daysLeft}</Text> 天免费试用
              </Text>
              {/* Progress bar */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((15 - daysLeft) / 15) * 100}%` },
                  ]}
                />
              </View>
              <TouchableOpacity style={styles.memberBtn}>
                <Text style={styles.memberBtnText}>立即开通 ¥49/月</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.memberStatusExpired}>试用已结束</Text>
              <TouchableOpacity style={styles.memberBtn}>
                <Text style={styles.memberBtnText}>开通会员 ¥49/月</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.memberDesc}>
            解锁全部 AI 智能工具 · 无限次使用 · 专业育儿分析
          </Text>
        </View>
      </ScrollView>
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
  title: { fontSize: 20, fontWeight: '700', color: Colors.text },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  memberCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.memberGoldLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  memberIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  memberIcon: { fontSize: 28 },
  memberTitle: { fontSize: 20, fontWeight: '700', color: Colors.memberGold },
  memberStatus: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberStatusExpired: {
    fontSize: 16,
    color: '#d47868',
    fontWeight: '600',
    marginBottom: 8,
  },
  daysHighlight: {
    color: Colors.memberGold,
    fontSize: 24,
    fontWeight: '700',
  },

  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.memberGold,
    borderRadius: 3,
  },

  memberBtn: {
    backgroundColor: Colors.memberGold,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  memberBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  memberDesc: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
});
