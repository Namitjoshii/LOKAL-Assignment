import React, { useState, useEffect } from 'react';
import {
  Text, Image, View, TextInput,
  FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { searchSongs } from '../services/songService';
import { searchArtists } from '../services/artistService';
import { searchAlbums } from '../services/albumService';
import SongCard from '../components/SongCard';
import NotFound from '../components/NotFound';
import { decodeHtml } from '../utils/decodeHtml';
import { usePlayerStore } from '../store/playerStore';
import { getArtistById } from '../services/songService';

const TABS = ['songs', 'artists', 'albums'] as const;
type Tab = typeof TABS[number];

const SearchScreen = () => {
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('songs');

  const { setQueue } = usePlayerStore();
  

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const [songsData, artistsData, albumsData] = await Promise.all([
        searchSongs(query),
        searchArtists(query),
        searchAlbums(query),
      ]);
      const artistSearchData = await searchArtists('arijit');
console.log('ARTIST SEARCH:', JSON.stringify(artistSearchData, null, 2));

const artistDetailData = await getArtistById('459320');
console.log('ARTIST DETAIL:', JSON.stringify(artistDetailData, null, 2));
      const songResults = songsData.data.results || [];
      setSongs(songResults);
      setArtists(artistsData.data.results || []);
      setAlbums(albumsData.data.results || []);
      setQueue(songResults);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#aaa"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search songs, artists, albums..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabBtn}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && (
              <View style={styles.tabUnderline} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Songs Tab */}
      {activeTab === 'songs' && (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() =>
                navigation.navigate('Player', {
                  song: item,
                  songs,
                })
              }
              onMenuPress={() => {}}
              onPlayPress={() =>
                navigation.navigate('Player', {
                  song: item,
                  songs,
                })
              }
            />
          )}
          ListEmptyComponent={
            query.length > 0 ? <NotFound /> : (
              <EmptySearch label="Search for songs" />
            )
          }
        />
      )}

      {/* Artists Tab */}
      {activeTab === 'artists' && (
        <FlatList
          data={artists}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.artistRow}
              onPress={() =>
                navigation.navigate('Artist', {
                  artistId: item.id,
                })
              }
              activeOpacity={0.75}
            >
              <Image
                source={{
                  uri:
                    item.image?.[2]?.url ??
                    item.image?.[1]?.url,
                }}
                style={styles.artistAvatar}
              />
              <View style={styles.artistInfo}>
                <Text style={styles.artistName} numberOfLines={1}>
                  {decodeHtml(item.name)}
                </Text>
                <Text style={styles.artistMeta} numberOfLines={1}>
                  Artist
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#ccc"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length > 0 ? <NotFound /> : (
              <EmptySearch label="Search for artists" />
            )
          }
        />
      )}

      {/* Albums Tab */}
      {activeTab === 'albums' && (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.albumRow}
              activeOpacity={0.75}
            >
              <Image
                source={{
                  uri:
                    item.image?.[2]?.url ??
                    item.image?.[1]?.url,
                }}
                style={styles.albumThumb}
              />
              <View style={styles.albumInfo}>
                <Text style={styles.albumName} numberOfLines={1}>
                  {decodeHtml(item.name)}
                </Text>
                <Text style={styles.albumMeta} numberOfLines={1}>
                  {item.primaryArtists ?? item.artist ?? 'Album'}
                  {item.year ? `  ·  ${item.year}` : ''}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#ccc"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length > 0 ? <NotFound /> : (
              <EmptySearch label="Search for albums" />
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

// ── Empty placeholder ──────────────────────────────────
const EmptySearch = ({ label }: { label: string }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="search-outline" size={52} color="#ddd" />
    <Text style={styles.emptyText}>{label}</Text>
  </View>
);

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Search bar
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 6,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 15,
    color: '#aaa',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ff8c1a',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2.5,
    width: '60%',
    backgroundColor: '#ff8c1a',
    borderRadius: 2,
  },

  separator: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginLeft: 86,
  },

  // Artists
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  artistAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  artistInfo: {
    flex: 1,
    marginLeft: 14,
  },
  artistName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  artistMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  // Albums
  albumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  albumThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
  albumInfo: {
    flex: 1,
    marginLeft: 14,
  },
  albumName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  albumMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#bbb',
    fontWeight: '500',
  },
});