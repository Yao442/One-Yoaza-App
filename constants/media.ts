export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  uri: string;
  thumbnail?: string;
  title: string;
  category: string;
};

export const MEDIA_DATA: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: 'Mountain Peak',
    category: 'Nature',
  },
  {
    id: '2',
    type: 'video',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400',
    title: 'Big Buck Bunny',
    category: 'Animation',
  },
  {
    id: '3',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    title: 'Forest Path',
    category: 'Nature',
  },
  {
    id: '4',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    title: 'Beach Sunset',
    category: 'Travel',
  },
  {
    id: '5',
    type: 'video',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
    title: 'Elephants Dream',
    category: 'Animation',
  },
  {
    id: '6',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    title: 'Foggy Hills',
    category: 'Nature',
  },
  {
    id: '7',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800',
    title: 'City Lights',
    category: 'Urban',
  },
  {
    id: '8',
    type: 'video',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    title: 'For Bigger Blazes',
    category: 'Action',
  },
  {
    id: '9',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    title: 'Autumn Forest',
    category: 'Nature',
  },
  {
    id: '10',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    title: 'Mountain Lake',
    category: 'Travel',
  },
  {
    id: '11',
    type: 'video',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    title: 'For Bigger Escapes',
    category: 'Travel',
  },
  {
    id: '12',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
    title: 'Ocean Waves',
    category: 'Nature',
  },
];

export const CATEGORIES = ['All', 'Nature', 'Travel', 'Urban', 'Animation', 'Action'];
