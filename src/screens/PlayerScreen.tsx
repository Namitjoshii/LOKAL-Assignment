import React, { useEffect, useState } from 'react';
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
import { PanResponder } from 'react-native'; 

const PlayerScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {
    currentSong, setCurrentSong,
    isPlaying, setIsPlaying,
    sound, setSound,
    shuffle, repeat, setShuffle, setRepeat,
    addRecentlyPlayed,
    queue,
  } = usePlayerStore();

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [trackWidth, setTrackWidth] = useState(1);
  const { song } = route.params;
  const displaySong = currentSong ?? song;

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playSong = async (songToPlay: any) => {
    try {



      // ✅ Same song — toggle play/pause
      if (sound && currentSong?.id === songToPlay.id) {
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) return;

        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      // ✅ Naya song — pehle wala unload karo
      if (sound) {
        try { await sound.unloadAsync(); } catch (e) {}
        setSound(null);
      }

      const audioUrl =
        songToPlay.downloadUrl?.[4]?.url ||
        songToPlay.downloadUrl?.[0]?.url;

      if (!audioUrl) {
        console.log('NO URL for:', songToPlay.name);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 }
      );

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (!status.isLoaded) return;
        if (!isSeeking) {
          setPosition(status.positionMillis || 0);
        }
        setDuration(status.durationMillis || 0);

        if (status.didJustFinish) {
          if (repeat) {
            newSound.replayAsync();
          } else {
            playNextSong();
          }
        }
      });

      setSound(newSound);
      setCurrentSong(songToPlay);
      addRecentlyPlayed(songToPlay);
      setIsPlaying(true);

    } catch (error) {
      console.log('PLAY ERROR:', error);
    }
  };

  const playNextSong = async () => {
    if (!queue?.length) return;
    let nextSong;
    if (shuffle) {
      nextSong = queue[Math.floor(Math.random() * queue.length)];
    } else {
      const currentIndex = queue.findIndex(
        (s: any) => s.id === (currentSong?.id ?? song.id)
      );
      nextSong = queue[(currentIndex + 1) % queue.length];
    }
    await playSong(nextSong);
  };

  const playPrevSong = async () => {
    if (!queue?.length) return;
    const currentIndex = queue.findIndex(
      (s: any) => s.id === (currentSong?.id ?? song.id)
    );
    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    await playSong(queue[prevIndex]);
  };

  // ✅ Fix — har baar screen open ho, song se compare karke play karo
  useEffect(() => {
    playSong(song);
  }, [song.id]); // song.id change hone pe hi re-trigger hoga

  // Sync position jab sound already chal raha ho (screen se wapas aao)
  useEffect(() => {
    if (!sound) return;
    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (!status.isLoaded) return;
      if (!isSeeking) {
        setPosition(status.positionMillis || 0);
      }
      setDuration(status.durationMillis || 0);
    });
  }, [sound]);

  const handleSeek = async (value: number) => {
    if (!sound) return;
    try {
      await sound.setPositionAsync(value);
      setPosition(value);
    } catch (err) {
      console.log('SEEK ERROR:', err);
    }
    setIsSeeking(false);
  };

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
            uri: displaySong.image?.[2]?.url || displaySong.image?.[2]?.link,
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

        {/* Progress Bar — custom, no external slider lib */}
          
<View style={styles.progressContainer}>
  <View
    style={styles.progressTrackWrapper}
    onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    onStartShouldSetResponder={() => true}
    onResponderGrant={(e) => {
      setIsSeeking(true);
      const x = Math.min(Math.max(e.nativeEvent.locationX, 0), trackWidth);
      setPosition((x / trackWidth) * duration);
    }}
    onResponderMove={(e) => {
      const x = Math.min(Math.max(e.nativeEvent.locationX, 0), trackWidth);
      setPosition((x / trackWidth) * duration);
    }}
    onResponderRelease={(e) => {
      const x = Math.min(Math.max(e.nativeEvent.locationX, 0), trackWidth);
      handleSeek((x / trackWidth) * duration);
    }}
  >
    {/* Track background */}
    <View style={styles.progressTrack}>
      {/* Filled portion */}
      <View
        style={[
          styles.progressFill,
          { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' },
        ]}
      />
    </View>
    {/* Thumb */}
    <View
      style={[
        styles.progressThumb,
        {
          left: duration > 0
            ? (position / duration) * trackWidth - 8
            : -8,
        },
      ]}
    />
  </View>

  <View style={styles.timeRow}>
    <Text style={styles.timeText}>{formatTime(position)}</Text>
    <Text style={styles.timeText}>{formatTime(duration)}</Text>
  </View>
</View>
        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPrevSong}>
            <Ionicons name="play-skip-back" size={25} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={async () => {
            if (!sound) return;
            const status = await sound.getStatusAsync();
            if (!status.isLoaded) return;
            const newPos = Math.max(0, position - 10000);
            await sound.setPositionAsync(newPos);
            setPosition(newPos);
          }}>
            <MaterialIcons name="replay-10" size={27} color="black" />
          </TouchableOpacity>

          <Pressable
            style={styles.playButton}
            onPress={() => playSong(displaySong)}
          >
            <Ionicons
              name={currentSong?.id === displaySong.id && isPlaying ? 'pause' : 'play'}
              size={30}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </Pressable>

          <TouchableOpacity onPress={async () => {
            if (!sound) return;
            const status = await sound.getStatusAsync();
            if (!status.isLoaded) return;
            const newPos = Math.min(duration, position + 10000);
            await sound.setPositionAsync(newPos);
            setPosition(newPos);
          }}>
            <MaterialIcons name="forward-10" size={27} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNextSong}>
            <Ionicons name="play-skip-forward" size={25} color="black" />
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={() => setShuffle(!shuffle)}>
            <Ionicons name="shuffle" size={24} color={shuffle ? '#ff8c1a' : 'black'} />
          </TouchableOpacity>

          <MaterialCommunityIcons name="speedometer" size={24} color="black" />
          <MaterialCommunityIcons name="timer-outline" size={24} color="black" />

          <TouchableOpacity onPress={() => setRepeat(!repeat)}>
            <Ionicons name="repeat" size={24} color={repeat ? '#ff8c1a' : 'black'} />
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
    marginTop: 5,
  },
  progressTrackWrapper: {
  height: 20,          // bada touch area
  justifyContent: 'center',
  position: 'relative',
},
  progressContainer: { marginTop: 30,paddingHorizontal:4, },
  progressTrack: {
    height: 4,
  backgroundColor: '#E8E8E8',
  borderRadius: 4,
  overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#ff8c1a',
    borderRadius: 4,
    
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    fontWeight:'500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
    marginVertical: 8,
  },

progressThumb: {
   width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: '#ff8c1a',
  position: 'absolute',
  top: 1,             // (36 - 16) / 2 = center vertically
  shadowColor: '#ff8c1a',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.4,
  shadowRadius: 4,
  elevation: 4,
},


});