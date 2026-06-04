import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FeedingRecord {
  id: string;
  time: string;
  type: '母乳' | '配方奶' | '辅食';
  food: string;
  amount?: string;
  note?: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  duration: string;
  wakes: number;
  note?: string;
}

export interface PoopRecord {
  id: string;
  time: string;
  color: string;
  colorName: string;
  texture: '软' | '稀' | '硬';
  note?: string;
}

interface RecordState {
  feedingRecords: FeedingRecord[];
  sleepRecords: SleepRecord[];
  poopRecords: PoopRecord[];
  addFeeding: (r: Omit<FeedingRecord, 'id'>) => void;
  addSleep: (r: Omit<SleepRecord, 'id'>) => void;
  addPoop: (r: Omit<PoopRecord, 'id'>) => void;
}

const RecordContext = createContext<RecordState>({
  feedingRecords: [],
  sleepRecords: [],
  poopRecords: [],
  addFeeding: () => {},
  addSleep: () => {},
  addPoop: () => {},
});

async function load<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function save<T>(key: string, data: T[]) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function RecordProvider({ children }: { children: ReactNode }) {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [poopRecords, setPoopRecords] = useState<PoopRecord[]>([]);

  useEffect(() => {
    (async () => {
      setFeedingRecords(await load<FeedingRecord>('feedingRecords'));
      setSleepRecords(await load<SleepRecord>('sleepRecords'));
      setPoopRecords(await load<PoopRecord>('poopRecords'));
    })();
  }, []);

  const addFeeding = useCallback((r: Omit<FeedingRecord, 'id'>) => {
    const record: FeedingRecord = { ...r, id: Date.now().toString() };
    setFeedingRecords((prev) => {
      const next = [record, ...prev];
      save('feedingRecords', next);
      return next;
    });
  }, []);

  const addSleep = useCallback((r: Omit<SleepRecord, 'id'>) => {
    const record: SleepRecord = { ...r, id: Date.now().toString() };
    setSleepRecords((prev) => {
      const next = [record, ...prev];
      save('sleepRecords', next);
      return next;
    });
  }, []);

  const addPoop = useCallback((r: Omit<PoopRecord, 'id'>) => {
    const record: PoopRecord = { ...r, id: Date.now().toString() };
    setPoopRecords((prev) => {
      const next = [record, ...prev];
      save('poopRecords', next);
      return next;
    });
  }, []);

  return (
    <RecordContext.Provider value={{ feedingRecords, sleepRecords, poopRecords, addFeeding, addSleep, addPoop }}>
      {children}
    </RecordContext.Provider>
  );
}

export function useRecords() {
  return useContext(RecordContext);
}
