import { Image } from 'expo-image';
import { Play, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MEDIA_DATA, MediaItem } from '@/constants/media';
import { useAuth } from '@/contexts/auth';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_SIZE = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

interface Community {
  id: string;
  name: string;
  description: string;
  imageUri: string;
  createdBy: string;
  memberCount: number;
  createdAt: string;
}

const COMMUNITIES_STORAGE_KEY = '@communities';

const DEFAULT_COMMUNITY_IMAGES = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
  'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=400',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
];

export default function CommunitiesScreen() {
  const { user, isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadCommunities = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(COMMUNITIES_STORAGE_KEY);
      if (stored) {
        setCommunities(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  const saveCommunities = useCallback(async (updatedCommunities: Community[]) => {
    try {
      await AsyncStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(updatedCommunities));
      setCommunities(updatedCommunities);
    } catch (error) {
      console.error('Error saving communities:', error);
    }
  }, []);

  const handleCreateCommunity = useCallback(() => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to create a community');
      return;
    }
    setIsModalVisible(true);
  }, [isAuthenticated]);

  const handleSubmitCommunity = useCallback(async () => {
    if (!newCommunityName.trim()) {
      Alert.alert('Error', 'Please enter a community name');
      return;
    }

    if (!user) return;

    const newCommunity: Community = {
      id: `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newCommunityName.trim(),
      description: newCommunityDescription.trim(),
      imageUri: DEFAULT_COMMUNITY_IMAGES[Math.floor(Math.random() * DEFAULT_COMMUNITY_IMAGES.length)],
      createdBy: user.id,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    const updatedCommunities = [newCommunity, ...communities];
    await saveCommunities(updatedCommunities);

    setNewCommunityName('');
    setNewCommunityDescription('');
    setIsModalVisible(false);

    Alert.alert('Success', 'Community created successfully!');
  }, [newCommunityName, newCommunityDescription, user, communities, saveCommunities]);

  const filteredMedia = MEDIA_DATA.filter((item) => item.category === 'Communities');

  const renderCommunityCard = ({ item }: { item: Community }) => (
    <Pressable
      style={({ pressed }) => [
        styles.communityCard,
        pressed && styles.mediaItemPressed,
      ]}
      onPress={() => {
        Alert.alert(item.name, item.description || 'No description available');
      }}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.communityImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.communityInfo}>
        <Text style={styles.communityName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.description ? (
          <Text style={styles.communityDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.communityMemberCount}>
          {item.memberCount} member{item.memberCount !== 1 ? 's' : ''}
        </Text>
      </View>
    </Pressable>
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
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {communities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Communities</Text>
            <FlatList
              data={communities}
              renderItem={renderCommunityCard}
              keyExtractor={(item) => item.id}
              numColumns={COLUMN_COUNT}
              scrollEnabled={false}
              contentContainerStyle={styles.communitiesGrid}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {filteredMedia.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <FlatList
              data={filteredMedia}
              renderItem={renderMediaItem}
              keyExtractor={(item) => item.id}
              numColumns={COLUMN_COUNT}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
              key={COLUMN_COUNT}
            />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateCommunity}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Community</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Community Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter community name"
                placeholderTextColor="#666"
                value={newCommunityName}
                onChangeText={setNewCommunityName}
                maxLength={50}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your community"
                placeholderTextColor="#666"
                value={newCommunityDescription}
                onChangeText={setNewCommunityDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitCommunity}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Create Community</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    paddingHorizontal: SPACING,
    marginBottom: 12,
  },
  communitiesGrid: {
    paddingHorizontal: SPACING,
    gap: SPACING,
  },
  communityCard: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.4,
    marginRight: SPACING,
    marginBottom: SPACING,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  communityImage: {
    width: '100%',
    height: ITEM_SIZE,
  },
  communityInfo: {
    padding: 12,
    flex: 1,
  },
  communityName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 6,
    lineHeight: 16,
  },
  communityMemberCount: {
    fontSize: 11,
    color: '#666',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  modalBody: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
