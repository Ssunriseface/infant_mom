import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import VaccineSchedule from '../components/VaccineSchedule';
import AiAnalysisModal from '../components/AiAnalysisModal';
import GrowthChart from '../components/GrowthChart';
import StatsSummary from '../components/StatsSummary';

const babies = ['小宝 · 6 个月', '姐姐 · 3 岁'];

export default function RecordsScreen() {
  const [activeBaby, setActiveBaby] = useState(0);
  const [vaccineOpen, setVaccineOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analysisVisible, setAnalysisVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>成长档案</Text>
          <TouchableOpacity style={styles.addBabyBtn}>
            <Text style={styles.addBabyBtnText}>＋ 添加宝宝</Text>
          </TouchableOpacity>
        </View>

        {/* Baby Chips */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.babyList} contentContainerStyle={{ gap: 8 }}
        >
          {babies.map((name, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.babyChip, activeBaby === i && styles.babyChipActive]}
              onPress={() => setActiveBaby(i)}
            >
              <Text style={[styles.babyChipText, activeBaby === i && styles.babyChipTextActive]}>
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Growth Chart */}
        <GrowthChart />

        {/* Vaccine Reminder Card — tappable to expand schedule */}
        <TouchableOpacity
          style={styles.vaccineReminder}
          onPress={() => setVaccineOpen(!vaccineOpen)}
          activeOpacity={0.7}
        >
          <Text style={styles.reminderIcon}>🔔</Text>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>下一次接种提醒</Text>
            <Text style={styles.reminderVaccine}>乙肝③ + A群流脑①</Text>
            <Text style={styles.reminderMeta}>建议月龄: 6 月 · 本周可接种</Text>
          </View>
          <Text style={styles.toggleArrow}>{vaccineOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {vaccineOpen && <VaccineSchedule />}

        <View style={{ height: 14 }} />

        {/* Weekly Stats */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>趋势统计</Text>
        </View>
        <StatsSummary
          onCardPress={(data) => {
            setAnalysisData(data);
            setAnalysisVisible(true);
          }}
        />

        <View style={{ height: 20 }} />
      </ScrollView>

      <AiAnalysisModal
        visible={analysisVisible}
        data={analysisData}
        onClose={() => setAnalysisVisible(false)}
      />
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
  addBabyBtn: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  addBabyBtnText: { fontSize: 12, color: '#555', fontWeight: '500' },

  babyList: { marginHorizontal: 20, marginBottom: 16 },
  babyChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  babyChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  babyChipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  babyChipTextActive: { color: Colors.white },

  vaccineReminder: {
    marginHorizontal: 20, marginBottom: 18,
    backgroundColor: '#fef9f0', borderRadius: 14,
    borderWidth: 1, borderColor: '#f0dcc0',
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  reminderIcon: { fontSize: 36 },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 12, color: '#b89830', fontWeight: '500' },
  reminderVaccine: { fontSize: 18, fontWeight: '700', color: Colors.text, marginVertical: 4 },
  reminderMeta: { fontSize: 12, color: '#888' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },
  toggleArrow: { fontSize: 12, color: '#b89830' },
});
