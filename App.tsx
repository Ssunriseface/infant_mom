import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from './src/theme/colors';

import HomeScreen from './src/screens/HomeScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import ConsultScreen from './src/screens/ConsultScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import FeedingToolScreen from './src/screens/FeedingToolScreen';
import SleepToolScreen from './src/screens/SleepToolScreen';
import CryToolScreen from './src/screens/CryToolScreen';
import PoopToolScreen from './src/screens/PoopToolScreen';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="FeedingTool" component={FeedingToolScreen}
        options={{
          headerShown: true, headerTitle: 'AI 辅食生成',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="SleepTool" component={SleepToolScreen}
        options={{
          headerShown: true, headerTitle: '睡眠助手',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="CryTool" component={CryToolScreen}
        options={{
          headerShown: true, headerTitle: '哭声翻译器',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="PoopTool" component={PoopToolScreen}
        options={{
          headerShown: true, headerTitle: '便便分析',
          headerTintColor: Colors.primary, headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

const TabIcons: Record<string, { active: string; inactive: string }> = {
  Home:      { active: 'home',        inactive: 'home-outline' },
  Records:   { active: 'document-text',       inactive: 'document-text-outline' },
  Consult:   { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  Community: { active: 'people',       inactive: 'people-outline' },
};

function TabIcon({ name, focused, color, size }: {
  name: string; focused: boolean; color: string; size: number;
}) {
  const icons = TabIcons[name];
  if (!icons) return null;
  return <Ionicons name={focused ? icons.active : icons.inactive as any} size={size} color={color} />;
}

export default function App() {
  const content = (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <TabIcon name={route.name} focused={focused} color={color} size={size} />,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#bbb',
          tabBarStyle: {
            borderTopWidth: 1, borderTopColor: '#eee',
            paddingTop: 8, paddingBottom: 22, height: 80, backgroundColor: Colors.white,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: '首页' }} />
        <Tab.Screen name="Records" component={RecordsScreen} options={{ tabBarLabel: '成长' }} />
        <Tab.Screen name="Consult" component={ConsultScreen} options={{ tabBarLabel: '咨询' }} />
        <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarLabel: '社区' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#e8ecf1',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 390,
          height: '100%',
          maxHeight: 850,
          overflow: 'hidden',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 10,
        }}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}
