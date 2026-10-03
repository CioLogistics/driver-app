import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from '../src/components/ui';
import { AuthProvider, useAuth } from '../src/lib/auth';
import { I18nProvider, useI18n } from '../src/lib/i18n';
import { useTheme } from '../src/lib/theme';

function RootStack() {
  const { session, loading } = useAuth();
  const { t } = useI18n();
  const c = useTheme();
  if (loading) return <Loading />;

  const signedIn = !!session;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.ink,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: c.bg },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vehicle/index" options={{ title: t('myVehicle') }} />
        <Stack.Screen name="vehicle/edit" options={{ title: t('myVehicle'), presentation: 'modal' }} />
        <Stack.Screen name="driver/index" options={{ title: t('driver') }} />
        <Stack.Screen name="driver/edit" options={{ title: t('driver'), presentation: 'modal' }} />
        <Stack.Screen name="deals/new" options={{ title: t('newDeal'), presentation: 'modal' }} />
        <Stack.Screen name="deals/[id]" options={{ title: t('tabDeals') }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <RootStack />
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
