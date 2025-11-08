import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { Play } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MEDIA_DATA, MediaItem } from '@/constants/media';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_SIZE = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

type TabType = 'Palace' | 'Festivals' | 'History' | 'Heritage' | 'The King' | 'Chiefs';

const TABS: { id: TabType; title: string }[] = [
  { id: 'Palace', title: 'Palace' },
  { id: 'Festivals', title: 'Festivals' },
  { id: 'History', title: 'History' },
  { id: 'Heritage', title: 'Heritage' },
  { id: 'The King', title: 'The King' },
  { id: 'Chiefs', title: 'Chiefs' },
];

export default function PalaceScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Palace');

  const filteredMedia = MEDIA_DATA.filter(
    (item) => item.category === selectedTab
  );

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.mediaItem,
        pressed && styles.mediaItemPressed,
      ]}
      onPress={() => {
        router.push({
          pathname: '/viewer',
          params: { mediaId: item.id },
        });
      }}
    >
      <Image
        source={{ uri: item.type === 'video' ? item.thumbnail : item.uri }}
        style={styles.mediaImage}
        contentFit="cover"
        transition={200}
      />
      {item.type === 'video' && (
        <View style={styles.videoOverlay}>
          <View style={styles.playButton}>
            <Play size={20} color="#fff" fill="#fff" />
          </View>
        </View>
      )}
      <View style={styles.mediaInfo}>
        <Text style={styles.mediaTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Palace</Text>
        <Text style={styles.headerSubtitle}>
          {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
        </Text>
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

      <FlatList
        data={filteredMedia}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        key={COLUMN_COUNT}
      />
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
  headerSubtitle: {
    fontSize: 15,
    color: '#999',
    marginTop: 4,
  },
  tabsScrollView: {
    flexGrow: 0,
    marginBottom: 8,
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
  gridContent: {
    padding: SPACING,
    gap: SPACING,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.3,
    marginRight: SPACING,
    marginBottom: SPACING,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  mediaItemPressed: {
    opacity: 0.8,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mediaTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
