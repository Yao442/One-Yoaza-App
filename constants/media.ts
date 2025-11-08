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
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    title: 'Community Gathering',
    category: 'Communities',
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
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800',
    title: 'Traditional Chief',
    category: 'Chiefs',
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
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
    title: 'Wildlife Safari',
    category: 'Wildlife',
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
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800',
    title: 'Community Market',
    category: 'Communities',
  },
  {
    id: '12',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
    title: 'Ocean Waves',
    category: 'Nature',
  },
  {
    id: '13',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    title: 'Traditional Leader',
    category: 'Chiefs',
  },
  {
    id: '14',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    title: 'Elephant Herd',
    category: 'Wildlife',
  },
  {
    id: '15',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1526736220381-1b680c8d6600?w=800',
    title: 'Village Life',
    category: 'Communities',
  },
  {
    id: '16',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
    title: 'Lion Pride',
    category: 'Wildlife',
  },
  {
    id: '17',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    title: 'Royal Palace',
    category: 'Palace',
  },
  {
    id: '18',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    title: 'Festival Celebration',
    category: 'Festivals',
  },
  {
    id: '19',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800',
    title: 'Historical Monument',
    category: 'History',
  },
  {
    id: '20',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1599582652399-9a92ce8ddfc6?w=800',
    title: 'Heritage Site',
    category: 'Heritage',
  },
  {
    id: '21',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
    title: 'The King',
    category: 'The King',
  },
];

export const CATEGORIES = ['All', 'Communities', 'Travel'];
