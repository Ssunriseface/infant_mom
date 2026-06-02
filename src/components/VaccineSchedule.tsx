import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface VaccineItem {
  month: string;
  name: string;
  status: 'done' | 'due' | 'upcoming';
}

const vaccineData: VaccineItem[] = [
  { month: '出生', name: '乙肝① + 卡介苗', status: 'done' },
  { month: '1月', name: '乙肝②', status: 'done' },
  { month: '2月', name: '脊灰①', status: 'done' },
  { month: '3月', name: '脊灰② + 百白破①', status: 'done' },
  { month: '4月', name: '脊灰③ + 百白破②', status: 'done' },
  { month: '5月', name: '百白破③', status: 'done' },
  { month: '6月', name: '乙肝③ + A群流脑①', status: 'due' },
  { month: '7月', name: '空档期', status: 'upcoming' },
  { month: '8月', name: '麻腮风① + 乙脑①', status: 'upcoming' },
  { month: '9月', name: 'A群流脑②', status: 'upcoming' },
  { month: '12月', name: '基础免疫完成', status: 'upcoming' },
  { month: '18月', name: '百白破④ + 麻腮风② + 甲肝①', status: 'upcoming' },
  { month: '2岁', name: '乙脑② + 甲肝②', status: 'upcoming' },
  { month: '3岁', name: 'A+C群流脑①', status: 'upcoming' },
  { month: '6岁', name: 'A+C群流脑② + 白破', status: 'upcoming' },
];

export default function VaccineSchedule() {
  return (
    <View style={styles.container}>
      {vaccineData.map((item, i) => {
        const isDone = item.status === 'done';
        const isDue = item.status === 'due';
        const isUpcoming = item.status === 'upcoming';

        return (
          <View key={i} style={styles.row}>
            <View style={styles.timeline}>
              <View style={[
                styles.dot,
                isDone && styles.dotDone,
                isDue && styles.dotDue,
                isUpcoming && styles.dotUpcoming,
              ]} />
              {i < vaccineData.length - 1 && (
                <View style={[
                  styles.line,
                  isDone && vaccineData[i + 1].status === 'done' && styles.lineDone,
                ]} />
              )}
            </View>

            <View style={[styles.content, i < vaccineData.length - 1 && styles.contentSpacing]}>
              <Text style={styles.month}>{item.month}</Text>
              <Text style={[
                styles.name,
                isDone && styles.nameDone,
                isDue && styles.nameDue,
              ]}>{item.name}</Text>
              {isDone && <Text style={styles.statusDone}>✓ 已完成</Text>}
              {isDue && <Text style={styles.statusDue}>🔔 应接种</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 20, paddingRight: 12 },

  row: { flexDirection: 'row' },

  timeline: { width: 32, alignItems: 'center' },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#ddd',
  },
  dotDone: { backgroundColor: Colors.okText },
  dotDue: { backgroundColor: '#e09860' },
  dotUpcoming: { backgroundColor: '#ddd' },
  line: {
    width: 2, flex: 1, minHeight: 20, backgroundColor: '#e0e0e0',
  },
  lineDone: { backgroundColor: Colors.okText },

  content: { flex: 1, marginLeft: 10 },
  contentSpacing: { marginBottom: 16 },
  month: { fontSize: 12, color: '#888', fontWeight: '600' },
  name: { fontSize: 14, color: Colors.text, marginTop: 2 },
  nameDone: { color: '#999' },
  nameDue: { color: Colors.text, fontWeight: '600' },

  statusDone: { fontSize: 11, color: Colors.okText, marginTop: 2 },
  statusDue: { fontSize: 11, color: '#e09860', fontWeight: '500', marginTop: 2 },
});
