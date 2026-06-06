import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import SongCard from '../components/SongCard';

import { getArtistSongs }
from '../services/artistService';

const ArtistScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
    
  const {
    artistId,
    artistName,
  } = route.params;

  const [songs, setSongs] =
    useState<any[]>([]);

  const loadArtistSongs =
    async () => {
      try {
        const data =
          await getArtistSongs(
            artistId
          );

        console.log(
          'ARTIST DATA:',
          data
        );

        setSongs(
          data.data.songs || []
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadArtistSongs();
  }, []);

  return (
    <SafeAreaView
      style={styles.container}
    >
      <Text style={styles.title}>
        {artistName}
      </Text>

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
            onMenuPress={() => {}}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ArtistScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    title: {
      fontSize: 24,
      fontWeight: '700',
      padding: 20,
    },
  });