import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const SETTINGS_ITEMS = [
  {
    id: 'darkMode',
    label: 'Dark Mode',
    icon: 'moon-outline',
    type: 'toggle',
    value: false,
    soon: true,
  },
  {
    id: 'quality',
    label: 'Audio Quality',
    icon: 'musical-note-outline',
    type: 'info',
    value: 'High',
  },
  {
    id: 'version',
    label: 'Version',
    icon: 'phone-portrait-outline',
    type: 'info',
    value: '1.0.0',
  },
  {
    id: 'built',
    label: 'Built with React Native & Expo',
    icon: 'code-slash-outline',
    type: 'info',
    value: '',
  },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Mume</Text>
        <Ionicons name="settings-outline" size={24} color="#111" />
      </View>

      <Text style={styles.sectionLabel}>Preferences</Text>

      {SETTINGS_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.row}
          activeOpacity={item.type === 'toggle' ? 1 : 0.7}
        >
          {/* Left icon */}
          <View style={styles.iconBox}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color="#ff8c1a"
            />
          </View>

          {/* Label */}
          <Text style={styles.rowLabel}>{item.label}</Text>

          {/* Right side */}
          {item.type === 'toggle' ? (
            <View style={styles.rightSide}>
              {item.soon && (
                <Text style={styles.soonBadge}>Soon</Text>
              )}
              <Switch
                value={item.value as boolean}
                disabled
                trackColor={{ true: '#ff8c1a', false: '#ddd' }}
              />
            </View>
          ) : item.value ? (
            <Text style={styles.rowValue}>{item.value}</Text>
          ) : (
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          )}
        </TouchableOpacity>
      ))}

      {/* About section */}
      <Text style={[styles.sectionLabel, { marginTop: 28 }]}>About</Text>

      <View style={styles.aboutCard}>
        <Ionicons name="musical-notes" size={32} color="#ff8c1a" />
        <Text style={styles.aboutTitle}>Mume</Text>
        <Text style={styles.aboutSub}>
          Your local music player{'\n'}Made with ❤️ using React Native
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff5ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },
  rowValue: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soonBadge: {
    fontSize: 11,
    color: '#ff8c1a',
    fontWeight: '700',
    backgroundColor: '#fff5ec',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aboutCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#fff5ec',
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  aboutSub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});