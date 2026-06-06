import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Song } from '../types/song';
import { Ionicons } from '@expo/vector-icons';
import { decodeHtml } from '../utils/decodeHtml';

interface SongCardProps {
  song: Song;
  onPress: () => void;
  onMenuPress: () => void;
  onPlayPress:() => void;
}

const SongCard = ({
  song,
  onPress,
  onMenuPress,
  onPlayPress,
}: SongCardProps) => {
  return (
    <View style={styles.container}>
  <TouchableOpacity
    style={styles.songArea}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image
      source={{
        uri: song.image?.[2]?.url,
      }}
      style={styles.image}
    />

    <View style={styles.info}>
      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {decodeHtml(song.name)}
      </Text>

      <Text
        style={styles.artist}
        numberOfLines={1}
      >
        {song.primaryArtists}
      </Text>
    </View>
  </TouchableOpacity>

  <View style={styles.actions}>
    <TouchableOpacity
  style={styles.playButton}
  onPress={onPlayPress}
>
      <Ionicons
        name="play"
        size={14}
        color="white"
      />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.menuButton}
      onPress={onMenuPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name="ellipsis-vertical"
        size={20}
        color="black"
      />
    </TouchableOpacity>
  </View>
</View>
  );
};

export default SongCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  songArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  artist: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },

  menuButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menu: {
    fontSize: 24,
  },
  actions: {
  flexDirection: 'row',
  alignItems: 'center',
},

playButton: {
  width: 26,
  height: 26,
  borderRadius: 14,
  backgroundColor: '#ff8c1a',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 3
},
});