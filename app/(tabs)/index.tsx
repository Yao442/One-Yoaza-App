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

import { CATEGORIES, MEDIA_DATA, MediaItem } from '@/constants/media';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_SIZE = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredMedia =
    selectedCategory === 'All'
      ? MEDIA_DATA
      : MEDIA_DATA.filter((item) => item.category === selectedCategory);

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

  const renderCategoryItem = (category: string) => {
    const isSelected = category === selectedCategory;
    return (
      <Pressable
        key={category}
        style={[
          styles.categoryChip,
          isSelected && styles.categoryChipSelected,
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {category}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
        <Text style={styles.headerSubtitle}>
          {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(renderCategoryItem)}
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
    paddingBottom: 16,
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
  categoriesContainer: {
    flexGrow: 0,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: SPACING,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 10,
  },
  categoryChipSelected: {
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.3,
  },
  categoryTextSelected: {
    color: '#000',
    fontWeight: '700' as const,
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
