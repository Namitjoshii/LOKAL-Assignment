import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import SongCard from '../components/SongCard';
import MiniPlayer from '../components/MiniPlayer';

import { searchSongs } from '../services/songService';
import { usePlayerStore } from '../store/playerStore';
import SuggestedContent from '../components/SuggestedContent';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] =
    useState<'songs' | 'artists' | 'albums'|'suggested'>(
      'songs'
    );

    const {recentlyPlayed} = usePlayerStore();
    console.log("Home RECENT:",recentlyPlayed.map((item=>item.name)))

  const loadSongs = async () => {
    try {
      setLoading(true);

      const data = await searchSongs('arijit');

      console.log('API DATA:', data);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Mume
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Search')
          }
        >
          <Ionicons
            name="search-outline"
            size={26}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>


       <TouchableOpacity
  onPress={() =>
    setActiveTab('suggested')
  }
>
  <Text
    style={[
      styles.tabText,
      activeTab === 'suggested' &&
        styles.activeTab,
    ]}
  >
    Suggested
  </Text>
</TouchableOpacity>


        <TouchableOpacity
          onPress={() =>
            setActiveTab('songs')
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'songs' &&
                styles.activeTab,
            ]}
          >
            Songs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setActiveTab('artists')
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'artists' &&
                styles.activeTab,
            ]}
          >
            Artists
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setActiveTab('albums')
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'albums' &&
                styles.activeTab,
            ]}
          >
            Albums
          </Text>
        </TouchableOpacity>
      </View>


{/*Suggested tab */}
{activeTab === 'suggested' && (
  <SuggestedContent />
)}


      {/* Songs Tab */}
      {activeTab === 'songs' && (
        <FlatList
          data={songs}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() =>
                navigation.navigate(
                  'Player',
                  {
                    song: item,
                  }
                )
              }
              onMenuPress={() => {
                console.log(
                  'Menu clicked'
                );
              }}
            />
          )}
        />
      )}

      {/* Artists Tab */}
      {activeTab === 'artists' && (
        <View style={styles.center}>
          <Ionicons
            name="person-outline"
            size={60}
            color="#ff8c1a"
          />

          <Text style={styles.comingText}>
            Artists Coming Soon
          </Text>
        </View>
      )}

      {/* Albums Tab */}
      {activeTab === 'albums' && (
        <View style={styles.center}>
          <Ionicons
            name="albums-outline"
            size={60}
            color="#ff8c1a"
          />

          <Text style={styles.comingText}>
            Albums Coming Soon
          </Text>
        </View>
      )}

      <MiniPlayer />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  logo: {
    fontSize: 24,
    fontWeight: '700',
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },

  tabText: {
    fontSize: 16,
    color: 'gray',
    paddingBottom: 8,
  },

  activeTab: {
    color: '#ff8c1a',
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  comingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});