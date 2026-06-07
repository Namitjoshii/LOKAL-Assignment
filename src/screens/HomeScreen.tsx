import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SongCard from '../components/SongCard';
import MiniPlayer from '../components/MiniPlayer';
import { searchSongs } from '../services/songService';
import { usePlayerStore } from '../store/playerStore';
import SuggestedContent from '../components/SuggestedContent';
import { decodeHtml } from '../utils/decodeHtml';
import ArtistsContent from '../components/ArtistsContent';
import { searchAlbums } from '../services/albumService';
import { getAlbumById } from '../services/albumService';
import AlbumsContent from '../components/AlbumsContent';

// Menu items config — easy to add/remove
const MENU_ITEMS = [
  {
    id: 'playNext',
    label: 'Play Next',
    icon: 'play-forward-outline',
    lib: 'ionicons',
  },
  {
    id: 'addQueue',
    label: 'Add to Playing Queue',
    icon: 'list-outline',
    lib: 'ionicons',
  },
  {
    id: 'addPlaylist',
    label: 'Add to Playlist',
    icon: 'add-circle-outline',
    lib: 'ionicons',
  },
  {
    id: 'goAlbum',
    label: 'Go To Album',
    icon: 'disc-outline',
    lib: 'ionicons',
  },
  {
    id: 'goArtist',
    label: 'Go To Artist',
    icon: 'person-outline',
    lib: 'ionicons',
  },
  {
    id: 'details',
    label: 'Details',
    icon: 'information-circle-outline',
    lib: 'ionicons',
  },
  {
    id: 'ringtone',
    label: 'Set as Ringtone',
    icon: 'call-outline',
    lib: 'ionicons',
  },
  {
    id: 'blacklist',
    label: 'Add to Blacklist',
    icon: 'ban-outline',
    lib: 'ionicons',
  },
  {
    id: 'share',
    label: 'Share',
    icon: 'share-outline',
    lib: 'ionicons',
  },
  {
    id: 'delete',
    label: 'Delete from Device',
    icon: 'trash-outline',
    lib: 'ionicons',
    danger: true,
  },
];



const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] =
    useState<'songs' | 'artists' | 'albums' | 'suggested'>('songs');

  const { recentlyPlayed, setQueue } = usePlayerStore();

  const loadSongs = async () => {
    try {
      setLoading(true);

const albums = await searchAlbums('arijit');
    console.log(
      'ALBUM:',
      JSON.stringify(albums.data.results[0], null, 2)
    );
    
      const data = await searchSongs('arijit');
      setSongs(data.data.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      setQueue(songs);
    }
  }, [songs]);

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const next = new Set(prev);
      next.has(songId) ? next.delete(songId) : next.add(songId);
      return next;
    });
  };
  
  

  const handleMenuAction = async (
  actionId: string
) => {
  setShowMenu(false);

  switch (actionId) {
    case 'share':
      try {
        await Share.share({
          message:
            selectedSong?.name ||
            'Check this artist',
        });
      } catch (error) {
        console.log(error);
      }
      break;

    case 'playNext':
      console.log(
        'Play Next Clicked'
      );
      break;

    case 'addPlaylist':
      console.log(
        'Added To Playlist'
      );
      break;

    default:
      console.log(
        actionId
      );
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Mume</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['suggested', 'songs', 'artists', 'albums'] as const).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTab,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'suggested' && <SuggestedContent />}

      {activeTab === 'songs' && (
        <>
         <View style={styles.songsHeader}>
      <Text style={styles.songsCount}>
        {songs.length} songs
      </Text>
      <TouchableOpacity style={styles.sortBtn}>
        <Text style={styles.sortText}>Ascending</Text>
        <Ionicons
          name="swap-vertical-outline"
          size={15}
          color="#ff8c1a"
        />
      </TouchableOpacity>
    </View>
        <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SongCard
          song={item}
          onPress={() =>
            navigation.navigate('Player', { song: item, songs })
          }
          onMenuPress={() => {
            setSelectedSong(item);
            setShowMenu(true);
          }}
          onPlayPress={() =>
            navigation.navigate('Player', { song: item, songs})
    }
            />
          )}
        />
          </>
      )}

      {activeTab === 'artists' && (
        <ArtistsContent/>
)}
      

      {activeTab === 'albums' && (
        <AlbumsContent/>
      )}

      <MiniPlayer />

      {/* ── Bottom Sheet Modal ── */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.bottomSheet}>
            {/* Song Info Row */}
            <View style={styles.songInfoRow}>
              <Image
                source={{ uri: selectedSong?.image?.[2]?.url }}
                style={styles.songThumb}
              />
              <View style={styles.songInfoText}>
                <Text numberOfLines={1} style={styles.songInfoName}>
                  {decodeHtml(selectedSong?.name ?? '')}
                </Text>
                <Text numberOfLines={1} style={styles.songInfoArtist}>
                  {selectedSong?.primaryArtists}
                  {selectedSong?.duration
                    ? `  |  ${Math.floor(selectedSong.duration / 60)}:${String(
                        selectedSong.duration % 60
                      ).padStart(2, '0')} mins`
                    : ''}
                </Text>
              </View>
              {/* Heart */}
              <TouchableOpacity
                onPress={() => toggleLike(selectedSong?.id)}
                style={styles.heartBtn}
              >
                <Ionicons
                  name={
                    likedSongs.has(selectedSong?.id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={22}
                  color={
                    likedSongs.has(selectedSong?.id) ? '#ff8c1a' : '#aaa'
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Menu Items */}
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuAction(item.id)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={21}
                  color={item.danger ? '#e53935' : '#333'}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    item.danger && { color: '#e53935' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  logo: { fontSize: 24, fontWeight: '700' },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },

  tabText: { fontSize: 16, color: 'gray', paddingBottom: 8 },

  activeTab: { color: '#ff8c1a', fontWeight: '700' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  comingText: { marginTop: 10, fontSize: 18, fontWeight: '600' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  // Song info
  songInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  songThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },

  songInfoText: {
    flex: 1,
    marginLeft: 14,
  },

  songInfoName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  songInfoArtist: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },

  heartBtn: {
    padding: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },

  menuIcon: {
    width: 30,
  },

  menuLabel: {
    fontSize: 15,
    color: '#222',
    marginLeft: 12,
  },

  songsHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
},
songsCount: {
  fontSize: 15,
  fontWeight: '700',
  color: '#111',
},
sortBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
},
sortText: {
  fontSize: 13,
  color: '#ff8c1a',
  fontWeight: '600',
},
});