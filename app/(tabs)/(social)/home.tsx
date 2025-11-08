import { Image } from 'expo-image';
import { Camera, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type PostType = 'image' | 'video' | 'reel';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    region: string;
  };
  type: PostType;
  content: string;
  media?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      name: 'Kwame Asante',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      region: 'Ashanti',
    },
    type: 'image',
    content: 'Beautiful sunrise in Kumasi today! 🌅',
    media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    likes: 234,
    comments: 12,
    timestamp: '2h ago',
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      name: 'Ama Boateng',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      region: 'Greater Accra',
    },
    type: 'image',
    content: 'Traditional kente weaving at its finest! 🧵✨',
    media: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=800',
    likes: 567,
    comments: 34,
    timestamp: '4h ago',
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    author: {
      name: 'Kofi Mensah',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      region: 'Central',
    },
    type: 'video',
    content: 'Cape Coast Castle tour - so much history here 🏰',
    media: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    likes: 892,
    comments: 45,
    timestamp: '6h ago',
    isLiked: false,
    isSaved: false,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [commentText, setCommentText] = useState('');

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            <Text style={styles.authorRegion}>{item.author.region} • {item.timestamp}</Text>
          </View>
        </View>
        <Pressable style={styles.moreButton}>
          <MoreHorizontal size={20} color="#fff" />
        </Pressable>
      </View>

      {item.media && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.media }} style={styles.postMedia} contentFit="cover" />
          {item.type === 'video' && (
            <View style={styles.videoIndicator}>
              <Text style={styles.videoText}>VIDEO</Text>
            </View>
          )}
          {item.type === 'reel' && (
            <View style={styles.reelIndicator}>
              <Text style={styles.reelText}>REEL</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.postContent}>
        <View style={styles.actionButtons}>
          <Pressable 
            style={styles.actionButton} 
            onPress={() => toggleLike(item.id)}
          >
            <Heart 
              size={24} 
              color={item.isLiked ? '#ff3b5c' : '#fff'} 
              fill={item.isLiked ? '#ff3b5c' : 'none'}
            />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <MessageCircle size={24} color="#fff" />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Send size={24} color="#fff" />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable 
            style={styles.actionButton}
            onPress={() => toggleSave(item.id)}
          >
            <Bookmark 
              size={24} 
              color={item.isSaved ? '#ffd700' : '#fff'} 
              fill={item.isSaved ? '#ffd700' : 'none'}
            />
          </Pressable>
        </View>

        <Text style={styles.likesText}>{item.likes.toLocaleString()} likes</Text>
        
        <View style={styles.captionContainer}>
          <Text style={styles.captionAuthor}>{item.author.name}</Text>
          <Text style={styles.captionText}> {item.content}</Text>
        </View>

        {item.comments > 0 && (
          <Pressable>
            <Text style={styles.commentsLink}>
              View all {item.comments} comments
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Social</Text>
        <Pressable style={styles.createButton}>
          <Plus size={24} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Pressable style={styles.fab}>
        <Camera size={24} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  postCard: {
    marginBottom: 24,
    backgroundColor: '#000',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  authorDetails: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
  authorRegion: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  mediaContainer: {
    width: width,
    height: width,
    backgroundColor: '#1a1a1a',
  },
  postMedia: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
  },
  reelIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(138, 43, 226, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reelText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  actionSpacer: {
    flex: 1,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 8,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  captionAuthor: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  captionText: {
    fontSize: 14,
    color: '#fff',
  },
  commentsLink: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
