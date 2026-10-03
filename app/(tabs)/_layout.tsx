import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useI18n } from '../../src/lib/i18n';
import { useTheme } from '../../src/lib/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabsLayout() {
  const { t } = useI18n();
  const c = useTheme();
  const icon = (name: IconName) =>
    function TabIcon({ color, size }: { color: string; size: number }) {
      return <Ionicons name={name} color={color} size={size} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabHome'), tabBarIcon: icon('home') }} />
      <Tabs.Screen name="deals" options={{ title: t('tabDeals'), tabBarIcon: icon('swap-horizontal') }} />
      <Tabs.Screen name="map" options={{ title: t('tabMap'), tabBarIcon: icon('map') }} />
      <Tabs.Screen name="chats" options={{ title: t('tabChats'), tabBarIcon: icon('chatbubbles') }} />
      <Tabs.Screen name="me" options={{ title: t('tabMe'), tabBarIcon: icon('person-circle') }} />
    </Tabs>
  );
}
