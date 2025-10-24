import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { Play } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MEDIA_DATA, MediaItem } from '@/constants/media';

const { width } = Dimensions.get('window');
const SPACING = 16;

export default function VideosScreen() {
  const videoItems = MEDIA_DATA.filter((item) => item.type === 'video');

  const renderVideoItem = ({ item }: { item: MediaItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.videoCard,
        pressed && styles.videoCardPressed,
      ]}
      onPress={() => {
        router.push({
          pathname: '/viewer',
          params: { mediaId: item.id },
        });
      }}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButtonLarge}>
            <Play size={32} color="#fff" fill="#fff" />
          </View>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoCategory}>{item.category}</Text>
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
        <Text style={styles.headerTitle}>Videos</Text>
        <Text style={styles.headerSubtitle}>
          {videoItems.length} {videoItems.length === 1 ? 'video' : 'videos'}
        </Text>
      </View>

      <FlatList
        data={videoItems}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    padding: SPACING,
  },
  videoCard: {
    marginBottom: SPACING,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  videoCardPressed: {
    opacity: 0.8,
  },
  thumbnailContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  videoCategory: {
    fontSize: 14,
    color: '#999',
  },
});
