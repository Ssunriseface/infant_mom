import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_DAYS = 15;
const STORAGE_KEY = 'firstLaunchDate';
const SUBSCRIBED_KEY = 'isSubscribed';

interface SubscriptionState {
  isExpired: boolean;
  daysLeft: number;
  isSubscribed: boolean;
  subscribe: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState>({
  isExpired: false,
  daysLeft: TRIAL_DAYS,
  isSubscribed: false,
  subscribe: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [firstLaunchDate, setFirstLaunchDate] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    (async () => {
      let date = await AsyncStorage.getItem(STORAGE_KEY);
      if (!date) {
        date = new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_KEY, date);
      }
      setFirstLaunchDate(date);
      const sub = await AsyncStorage.getItem(SUBSCRIBED_KEY);
      setIsSubscribed(sub === 'true');
    })();
  }, []);

  const daysSinceLaunch = firstLaunchDate
    ? Math.floor((Date.now() - new Date(firstLaunchDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const daysLeft = TRIAL_DAYS - daysSinceLaunch;
  const isExpired = !isSubscribed && daysLeft <= 0;

  const subscribe = useCallback(async () => {
    await AsyncStorage.setItem(SUBSCRIBED_KEY, 'true');
    setIsSubscribed(true);
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isExpired, daysLeft, isSubscribed, subscribe }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
