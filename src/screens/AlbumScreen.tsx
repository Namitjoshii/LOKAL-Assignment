import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView,
  StyleSheet, ActivityIndicator,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAlbumById } from '../services/albumService';
import { decodeHtml } from '../utils/decodeHtml';
import { usePlayerStore } from '../store/playerStore';

const { width } = Dimensions.get('window');

const AlbumScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { albumId, albumName, albumImage, albumYear, albumArtist } = route.params;

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue } = usePlayerStore();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAlbumById(albumId);
        console.log('ALBUM DETAIL:', JSON.stringify(res, null, 2));
        const songList = res.data?.songs ?? [];
        setSongs(songList);
        setQueue(songList);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [albumId]);

  const totalSecs = songs.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0);
  const mins = Math.floor(totalSecs / 60);

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#ff8c1a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={26} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <Image source={{ uri: albumImage }} style={styles.albumImage} />

        {/* Info */}
        <View style={styles.infoBlock}>
          <Text style={styles.albumName}>{decodeHtml(albumName ?? '')}</Text>
          <Text style={styles.albumMeta}>
            {albumArtist}
            {albumYear ? `  |  ${albumYear}` : ''}
            {mins > 0 ? `  |  ${mins} mins` : ''}
          </Text>
        </View>

        {/* Shuffle + Play */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.shuffleBtn}
            onPress={() => {
              if (songs.length > 0) {
                const random = songs[Math.floor(Math.random() * songs.length)];
                navigation.navigate('Player', { song: random, songs });
              }
            }}
          >
            <Ionicons name="shuffle" size={18} color="#ff8c1a" />
            <Text style={styles.shuffleText}>Shuffle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => {
              if (songs.length > 0) {
                navigation.navigate('Player', { song: songs[0], songs });
              }
            }}
          >
            <Ionicons name="play" size={18} color="#ff8c1a" />
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
        </View>

        {/* Songs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Songs</Text>
          <Text style={styles.songCount}>{songs.length} songs</Text>
        </View>

        {songs.map((item, index) => (
          <TouchableOpacity
            key={item.id ?? index}
            style={styles.songRow}
            onPress={() => navigation.navigate('Player', { song: item, songs })}
            activeOpacity={0.75}
          >
            <Text style={styles.songIndex}>{index + 1}</Text>
            <Image
              source={{ uri: item.image?.[2]?.url ?? item.image?.[1]?.url }}
              style={styles.songThumb}
            />
            <View style={styles.songInfo}>
              <Text style={styles.songName} numberOfLines={1}>
                {decodeHtml(item.name)}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {item.primaryArtists ?? item.artists?.primary?.[0]?.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.songPlayBtn}
              onPress={() => navigation.navigate('Player', { song: item, songs })}
            >
              <Ionicons name="play" size={14} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 6 }}>
              <Ionicons name="ellipsis-vertical" size={18} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  albumImage: {
    width: width - 80,
    height: width - 80,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  infoBlock: { alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
  albumName: { fontSize: 24, fontWeight: '800', color: '#111', textAlign: 'center' },
  albumMeta: { fontSize: 13, color: '#888', marginTop: 6, textAlign: 'center' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  shuffleBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 8, paddingVertical: 13,
    borderRadius: 30, borderWidth: 1.5, borderColor: '#ff8c1a',
  },
  shuffleText: { color: '#ff8c1a', fontWeight: '700', fontSize: 15 },
  playBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 8, paddingVertical: 13,
    borderRadius: 30, borderWidth: 1.5, borderColor: '#ff8c1a',
  },
  playText: { color: '#ff8c1a', fontWeight: '700', fontSize: 15 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, marginTop: 28, marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  songCount: { fontSize: 13, color: '#888' },
  songRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  songIndex: { fontSize: 13, color: '#bbb', width: 24, textAlign: 'center' },
  songThumb: { width: 46, height: 46, borderRadius: 8 },
  songInfo: { flex: 1, marginLeft: 12 },
  songName: { fontSize: 14, fontWeight: '600', color: '#111' },
  songArtist: { fontSize: 12, color: '#888', marginTop: 3 },
  songPlayBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#ff8c1a', justifyContent: 'center',
    alignItems: 'center', marginRight: 4,
  },
});