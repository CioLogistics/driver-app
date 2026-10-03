import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { daysUntil, fmt, level, type Level } from '../lib/dates';
import { useI18n } from '../lib/i18n';
import { useTheme, type Theme } from '../lib/theme';

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
}: {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom')[];
}) {
  const c = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={edges}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  return <Text style={{ fontSize: 26, fontWeight: '800', color: c.ink }}>{children}</Text>;
}

export function H2({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  return <Text style={{ fontSize: 17, fontWeight: '700', color: c.ink, marginTop: 4 }}>{children}</Text>;
}

export function Muted({ children, style }: { children: React.ReactNode; style?: object }) {
  const c = useTheme();
  return <Text style={[{ fontSize: 14, color: c.muted }, style]}>{children}</Text>;
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const c = useTheme();
  const base = {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.line,
    gap: 8,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, style, pressed && { opacity: 0.7 }]}>
      {children}
    </Pressable>
  );
}

export function Button({
  title,
  onPress,
  kind = 'primary',
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'danger' | 'whatsapp';
  loading?: boolean;
  disabled?: boolean;
}) {
  const c = useTheme();
  const bg = {
    primary: c.accent,
    secondary: c.accentSoft,
    danger: c.badSoft,
    whatsapp: '#25D366',
  }[kind];
  const fg = { primary: '#fff', secondary: c.accent, danger: c.bad, whatsapp: '#fff' }[kind];
  const off = disabled || loading;
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: bg,
        borderRadius: 14,
        minHeight: 52,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: off ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={{ color: fg, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string | null }) {
  const c = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, color: c.muted, fontWeight: '600' }}>{label}</Text>
      <TextInput
        placeholderTextColor={c.muted}
        {...props}
        style={{
          backgroundColor: c.surface,
          color: c.ink,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? c.bad : c.line,
          paddingHorizontal: 14,
          minHeight: 50,
          fontSize: 16,
        }}
      />
      {error ? <Text style={{ color: c.bad, fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
}

function levelColors(c: Theme, l: Level) {
  if (l === 'bad') return { fg: c.bad, bg: c.badSoft };
  if (l === 'warn') return { fg: c.warn, bg: c.warnSoft };
  if (l === 'ok') return { fg: c.ok, bg: c.okSoft };
  return { fg: c.muted, bg: c.bg };
}

/** Ժամկետի տող՝ գունավոր նշանով (կարմիր / նարնջագույն / կանաչ) */
export function DeadlineRow({ label, date }: { label: string; date: string | null | undefined }) {
  const c = useTheme();
  const { t } = useI18n();
  const d = daysUntil(date);
  const l = level(d);
  const col = levelColors(c, l);
  const badge = d === null ? t('notSet') : d <= 0 ? t('expired') : `${d} ${t('daysLeft')}`;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.ink, fontSize: 15, fontWeight: '600' }}>{label}</Text>
        {date ? <Muted>{fmt(date)}</Muted> : null}
      </View>
      <View style={{ backgroundColor: col.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
        <Text style={{ color: col.fg, fontWeight: '700', fontSize: 13 }}>{badge}</Text>
      </View>
    </View>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: c.line, borderRadius: 12, padding: 3 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: on ? c.surface : 'transparent',
            }}
          >
            <Text style={{ color: on ? c.ink : c.muted, fontWeight: '700' }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Loading() {
  const c = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
      <ActivityIndicator color={c.accent} />
    </View>
  );
}
