import React, { useState } from 'react';
import {
  Text,
  Image,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { searchSongs } from '../services/songService';
import SongCard from '../components/SongCard';
import NotFound from '../components/NotFound';
import { searchArtists } from '../services/artistService';
import { searchAlbums } from '../services/albumService';

const SearchScreen = () => {
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<any[]>([]);

  const [artists, setArtists] =
  useState<any[]>([]);

const [albums, setAlbums] =
  useState<any[]>([]);

const [activeTab, setActiveTab] =
  useState<'songs' | 'artists' | 'albums'>(
    'songs'
  );
  const handleSearch = async () => {
  if (!query.trim()) return;

  try {
    const [
      songsData,
      artistsData,
      albumsData,
    ] = await Promise.all([
      searchSongs(query),
      searchArtists(query),
      searchAlbums(query),
    ]);

    setSongs(
      songsData.data.results || []
    );

    setArtists(
      artistsData.data.results || []
    );

    setAlbums(
      albumsData.data.results || []
    );

  } catch (error) {
    console.log(error);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Search songs..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={styles.input}
        />
      </View>

      <View style={styles.tabs}>
  <TouchableOpacity
    onPress={() => setActiveTab('songs')}
  >
    <Text
      style={[
        styles.tab,
        activeTab === 'songs' &&
          styles.activeTab,
      ]}
    >
      Songs
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setActiveTab('artists')}
  >
    <Text
      style={[
        styles.tab,
        activeTab === 'artists' &&
          styles.activeTab,
      ]}
    >
      Artists
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setActiveTab('albums')}
  >
    <Text
      style={[
        styles.tab,
        activeTab === 'albums' &&
          styles.activeTab,
      ]}
    >
      Albums
    </Text>
  </TouchableOpacity>
</View>
      
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
          })
        }
        onMenuPress={() => {}}
      />
    )}
    ListEmptyComponent={
      query.length > 0 ? (
        <NotFound />
      ) : null
    }
  />
)}

{activeTab === 'artists' && (
  <FlatList
    data={artists}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        }}
      >
        <Image
          source={{
            uri: item.image?.[2]?.url,
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />

        <Text
          style={{
            marginLeft: 12,
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {item.name}
        </Text>
      </View>
    )}
    ListEmptyComponent={
      query.length > 0 ? (
        <NotFound />
      ) : null
    }
  />
)}

{activeTab === 'albums' && (
  <FlatList
    data={albums}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        }}
      >
        <Image
          source={{
            uri: item.image?.[2]?.url,
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
          }}
        />

        <Text
          style={{
            marginLeft: 12,
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {item.name}
        </Text>
      </View>
    )}
    ListEmptyComponent={
      query.length > 0 ? (
        <NotFound />
      ) : null
    }
  />
)}
      
    </SafeAreaView>

    
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },

  tabs: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 15,
},

tab: {
  color: 'gray',
  fontSize: 16,
},

activeTab: {
  color: '#ff8c1a',
  fontWeight: '700',
},
});