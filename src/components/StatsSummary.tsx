import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

const stats = [
  {
    title: '本周喂养',
    icon: '🍼',
    color: Colors.feeding,
    rows: [
      { label: '日均喂养次数', value: '5.2 次' },
      { label: '日均辅食餐数', value: '2 餐' },
      { label: '最常食物', value: '南瓜泥 · 母乳' },
    ],
  },
  {
    title: '本周睡眠',
    icon: '😴',
    color: Colors.sleep,
    rows: [
      { label: '日均夜间睡眠', value: '8.0h' },
      { label: '日均白天小觉', value: '1.2h' },
      { label: '日均夜醒次数', value: '1.8 次' },
    ],
  },
  {
    title: '本周便便',
    icon: '💩',
    color: Colors.poop,
    rows: [
      { label: '日均次数', value: '2.1 次' },
      { label: '健康分均值', value: '83 分' },
      { label: '异常天数', value: '0 天' },
    ],
  },
];

export default function StatsSummary({ onCardPress }: {
  onCardPress?: (data: typeof stats[number]) => void;
}) {
  return (
    <View>
      {stats.map((section, i) => (
        <TouchableOpacity
          key={i} style={styles.card} activeOpacity={0.7}
          onPress={() => onCardPress?.(section)}
        >
          <View style={styles.header}>
            <View style={[styles.iconBg, { backgroundColor: section.color }]}>
              <Text style={styles.icon}>{section.icon}</Text>
            </View>
            <Text style={styles.title}>{section.title}</Text>
          </View>
          <View style={styles.divider} />
          {section.rows.map((row, j) => (
            <View key={j} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  iconBg: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 14 },
  title: { fontSize: 14, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.divider, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 13, color: '#888' },
  value: { fontSize: 13, fontWeight: '600', color: Colors.text },
});
