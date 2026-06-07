import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, Modal, Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { searchAlbums } from '../services/albumService';
import { decodeHtml } from '../utils/decodeHtml';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const MENU_ITEMS = [
  { id: 'play',     label: 'Play',                 icon: 'play-circle-outline' },
  { id: 'next',     label: 'Play Next',            icon: 'play-forward-outline' },
  { id: 'queue',    label: 'Add to Playing Queue', icon: 'list-outline' },
  { id: 'playlist', label: 'Add to Playlist',      icon: 'add-circle-outline' },
  { id: 'share',    label: 'Share',                icon: 'share-outline' },
];

const AlbumsContent = () => {
  const navigation = useNavigation<any>();
  const [albums, setAlbums] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const data = await searchAlbums('arijit');
      setAlbums(data.data.results || []);
    } catch (e) {
      console.log(e);
    }
  };

  const renderAlbum = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('Album', {
          albumId: item.id,
          albumName: item.name,
          albumImage: item.image?.[2]?.url,
          albumYear: item.year,
          albumArtist: item.artists?.primary?.[0]?.name ?? '',
        })
      }
      activeOpacity={0.75}
    >
      <Image
        source={{ uri: item.image?.[2]?.url }}
        style={styles.cardImage}
      />
      {/* 3 dot */}
      <TouchableOpacity
        style={styles.dotBtn}
        onPress={() => {
          setSelectedAlbum(item);
          setShowMenu(true);
        }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#555" />
      </TouchableOpacity>

      <Text style={styles.cardName} numberOfLines={1}>
        {decodeHtml(item.name)}
      </Text>
      <Text style={styles.cardMeta} numberOfLines={1}>
        {item.artists?.primary?.[0]?.name ?? ''}
        {item.year ? `  |  ${item.year}` : ''}
      </Text>
      <Text style={styles.cardSongs}>
        {item.songCount ? `${item.songCount} songs` : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Header */}
      <View style={styles.listHeader}>
        <Text style={styles.countText}>{albums.length} albums</Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>Date Modified</Text>
          <Ionicons name="swap-vertical-outline" size={15} color="#ff8c1a" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={renderAlbum}
      />

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Image
                source={{ uri: selectedAlbum?.image?.[2]?.url }}
                style={styles.sheetThumb}
              />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetName} numberOfLines={1}>
                  {decodeHtml(selectedAlbum?.name ?? '')}
                </Text>
                <Text style={styles.sheetMeta}>
                  {selectedAlbum?.artists?.primary?.[0]?.name ?? ''}
                  {selectedAlbum?.year ? `  |  ${selectedAlbum.year}` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {MENU_ITEMS.map((menuItem) => (
              <TouchableOpacity
                key={menuItem.id}
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  if (menuItem.id === 'play') {
                    navigation.navigate('Album', {
                      albumId: selectedAlbum?.id,
                      albumName: selectedAlbum?.name,
                      albumImage: selectedAlbum?.image?.[2]?.url,
                      albumYear: selectedAlbum?.year,
                      albumArtist: selectedAlbum?.artists?.primary?.[0]?.name,
                    });
                  }
                }}
              >
                <Ionicons
                  name={menuItem.icon as any}
                  size={22}
                  color="#333"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuLabel}>{menuItem.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AlbumsContent;

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countText: { fontSize: 15, fontWeight: '700', color: '#111' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortText: { fontSize: 13, color: '#ff8c1a', fontWeight: '600' },

  row: { justifyContent: 'space-between', marginBottom: 20 },

  card: {
    width: CARD_WIDTH,
    position: 'relative',
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 12,
  },
  dotBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginTop: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardSongs: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },

  // Modal
  overlay: {
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
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
  sheetName: { fontSize: 16, fontWeight: '700', color: '#111' },
  sheetMeta: { fontSize: 13, color: '#888', marginTop: 3 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  menuIcon: { width: 32 },
  menuLabel: { fontSize: 15, color: '#222', marginLeft: 10 },
});