import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface DataPoint { month: string; height: number; weight: number; }

const data: DataPoint[] = [
  { month: '出生', height: 50, weight: 3.3 },
  { month: '1月',  height: 54, weight: 4.2 },
  { month: '2月',  height: 58, weight: 5.1 },
  { month: '3月',  height: 61, weight: 5.9 },
  { month: '4月',  height: 64, weight: 6.5 },
  { month: '5月',  height: 66, weight: 7.1 },
  { month: '6月',  height: 68, weight: 7.8 },
];

const maxH = 72;
const minH = 48;
const maxW = 8.5;
const minW = 3.0;

export default function GrowthChart() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>生长曲线</Text>

      <View style={styles.chart}>
        <View style={styles.barGroup}>
          {data.map((d, i) => {
            const hPct = ((d.height - minH) / (maxH - minH)) * 100;
            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: `${hPct}%`, backgroundColor: Colors.primary }]} />
                <Text style={styles.barVal}>{d.height}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.dotGroup}>
          {data.map((d, i) => {
            const wPct = ((d.weight - minW) / (maxW - minW)) * 100;
            return (
              <View key={i} style={styles.dotCol}>
                <View style={[styles.weightDot, { bottom: `${wPct}%` }]} />
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>身高 (cm)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#e09860' }]} />
          <Text style={styles.legendText}>体重 (kg)</Text>
        </View>
      </View>

      <View style={styles.xLabels}>
        {data.map((d, i) => (
          <Text key={i} style={styles.xLabel}>{d.month}</Text>
        ))}
      </View>

      <Text style={styles.latest}>当前: 68cm / 7.8kg · P50 中等水平</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, marginBottom: 18, backgroundColor: Colors.white,
    borderRadius: 14, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  title: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 16 },
  chart: { height: 140, flexDirection: 'row', marginBottom: 8 },

  barGroup: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 4 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 4 },
  barVal: { fontSize: 9, color: Colors.primary, marginTop: 2 },

  dotGroup: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' },
  dotCol: { flex: 1, alignItems: 'center', height: '100%' },
  weightDot: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#e09860',
  },

  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColor: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, color: '#888' },

  xLabels: { flexDirection: 'row' },
  xLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: '#bbb' },

  latest: { marginTop: 10, fontSize: 12, color: '#888', textAlign: 'center', fontWeight: '500' },
});
