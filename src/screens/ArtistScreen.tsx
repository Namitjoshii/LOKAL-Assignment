import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {
  useRoute,
  useNavigation,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import SongCard from '../components/SongCard';

import {
  getArtistSongs,
} from '../services/artistService';

const ArtistDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {
    artistId,
    artistName,
    artistImage,
  } = route.params;


  const [songs, setSongs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

        useEffect(() => {
  const load = async () => {
    try {
      const songsRes =
        await getArtistSongs(
          artistId
        );

      console.log(
        'SONGS RES:',
        JSON.stringify(
          songsRes,
          null,
          2
        )
      );

      setSongs(
        songsRes.data?.songs ||
        songsRes.data?.topSongs ||
        songsRes.songs ||
        songsRes.topSongs ||
        []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [artistId]);

        

  if (loading) {
    return (
      <View
        style={
          styles.loadingCenter
        }
      >
        <ActivityIndicator
          size="large"
          color="#ff8c1a"
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <FlatList
        ListHeaderComponent={
          <>
            <Image
              source={{
                uri:
                  artistImage,
              }}
              style={
                styles.artistImage
              }
            />

            <Text
              style={
                styles.artistName
              }
            >
              {artistName}
            </Text>

            <Text
              style={
                styles.songCount
              }
            >
              {songs.length}{' '}
              Songs
            </Text>
          </>
        }
        data={songs}
        keyExtractor={(
          item
        ) => item.id}
        renderItem={({
          item,
        }) => (
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
            onPlayPress={() =>
              navigation.navigate(
                'Player',
                {
                  song: item,
                }
              )
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ArtistDetailScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#fff',
    },

    loadingCenter: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    artistImage: {
      width: 180,
      height: 180,
      borderRadius: 90,
      alignSelf:
        'center',
      marginTop: 20,
    },

    artistName: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 15,
    },

    songCount: {
      textAlign: 'center',
      color: 'gray',
      marginBottom: 20,
      marginTop: 5,
    },
  });