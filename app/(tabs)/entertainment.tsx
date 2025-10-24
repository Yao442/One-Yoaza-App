import { Stack } from 'expo-router';
import { Radio, Tv } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type TabType = 'Radios' | 'TV';

const TABS: { id: TabType; title: string }[] = [
  { id: 'Radios', title: 'Radios' },
  { id: 'TV', title: 'TV' },
];

const SPACING = 12;

export default function EntertainmentScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Radios');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Entertainment</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScrollView}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setSelectedTab(tab.id)}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === 'Radios' ? (
          <View style={styles.emptyState}>
            <Radio size={64} color="#666" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Radio Stations</Text>
            <Text style={styles.emptySubtitle}>
              Coming soon - Your favorite radio stations
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Tv size={64} color="#666" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>TV Channels</Text>
            <Text style={styles.emptySubtitle}>
              Coming soon - Live TV streaming
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: -0.5,
  },
  tabsScrollView: {
    flexGrow: 0,
    marginBottom: 16,
  },
  tabsContainer: {
    paddingHorizontal: SPACING,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#999',
  },
  tabTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: SPACING,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
