import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MEDIA_DATA } from '@/constants/media';

const { width, height } = Dimensions.get('window');

export default function ViewerScreen() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const mediaItem = MEDIA_DATA.find((item) => item.id === mediaId);

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  if (!mediaItem) {
    return null;
  }

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={28} color="#fff" strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{mediaItem.title}</Text>
            <Text style={styles.category}>{mediaItem.category}</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.mediaContainer}>
        {mediaItem.type === 'image' ? (
          <Image
            source={{ uri: mediaItem.uri }}
            style={styles.image}
            contentFit="contain"
          />
        ) : (
          <>
            <Video
              ref={videoRef}
              source={{ uri: mediaItem.uri }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
              isMuted={isMuted}
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if ('isPlaying' in status) {
                  setIsPlaying(status.isPlaying);
                }
              }}
            />

            <View style={styles.videoControls}>
              <Pressable
                style={styles.controlButton}
                onPress={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={32} color="#fff" fill="#fff" />
                ) : (
                  <Play size={32} color="#fff" fill="#fff" />
                )}
              </Pressable>

              <Pressable
                style={styles.controlButton}
                onPress={toggleMute}
              >
                {isMuted ? (
                  <VolumeX size={28} color="#fff" />
                ) : (
                  <Volume2 size={28} color="#fff" />
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  category: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  video: {
    width: width,
    height: height,
  },
  videoControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
