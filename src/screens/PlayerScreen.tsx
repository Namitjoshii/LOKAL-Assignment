import React, { useEffect } from 'react';
import {
  View, Text, Image, StyleSheet,
  TouchableOpacity, Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { decodeHtml } from '../utils/decodeHtml';
import { usePlayerStore } from '../store/playerStore';

const PlayerScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {
    currentSong, setCurrentSong,
    isPlaying, setIsPlaying,
    sound, setSound,
    shuffle, repeat, setShuffle, setRepeat,
    addRecentlyPlayed,
    queue,  // 👈 store se queue
  } = usePlayerStore();

  const { song } = route.params;

  // 👇 FIX: displaySong — agar currentSong hai toh woh, warna route ka song
  const displaySong = currentSong ?? song;

  const playSong = async (songToPlay: any) => {
    try {
      // Same song — toggle play/pause
      if (sound && currentSong?.id === songToPlay.id) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      // New song — unload old, play new
      if (sound) {
        await sound.unloadAsync();
      }

      const audioUrl =
        songToPlay.downloadUrl?.[4]?.url ||
        songToPlay.downloadUrl?.[0]?.url;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentSong(songToPlay);
      addRecentlyPlayed(songToPlay);
      setIsPlaying(true);
    } catch (error) {
      console.log('PLAY ERROR:', error);
    }
  };

  // 👇 Next song — queue store se
  const playNextSong = async () => {
    if (!queue?.length) return;

    let nextSong;

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      nextSong = queue[randomIndex];
    } else {
      const currentIndex = queue.findIndex(
        (s: any) => s.id === (currentSong?.id ?? song.id)
      );
      nextSong = queue[(currentIndex + 1) % queue.length];
    }

    await playSong(nextSong);
  };

  // 👇 Prev song — queue store se
  const playPrevSong = async () => {
    if (!queue?.length) return;

    const currentIndex = queue.findIndex(
      (s: any) => s.id === (currentSong?.id ?? song.id)
    );

    const prevIndex =
      currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;

    await playSong(queue[prevIndex]);
  };

  // 👇 Pehli baar screen open ho toh song auto-play
  useEffect(() => {
    playSong(song);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <Image
          source={{
            uri:
              displaySong.image?.[2]?.url ||
              displaySong.image?.[2]?.link,
          }}
          style={styles.image}
        />

        {/* Song Info */}
        <Text style={styles.title} numberOfLines={1}>
          {decodeHtml(displaySong.name)}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {displaySong.primaryArtists}
        </Text>

        <View style={styles.divider} />

        {/* Progress Bar (static for now) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <View style={styles.progressThumb} />
          </View>
          <View style={styles.timeRow}>
            <Text>00:35</Text>
            <Text>03:50</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* 👇 Prev button — ab kaam karega */}
          <TouchableOpacity onPress={playPrevSong}>
            <Ionicons name="play-skip-back" size={25} color="black" />
          </TouchableOpacity>

          <MaterialIcons name="replay-10" size={27} color="black" />

          <Pressable
            style={styles.playButton}
            onPress={() => playSong(displaySong)}
          >
            <Ionicons
              name={
                currentSong?.id === displaySong.id && isPlaying
                  ? 'pause'
                  : 'play'
              }
              size={30}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </Pressable>

          <MaterialIcons name="forward-10" size={27} color="black" />

          {/* 👇 Next button — ab kaam karega */}
          <TouchableOpacity onPress={playNextSong}>
            <Ionicons name="play-skip-forward" size={25} color="black" />
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={() => setShuffle(!shuffle)}>
            <Ionicons
              name="shuffle"
              size={24}
              color={shuffle ? '#ff8c1a' : 'black'}
            />
          </TouchableOpacity>

          <MaterialCommunityIcons name="speedometer" size={24} color="black" />
          <MaterialCommunityIcons name="timer-outline" size={24} color="black" />

          <TouchableOpacity onPress={() => setRepeat(!repeat)}>
            <Ionicons
              name="repeat"
              size={24}
              color={repeat ? '#ff8c1a' : 'black'}
            />
          </TouchableOpacity>

          <MaterialCommunityIcons name="cast" size={24} color="black" />
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </View>

        {/* Lyrics */}
        <View style={styles.lyricsContainer}>
          <Ionicons name="chevron-up" size={24} color="black" />
          <Text style={styles.lyricsText}>Lyrics</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: 'gray',
    marginTop: 0,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 27,
    marginTop: 10,
  },
  progressContainer: { marginTop: 30 },
  progressTrack: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 10,
    position: 'relative',
  },
  progressFill: {
    width: '70%',
    height: 4,
    backgroundColor: '#ff8c1a',
    borderRadius: 10,
  },
  progressThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff8c1a',
    position: 'absolute',
    right: '28%',
    top: -5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#ff8c1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  lyricsContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  lyricsText: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
  },
});